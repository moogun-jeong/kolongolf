const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, authorization"
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

const allowedStatuses = new Set(["pending", "visible", "hidden"]);
const maxImages = 4;
const maxImageLength = 380000;
const maxTotalImageLength = 1200000;

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

const getAdminToken = (request) => {
  const auth = request.headers.get("authorization") || "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return normalize(match?.[1] || "", 2048);
};

const requireAdmin = (request, env) => {
  const configured = normalize(env.ADMIN_TOKEN, 2048);
  if (!configured) throw json({ error: "관리자 비밀번호가 아직 설정되지 않았습니다." }, { status: 503 });
  if (getAdminToken(request) !== configured) throw json({ error: "관리자 비밀번호가 올바르지 않습니다." }, { status: 401 });
};

const ensureTables = async (db) => {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS archive_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      label TEXT,
      location TEXT,
      people TEXT,
      summary TEXT NOT NULL,
      author_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'visible', 'hidden')),
      ip_hash TEXT,
      user_agent_hash TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS archive_post_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      archive_post_id INTEGER NOT NULL,
      image_data_url TEXT NOT NULL,
      alt TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'visible' CHECK (status IN ('visible', 'hidden')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (archive_post_id) REFERENCES archive_posts(id) ON DELETE CASCADE
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_archive_posts_status_date ON archive_posts (status, date DESC, id DESC)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_archive_post_images_post_order ON archive_post_images (archive_post_id, sort_order)")
  ]);
};

const checkRateLimit = async (request, env, db) => {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const salt = env.MESSAGE_SALT || "kolongolf";
  const ipHash = await hashValue(`${salt}:archive:${ip}`);
  const userAgentHash = await hashValue(`${salt}:${userAgent}`);
  const recent = await db
    .prepare("SELECT COUNT(*) AS count FROM archive_posts WHERE ip_hash = ? AND created_at > datetime('now', '-10 minutes')")
    .bind(ipHash)
    .first();

  if (Number(recent?.count || 0) >= 2) {
    throw json({ error: "아카이브 신청이 잠시 많습니다. 조금 뒤 다시 시도해주세요." }, { status: 429 });
  }

  return { ipHash, userAgentHash };
};

const validateImages = (images) => {
  if (!Array.isArray(images) || images.length < 1) {
    throw json({ error: "사진을 1장 이상 올려주세요." }, { status: 400 });
  }
  if (images.length > maxImages) {
    throw json({ error: `사진은 최대 ${maxImages}장까지 올릴 수 있습니다.` }, { status: 400 });
  }

  let total = 0;
  return images.map((image, index) => {
    const dataUrl = normalize(image?.dataUrl, maxImageLength + 100);
    const alt = normalize(image?.alt, 120);
    if (!/^data:image\/(jpeg|jpg|png|webp);base64,[a-z0-9+/=]+$/i.test(dataUrl)) {
      throw json({ error: "지원하지 않는 사진 형식입니다." }, { status: 400 });
    }
    if (dataUrl.length > maxImageLength) {
      throw json({ error: "사진 용량이 큽니다. 더 작은 사진으로 올려주세요." }, { status: 400 });
    }
    total += dataUrl.length;
    if (total > maxTotalImageLength) {
      throw json({ error: "사진 전체 용량이 큽니다. 사진 수를 줄여주세요." }, { status: 400 });
    }
    return { dataUrl, alt, sortOrder: index };
  });
};

const loadImagesForPosts = async (db, posts) => {
  const items = await Promise.all(posts.map(async (post) => {
    const images = await db
      .prepare(`SELECT id, image_data_url AS dataUrl, alt, sort_order AS sortOrder, status
                FROM archive_post_images
                WHERE archive_post_id = ? AND status = 'visible'
                ORDER BY sort_order ASC, id ASC`)
      .bind(post.id)
      .all();
    return { ...post, images: images.results || [] };
  }));
  return items;
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function onRequestGet({ request, env }) {
  try {
    const db = requireDatabase(env);
    await ensureTables(db);
    const url = new URL(request.url);
    const isAdmin = url.searchParams.get("admin") === "1";
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 12, 1), isAdmin ? 200 : 24);

    if (isAdmin) requireAdmin(request, env);

    const result = isAdmin
      ? await db
          .prepare(`SELECT id, title, date, label, location, people, summary, author_name AS authorName, status, created_at AS createdAt, updated_at AS updatedAt
                    FROM archive_posts
                    ORDER BY created_at DESC, id DESC
                    LIMIT ?`)
          .bind(limit)
          .all()
      : await db
          .prepare(`SELECT id, title, date, label, location, people, summary, author_name AS authorName, status, created_at AS createdAt, updated_at AS updatedAt
                    FROM archive_posts
                    WHERE status = 'visible'
                    ORDER BY date DESC, id DESC
                    LIMIT ?`)
          .bind(limit)
          .all();

    const items = await loadImagesForPosts(db, result.results || []);
    return json({ items });
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: "아카이브를 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const db = requireDatabase(env);
    await ensureTables(db);
    const payload = await request.json().catch(() => ({}));
    const title = normalize(payload.title, 80);
    const date = normalize(payload.date, 20);
    const label = normalize(payload.label, 40);
    const location = normalize(payload.location, 80);
    const people = normalize(payload.people, 40);
    const summary = normalize(payload.summary, 500);
    const authorName = normalize(payload.authorName, 24);
    const images = validateImages(payload.images);

    if (!title || !date || !location || !summary || !authorName) {
      return json({ error: "이름, 날짜, 제목, 장소, 내용을 모두 입력해주세요." }, { status: 400 });
    }

    const { ipHash, userAgentHash } = await checkRateLimit(request, env, db);
    const postResult = await db
      .prepare(`INSERT INTO archive_posts (
        title, date, label, location, people, summary, author_name, status, ip_hash, user_agent_hash, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, datetime('now'), datetime('now'))`)
      .bind(title, date, label, location, people, summary, authorName, ipHash, userAgentHash)
      .run();
    const postId = postResult.meta?.last_row_id;

    if (!postId) throw new Error("Missing archive post id");

    await db.batch(images.map((image) =>
      db
        .prepare(`INSERT INTO archive_post_images (archive_post_id, image_data_url, alt, sort_order, status, created_at)
                  VALUES (?, ?, ?, ?, 'visible', datetime('now'))`)
        .bind(postId, image.dataUrl, image.alt || title, image.sortOrder)
    ));

    return json({ ok: true, id: postId, status: "pending" }, { status: 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: "아카이브를 저장하지 못했습니다." }, { status: 500 });
  }
}

export async function onRequestPatch({ request, env }) {
  try {
    const db = requireDatabase(env);
    await ensureTables(db);
    requireAdmin(request, env);
    const payload = await request.json().catch(() => ({}));
    const id = Number(payload.id);
    const status = normalize(payload.status, 16);
    if (!Number.isInteger(id) || id < 1) return json({ error: "아카이브를 찾을 수 없습니다." }, { status: 400 });
    if (!allowedStatuses.has(status)) return json({ error: "사용할 수 없는 상태입니다." }, { status: 400 });

    const result = await db
      .prepare("UPDATE archive_posts SET status = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(status, id)
      .run();
    return json({ ok: true, changed: result.meta?.changes || 0 });
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: "아카이브 상태를 바꾸지 못했습니다." }, { status: 500 });
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const db = requireDatabase(env);
    await ensureTables(db);
    requireAdmin(request, env);
    const payload = await request.json().catch(() => ({}));
    const id = Number(payload.id);
    if (!Number.isInteger(id) || id < 1) return json({ error: "아카이브를 찾을 수 없습니다." }, { status: 400 });

    await db.batch([
      db.prepare("DELETE FROM archive_post_images WHERE archive_post_id = ?").bind(id),
      db.prepare("DELETE FROM archive_posts WHERE id = ?").bind(id)
    ]);
    return json({ ok: true, deleted: 1 });
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: "아카이브를 삭제하지 못했습니다." }, { status: 500 });
  }
}
