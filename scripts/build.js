// 공개 배포용 `dist/`를 만드는 최소 빌드입니다. 번들러 없이 Node 기본 모듈만 씁니다.
//
// 저장소 루트를 그대로 배포하면 개발 로그, 설계 문서, migration SQL, wrangler 설정까지
// 함께 공개됩니다. 이 스크립트는 allowlist에 있는 파일만 `dist/`로 복사해
// 배포 범위를 홈페이지 동작에 필요한 파일로 제한합니다. Cloudflare Pages에서는
// 과거 루트 배포의 CDN 캐시를 무효화할 무해한 tombstone도 조건부로 만듭니다.
//
// Cloudflare Pages Functions(`functions/`)는 정적 자산이 아니라 빌드 시 번들되므로
// `dist/`에 넣지 않습니다.

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "dist");

// 홈페이지가 실제로 필요로 하는 루트 파일만 배포합니다.
const rootAllowlist = [
  { file: "index.html", required: true },
  { file: "404.html", required: false },
  { file: "main.js", required: true },
  { file: "style.css", required: true },
  { file: "_routes.json", required: true },
  { file: "_headers", required: false },
  { file: "robots.txt", required: false },
  { file: "sitemap.xml", required: false },
  { file: ".nojekyll", required: false }
];

// 예전 저장소 루트 배포에서 공개됐던 경로입니다. Cloudflare Tiered Cache에 남은
// 원본 asset hash를 교체하고 functions/_middleware.js가 404로 응답하게 합니다.
// CF_PAGES와 임시 운영 flag가 모두 있을 때만 만듭니다.
const cloudflareTombstoneRoots = [
  ".gitignore",
  ".replit",
  "AGENTS.md",
  "FINAL_IMPROVEMENT_PLAN.md",
  "GEMINI.md",
  "HOMEPAGE_REVIEW.md",
  "PRIORITY_IMPROVEMENT_PLAN.md",
  "PROJECT_LOG.md",
  "README.md",
  "REPLIT_MIGRATION_AUDIT.md",
  "TASK.md",
  "blueprint.md",
  "home1.png",
  "home2.png",
  "home_redisign.md",
  "image.png",
  "kolongolf",
  "mobile1.png",
  "notice.png",
  "package-lock.json",
  "package.json",
  "wrangler.toml",
  "images/20260704 MOV.mov",
  "images/waacky.png"
];

const cloudflareTombstoneDirectories = [
  ".github",
  ".idx",
  ".vscode",
  "functions",
  "lib",
  "migrations",
  "scripts",
  "sql"
];

// 이미지 참조를 찾을 소스입니다.
const referenceSources = ["index.html", "main.js", "style.css"];
const imageReferencePattern = /images\/[A-Za-z0-9][A-Za-z0-9._-]*\.(?:jpe?g|png|webp|avif|svg)/gi;

// main.js의 thumbSource()가 `-display` 경로에서 `-thumb`을 유도하므로 짝을 함께 담습니다.
const thumbCounterpart = (reference) => reference.replace(/-display\.(jpe?g|png|webp|avif)$/i, "-thumb.$1");

const collectReferencedImages = () => {
  const references = new Set();
  for (const source of referenceSources) {
    const sourcePath = path.join(root, source);
    if (!fs.existsSync(sourcePath)) continue;
    const content = fs.readFileSync(sourcePath, "utf8");
    for (const match of content.match(imageReferencePattern) || []) {
      references.add(match);
      references.add(thumbCounterpart(match));
    }
  }
  return [...references].sort();
};

const copyFile = (relativePath) => {
  const from = path.join(root, relativePath);
  const to = path.join(outDir, relativePath);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
};

const collectFiles = (relativeDirectory) => {
  const directory = path.join(root, relativeDirectory);
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) return collectFiles(relativePath);
    return entry.isFile() ? [relativePath] : [];
  });
};

const writeCloudflareTombstones = () => {
  if (
    process.env.CF_PAGES !== "1" ||
    process.env.CLOUDFLARE_CACHE_TOMBSTONES !== "1"
  ) {
    return 0;
  }

  const files = new Set([
    ...cloudflareTombstoneRoots,
    ...cloudflareTombstoneDirectories.flatMap(collectFiles)
  ]);

  for (const relativePath of files) {
    const target = path.join(outDir, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, "404 Not Found", "utf8");
  }

  return files.size;
};

const build = () => {
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const missingRequired = [];
  const copied = [];
  const skipped = [];

  for (const { file, required } of rootAllowlist) {
    if (!fs.existsSync(path.join(root, file))) {
      if (required) missingRequired.push(file);
      else skipped.push(file);
      continue;
    }
    copyFile(file);
    copied.push(file);
  }

  const missingImages = [];
  let imageCount = 0;
  for (const reference of collectReferencedImages()) {
    if (!fs.existsSync(path.join(root, reference))) {
      missingImages.push(reference);
      continue;
    }
    copyFile(reference);
    imageCount += 1;
  }

  const tombstoneCount = writeCloudflareTombstones();

  if (missingRequired.length) {
    console.error(`[build] 필수 파일이 없습니다: ${missingRequired.join(", ")}`);
    process.exitCode = 1;
    return;
  }

  console.log(`[build] dist/ 생성 완료`);
  console.log(`[build] 루트 파일 ${copied.length}개: ${copied.join(", ")}`);
  if (skipped.length) console.log(`[build] 없어서 건너뛴 선택 파일: ${skipped.join(", ")}`);
  console.log(`[build] 이미지 ${imageCount}개 복사`);
  if (tombstoneCount) console.log(`[build] Cloudflare 캐시 무효화 tombstone ${tombstoneCount}개 생성`);
  if (missingImages.length) {
    // 참조는 있는데 파일이 없으면 화면이 깨지므로 눈에 띄게 알립니다.
    console.warn(`[build] 참조되었지만 파일이 없는 이미지 ${missingImages.length}개: ${missingImages.join(", ")}`);
  }
};

build();
