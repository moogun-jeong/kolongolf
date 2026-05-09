const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type"
};

const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...corsHeaders,
      ...(init.headers || {})
    }
  });

const allowedTypes = new Set(["guestbook", "archive_comment"]);

const normalize = (value, maxLength) =>
  String(value || "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .trim()
    .slice(0, maxLength);

const hashValue = async (value) => {
  const input = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const requireDatabase = (env) => {
  if (!env.DB) throw json({ error: "D1 DB binding(DB) is required." }, { status: 503 });
  return env.DB;
};

const validateTurnstile = async (request, env, token) => {
  if (!env.TURNSTILE_SECRET_KEY) return;
  if (!token) {
    throw json({ error: "Security verification is required." }, { status: 400 });
  }

  const remoteip = request.headers.get("CF-Connecting-IP") || "";
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip
    })
  });
  const result = await response.json();
  if (!result.success) {
    throw json({ error: "Security verification failed. Please try again." }, { status: 400 });
  }
};

const checkRateLimit = async (request, env, db) => {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const salt = env.MESSAGE_SALT || "kolongolf";
  const ipHash = await hashValue(`${salt}:${ip}`);
  const userAgentHash = await hashValue(`${salt}:${userAgent}`);
  const recent = await db
    .prepare("SELECT COUNT(*) AS count FROM messages WHERE ip_hash = ? AND created_at > datetime('now', '-1 minute')")
    .bind(ipHash)
    .first();

  if (Number(recent?.count || 0) >= 5) {
    throw json({ error: "Too many messages. Please try again in a moment." }, { status: 429 });
  }

  return { ipHash, userAgentHash };
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function onRequestGet({ request, env }) {
  try {
    const db = requireDatabase(env);
    const url = new URL(request.url);
    const type = normalize(url.searchParams.get("type"), 32) || "guestbook";
    const archiveId = normalize(url.searchParams.get("archiveId"), 80);
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 20, 1), 50);

    if (!allowedTypes.has(type)) return json({ error: "Unsupported message type." }, { status: 400 });
    if (type === "archive_comment" && !archiveId) {
      return json({ error: "archiveId is required for archive comments." }, { status: 400 });
    }

    const statement =
      type === "guestbook"
        ? db
            .prepare(
              `SELECT id, type, archive_id AS archiveId, author_name AS authorName, body, created_at AS createdAt
               FROM messages
               WHERE type = ? AND archive_id IS NULL AND status = 'visible'
               ORDER BY created_at DESC
               LIMIT ?`
            )
            .bind(type, limit)
        : db
            .prepare(
              `SELECT id, type, archive_id AS archiveId, author_name AS authorName, body, created_at AS createdAt
               FROM messages
               WHERE type = ? AND archive_id = ? AND status = 'visible'
               ORDER BY created_at DESC
               LIMIT ?`
            )
            .bind(type, archiveId, limit);

    const result = await statement.all();
    return json({ items: result.results || [] });
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: "Could not load messages." }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const db = requireDatabase(env);
    const payload = await request.json().catch(() => ({}));
    const type = normalize(payload.type, 32) || "guestbook";
    const archiveId = normalize(payload.archiveId, 80);
    const authorName = normalize(payload.authorName, 20);
    const body = normalize(payload.body, 500);
    const turnstileToken = normalize(payload.turnstileToken, 2048);

    if (!allowedTypes.has(type)) return json({ error: "Unsupported message type." }, { status: 400 });
    if (type === "archive_comment" && !archiveId) {
      return json({ error: "archiveId is required for archive comments." }, { status: 400 });
    }
    if (authorName.length < 1 || body.length < 1) {
      return json({ error: "Name and message are required." }, { status: 400 });
    }

    await validateTurnstile(request, env, turnstileToken);
    const { ipHash, userAgentHash } = await checkRateLimit(request, env, db);
    const storedArchiveId = type === "guestbook" ? null : archiveId;

    const result = await db
      .prepare(
        `INSERT INTO messages (
          type, archive_id, author_name, body, status, ip_hash, user_agent_hash, created_at, updated_at
        ) VALUES (?, ?, ?, ?, 'visible', ?, ?, datetime('now'), datetime('now'))`
      )
      .bind(type, storedArchiveId, authorName, body, ipHash, userAgentHash)
      .run();
    const id = result.meta?.last_row_id ?? null;

    return json({
      item: {
        id,
        type,
        archiveId: storedArchiveId,
        authorName,
        body,
        createdAt: new Date().toISOString()
      }
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: "Could not save message." }, { status: 500 });
  }
}
