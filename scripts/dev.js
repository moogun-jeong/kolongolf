// Replit Run 버튼과 로컬 개발이 함께 쓰는 full stack 개발 서버입니다.
//
// 정적 파일만 띄우면 화면에서 /api를 확인할 수 없고, 예전처럼 운영 API 주소를 그대로
// 호출하면 로컬 테스트가 운영 D1 데이터를 바꿉니다. 그래서 여기서는
// `wrangler pages dev`로 정적 파일과 Functions를 같은 출처에서 띄우고,
// D1은 `.wrangler/state`에 저장되는 로컬 DB만 사용합니다(운영 D1은 건드리지 않습니다).

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync, spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const devVarsPath = path.join(root, ".dev.vars");
const localStateDir = path.join(root, ".wrangler", "state", "v3", "d1");
const port = process.env.PORT || "5000";
const host = process.env.HOST || "0.0.0.0";

// 로컬 전용 값입니다. `.dev.vars`는 .gitignore에 있어 저장소나 배포에 올라가지 않습니다.
// ALLOW_INSECURE_WRITES는 로컬에서만 Turnstile 없이 글쓰기를 허용하는 스위치이며,
// 운영 Pages 환경 변수에는 절대 넣지 않습니다.
const devVarsTemplate = `# 로컬 개발 전용 값입니다. 커밋하지 마세요(.gitignore 처리됨).
ALLOW_INSECURE_WRITES = "true"
MESSAGE_SALT = "local-dev-salt"
ADMIN_TOKEN = "local-dev-admin-token"
`;

const run = (command, args, label) => {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit", shell: false });
  if (result.status !== 0) {
    console.error(`[dev] ${label} 단계가 실패했습니다.`);
    process.exit(result.status || 1);
  }
};

if (!fs.existsSync(devVarsPath)) {
  fs.writeFileSync(devVarsPath, devVarsTemplate);
  console.log("[dev] 로컬 전용 .dev.vars를 만들었습니다.");
}

run(process.execPath, [path.join(root, "scripts", "build.js")], "build");

// 로컬 D1이 아직 없으면 스키마를 넣어 방명록/댓글을 바로 테스트할 수 있게 합니다.
if (!fs.existsSync(localStateDir)) {
  console.log("[dev] 로컬 D1을 초기화합니다.");
  run(
    "npx",
    ["--no-install", "wrangler", "d1", "execute", "kolongolf-messages", "--local", "--file=./sql/local-schema.sql", "--yes"],
    "local D1 init"
  );
}

console.log(`[dev] http://${host}:${port} 에서 정적 파일과 /api를 함께 띄웁니다. (로컬 D1 사용)`);

const child = spawn(
  "npx",
  ["--no-install", "wrangler", "pages", "dev", "--ip", host, "--port", String(port)],
  { cwd: root, stdio: "inherit", shell: false }
);

child.on("exit", (code) => process.exit(code ?? 0));
