// `/api/messages`와 `/api/archives`가 함께 쓰는 보안 헬퍼입니다.
// Pages Functions 밖(`functions/` 바깥)에 두어 라우트로 노출되지 않고 번들에만 포함됩니다.

// 운영에서 쓰기를 허용할 기본 출처입니다. `ALLOWED_ORIGINS` 환경 변수로 덮어쓸 수 있습니다.
export const DEFAULT_ALLOWED_ORIGINS = [
  "https://kolongolf.pages.dev",
  "https://moogun-jeong.github.io"
];

const LOCAL_ORIGIN_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;
const LOCAL_HOST_SUFFIXES = [".replit.dev", ".repl.co", ".app.github.dev", ".janeway.replit.dev"];
const MIN_ADMIN_TOKEN_LENGTH = 16;
const ADMIN_FAIL_LIMIT = 5;
const ADMIN_FAIL_WINDOW_MS = 10 * 60 * 1000;
const ADMIN_FAIL_MAP_LIMIT = 500;

// 로컬 개발에서만 Turnstile/salt 없이 쓰기를 허용하는 스위치입니다.
// 운영 Pages 환경 변수에는 절대 넣지 않습니다(`.dev.vars` 전용).
export const isDevWriteMode = (env) =>
  String(env?.ALLOW_INSECURE_WRITES || "").toLowerCase() === "true";

export const normalize = (value, maxLength) =>
  String(value || "")
    .replace(/[^\P{Cc}\n\r\t]/gu, "")
    .trim()
    .slice(0, maxLength);

export const hashValue = async (value) => {
  const input = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const isLocalOrigin = (origin) => {
  if (LOCAL_ORIGIN_PATTERN.test(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    return LOCAL_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
  } catch {
    return false;
  }
};

export const resolveAllowedOrigins = (request, env) => {
  const configured = String(env?.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const origins = new Set(configured.length ? configured : DEFAULT_ALLOWED_ORIGINS);
  // 같은 출처에서 온 요청(Pages 자기 도메인, 미리보기 배포)은 항상 허용합니다.
  try {
    origins.add(new URL(request.url).origin);
  } catch {
    // URL을 해석하지 못하면 설정된 목록만 사용합니다.
  }
  return origins;
};

export const isAllowedOrigin = (request, env, origin) => {
  if (!origin) return false;
  if (resolveAllowedOrigins(request, env).has(origin)) return true;
  return isDevWriteMode(env) && isLocalOrigin(origin);
};

export const corsHeaders = (request, env) => {
  const origin = request.headers.get("Origin") || "";
  return {
    // 조회는 공개이므로 허용 목록 밖 출처에도 `*`로 응답합니다.
    // 쓰기는 아래 requireAllowedOrigin에서 별도로 막습니다.
    "access-control-allow-origin": isAllowedOrigin(request, env, origin) ? origin : "*",
    "access-control-allow-methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, authorization",
    "access-control-max-age": "600",
    vary: "Origin"
  };
};

// 요청마다 CORS 헤더가 달라지므로 응답 생성기를 요청 단위로 만듭니다.
export const createResponder = (request, env) => (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...corsHeaders(request, env),
      ...(init.headers || {})
    }
  });

export const preflightResponse = (request, env) =>
  new Response(null, { status: 204, headers: corsHeaders(request, env) });

// 브라우저는 GET/HEAD를 제외한 모든 요청에 Origin을 보냅니다.
// Origin이 없거나 허용 목록 밖이면 쓰기를 거부합니다(CSRF·스크립트 남용 방지).
export const requireAllowedOrigin = (request, env, json) => {
  const origin = request.headers.get("Origin") || "";
  if (!isAllowedOrigin(request, env, origin)) {
    throw json({ error: "허용되지 않은 접속 경로에서 온 요청입니다." }, { status: 403 });
  }
};

export const requireDatabase = (env, json) => {
  if (!env?.DB) throw json({ error: "D1 DB binding(DB) is required." }, { status: 503 });
  return env.DB;
};

// 해시 salt가 없으면 IP 해시가 예측 가능해지므로 운영에서는 쓰기를 막습니다.
export const requireSalt = (env, json) => {
  const salt = normalize(env?.MESSAGE_SALT, 256);
  if (salt) return salt;
  if (isDevWriteMode(env)) return "local-dev-only-salt";
  throw json({ error: "서버 보안 설정이 끝나지 않아 지금은 글을 남길 수 없습니다." }, { status: 503 });
};

// Turnstile은 fail-closed입니다. secret이 없으면 운영에서는 저장하지 않습니다.
export const requireTurnstile = async (request, env, json, token) => {
  const secret = normalize(env?.TURNSTILE_SECRET_KEY, 2048);
  if (!secret) {
    if (isDevWriteMode(env)) return;
    throw json({ error: "보안 확인 설정이 끝나지 않아 지금은 글을 남길 수 없습니다." }, { status: 503 });
  }
  if (!token) {
    throw json({ error: "보안 확인을 먼저 완료해주세요." }, { status: 400 });
  }

  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  const remoteip = request.headers.get("CF-Connecting-IP");
  if (remoteip) form.append("remoteip", remoteip);

  let result;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form
    });
    result = await response.json();
  } catch {
    throw json({ error: "보안 확인 서버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요." }, { status: 503 });
  }

  // 이미 사용한 토큰은 siteverify가 timeout-or-duplicate로 거절합니다.
  if (!result?.success) {
    throw json({ error: "보안 확인에 실패했습니다. 다시 시도해주세요." }, { status: 400 });
  }
};

export const getClientFingerprint = async (request, salt, scope = "") => {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const prefix = scope ? `${salt}:${scope}` : salt;
  return {
    ipHash: await hashValue(`${prefix}:${ip}`),
    userAgentHash: await hashValue(`${salt}:${userAgent}`)
  };
};

const timingSafeEqual = (left, right) => {
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) diff |= a[index] ^ b[index];
  return diff === 0;
};

const getBearerToken = (request) => {
  const auth = request.headers.get("authorization") || "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return normalize(match?.[1] || "", 2048);
};

// D1 스키마를 바꾸지 않기 위해 isolate 메모리로만 인증 실패를 제한합니다.
// 완전한 방어는 아니지만 단순 무차별 대입 속도를 크게 낮춥니다.
const adminFailures = new Map();

const pruneAdminFailures = (now) => {
  for (const [key, entry] of adminFailures) {
    if (entry.resetAt <= now) adminFailures.delete(key);
  }
  if (adminFailures.size > ADMIN_FAIL_MAP_LIMIT) adminFailures.clear();
};

export const requireAdmin = (request, env, json) => {
  const configured = normalize(env?.ADMIN_TOKEN, 2048);
  if (!configured) {
    throw json({ error: "관리자 비밀번호가 아직 설정되지 않았습니다." }, { status: 503 });
  }
  if (configured.length < MIN_ADMIN_TOKEN_LENGTH) {
    throw json(
      { error: `관리자 비밀번호가 너무 짧습니다. ${MIN_ADMIN_TOKEN_LENGTH}자 이상으로 다시 설정해주세요.` },
      { status: 503 }
    );
  }

  const now = Date.now();
  pruneAdminFailures(now);
  const key = request.headers.get("CF-Connecting-IP") || "unknown";
  const entry = adminFailures.get(key);

  if (entry && entry.count >= ADMIN_FAIL_LIMIT && entry.resetAt > now) {
    throw json({ error: "관리자 인증 시도가 너무 많습니다. 잠시 후 다시 시도해주세요." }, { status: 429 });
  }

  if (!timingSafeEqual(getBearerToken(request), configured)) {
    const next = entry && entry.resetAt > now ? entry : { count: 0, resetAt: now + ADMIN_FAIL_WINDOW_MS };
    next.count += 1;
    adminFailures.set(key, next);
    throw json({ error: "관리자 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  adminFailures.delete(key);
};
