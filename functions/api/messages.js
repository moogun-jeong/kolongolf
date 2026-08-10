import {
  createResponder,
  getClientFingerprint,
  normalize,
  preflightResponse,
  requireAdmin,
  requireAllowedOrigin,
  requireDatabase,
  requireSalt,
  requireTurnstile
} from "../../lib/api-security.mjs";

const allowedTypes = new Set(["guestbook", "archive_comment"]);
const allowedStatuses = new Set(["visible", "hidden"]);
const rateLimitPerMinute = 5;

const selectColumns = `id, type, archive_id AS archiveId, author_name AS authorName, body, status, created_at AS createdAt, updated_at AS updatedAt`;

const checkRateLimit = async (request, env, db, json) => {
  const salt = requireSalt(env, json);
  const { ipHash, userAgentHash } = await getClientFingerprint(request, salt);
  const recent = await db
    .prepare("SELECT COUNT(*) AS count FROM messages WHERE ip_hash = ? AND created_at > datetime('now', '-1 minute')")
    .bind(ipHash)
    .first();

  if (Number(recent?.count || 0) >= rateLimitPerMinute) {
    throw json({ error: "글을 너무 자주 남기고 있습니다. 잠시 후 다시 시도해주세요." }, { status: 429 });
  }

  return { ipHash, userAgentHash };
};

const parseMessageId = async (request, json) => {
  const url = new URL(request.url);
  const body = await request.json().catch(() => ({}));
  const id = Number(body.id || url.searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) {
    throw json({ error: "삭제하거나 수정할 글을 찾을 수 없습니다." }, { status: 400 });
  }
  return { id, body };
};

export async function onRequestOptions({ request, env }) {
  return preflightResponse(request, env);
}

export async function onRequestGet({ request, env }) {
  const json = createResponder(request, env);
  try {
    const db = requireDatabase(env, json);
    const url = new URL(request.url);
    const isAdmin = url.searchParams.get("admin") === "1";
    const requestedType = normalize(url.searchParams.get("type"), 32);
    const archiveId = normalize(url.searchParams.get("archiveId"), 80);
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 20, 1), isAdmin ? 200 : 50);

    if (isAdmin) {
      requireAdmin(request, env, json);
      const where = [];
      const binds = [];
      if (requestedType) {
        if (!allowedTypes.has(requestedType)) return json({ error: "Unsupported message type." }, { status: 400 });
        where.push("type = ?");
        binds.push(requestedType);
      }
      if (archiveId) {
        where.push("archive_id = ?");
        binds.push(archiveId);
      }
      const result = await db
        .prepare(
          `SELECT ${selectColumns}
           FROM messages
           ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
           ORDER BY created_at DESC
           LIMIT ?`
        )
        .bind(...binds, limit)
        .all();
      return json({ items: result.results || [] });
    }

    const type = requestedType || "guestbook";
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
  const json = createResponder(request, env);
  try {
    requireAllowedOrigin(request, env, json);
    const db = requireDatabase(env, json);
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
      return json({ error: "이름과 내용을 모두 입력해주세요." }, { status: 400 });
    }

    await requireTurnstile(request, env, json, turnstileToken);
    const { ipHash, userAgentHash } = await checkRateLimit(request, env, db, json);
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

export async function onRequestPatch({ request, env }) {
  const json = createResponder(request, env);
  try {
    requireAllowedOrigin(request, env, json);
    const db = requireDatabase(env, json);
    requireAdmin(request, env, json);
    const { id, body } = await parseMessageId(request, json);
    const status = normalize(body.status, 16);
    if (!allowedStatuses.has(status)) {
      return json({ error: "사용할 수 없는 상태입니다." }, { status: 400 });
    }

    const result = await db
      .prepare("UPDATE messages SET status = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(status, id)
      .run();

    return json({ ok: true, changed: result.meta?.changes || 0 });
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: "글 상태를 변경하지 못했습니다." }, { status: 500 });
  }
}

export async function onRequestDelete({ request, env }) {
  const json = createResponder(request, env);
  try {
    requireAllowedOrigin(request, env, json);
    const db = requireDatabase(env, json);
    requireAdmin(request, env, json);
    const { id } = await parseMessageId(request, json);

    const result = await db
      .prepare("DELETE FROM messages WHERE id = ?")
      .bind(id)
      .run();

    return json({ ok: true, deleted: result.meta?.changes || 0 });
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: "글을 삭제하지 못했습니다." }, { status: 500 });
  }
}
