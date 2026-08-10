// 공개 배포용 `dist/`를 만드는 최소 빌드입니다. 번들러 없이 Node 기본 모듈만 씁니다.
//
// 저장소 루트를 그대로 배포하면 개발 로그, 설계 문서, migration SQL, wrangler 설정까지
// 함께 공개됩니다. 이 스크립트는 allowlist에 있는 파일만 `dist/`로 복사해
// 배포 범위를 홈페이지 동작에 필요한 파일로 제한합니다.
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

  if (missingRequired.length) {
    console.error(`[build] 필수 파일이 없습니다: ${missingRequired.join(", ")}`);
    process.exitCode = 1;
    return;
  }

  console.log(`[build] dist/ 생성 완료`);
  console.log(`[build] 루트 파일 ${copied.length}개: ${copied.join(", ")}`);
  if (skipped.length) console.log(`[build] 없어서 건너뛴 선택 파일: ${skipped.join(", ")}`);
  console.log(`[build] 이미지 ${imageCount}개 복사`);
  if (missingImages.length) {
    // 참조는 있는데 파일이 없으면 화면이 깨지므로 눈에 띄게 알립니다.
    console.warn(`[build] 참조되었지만 파일이 없는 이미지 ${missingImages.length}개: ${missingImages.join(", ")}`);
  }
};

build();
