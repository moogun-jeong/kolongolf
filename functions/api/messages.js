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
  if (!env.DB) throw json({ error: "D1 DB binding(DB)이 필요합니다." }, { status: 503 });
  return env.DB;
};

const validateTurnstile = async (request, env, token) => {
  if (!env.TURNSTILE_SECRET_KEY) return;
  if (!token) {
    throw json({ error: "보안 확인을 완료해주세요." }, { status: 400 });
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
    throw json({ error: "보안 확인에 실패했습니다. 다시 시도해주세요." }, { status: 400 });
  }
};

const checkRateLimit = async (request, env, db) => {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const salt = env.MESSAGE_SALT || "kolongolf";
  const ipHash = await hashValue(`${salt}:${ip}`);
  const userAgentHash = await hashValue(`${salt}:${userAgent}`);
  const windowStart = Date.now() - 60 * 1000;
  const recent = await db
    .prepare("SELECT COUNT(*) AS count FROM messages WHERE ip_hash = ? AND created_at > ?")
    .bind(ipHash, windowStart)
    .first();

  if (Number(recent?.count || 0) >= 5) {
    throw json({ error: "잠시 후 다시 남겨주세요." }, { status: 429 });
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

    if (!allowedTypes.has(type)) return json({ error: "지원하지 않는 글 유형입니다." }, { status: 400 });
    if (type === "archive_comment" && !archiveId) {
      return json({ error: "아카이브 댓글에는 archiveId가 필요합니다." }, { status: 400 });
    }

    const statement =
      type === "guestbook"
        ? db
            .prepare(
              `SELECT id, type, archive_id AS archiveId, author_name AS authorName, body, created_at AS createdAt
               FROM messages
               WHERE type = ? AND archive_id IS NULL AND status = 'published'
               ORDER BY created_at DESC
               LIMIT ?`
            )
            .bind(type, limit)
        : db
            .prepare(
              `SELECT id, type, archive_id AS archiveId, author_name AS authorName, body, created_at AS createdAt
               FROM messages
               WHERE type = ? AND archive_id = ? AND status = 'published'
               ORDER BY created_at DESC
               LIMIT ?`
            )
            .bind(type, archiveId, limit);

    const result = await statement.all();
    return json({ items: result.results || [] });
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: "글을 불러오지 못했습니다." }, { status: 500 });
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

    if (!allowedTypes.has(type)) return json({ error: "지원하지 않는 글 유형입니다." }, { status: 400 });
    if (type === "archive_comment" && !archiveId) {
      return json({ error: "아카이브 댓글에는 archiveId가 필요합니다." }, { status: 400 });
    }
    if (authorName.length < 1 || body.length < 1) {
      return json({ error: "이름과 내용을 모두 입력해주세요." }, { status: 400 });
    }

    await validateTurnstile(request, env, turnstileToken);
    const { ipHash, userAgentHash } = await checkRateLimit(request, env, db);
    const id = crypto.randomUUID();
    const now = Date.now();
    const storedArchiveId = type === "guestbook" ? null : archiveId;

    await db
      .prepare(
        `INSERT INTO messages (
          id, type, archive_id, author_name, body, status, ip_hash, user_agent_hash, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, 'published', ?, ?, ?, ?)`
      )
      .bind(id, type, storedArchiveId, authorName, body, ipHash, userAgentHash, now, now)
      .run();

    return json({
      item: {
        id,
        type,
        archiveId: storedArchiveId,
        authorName,
        body,
        createdAt: now
      }
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: "글을 저장하지 못했습니다." }, { status: 500 });
  }
}
