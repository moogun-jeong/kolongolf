// 배포 전에 도는 자동 점검입니다. `npm run check`로 따로 돌릴 수 있고,
// `npm run build`(= scripts/build.js)가 시작할 때 항상 먼저 실행합니다.
// 점검에 실패하면 build가 멈추므로 GitHub Pages와 Cloudflare Pages 모두 잘못된 내용이 배포되지 않습니다.
//
// 1. main.js / data.js 문법 검사 (ES Module로 해석)
// 2. data.js 내용 형식 검사 (날짜, 핸디 숫자, 역할, 중복 id, 사진 파일 존재 여부 등)

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");

const root = path.resolve(__dirname, "..");
const moduleSources = ["main.js", "data.js"];
const roles = new Set(["회장", "총무", "정회원", "신입회원"]);
const archiveDatePattern = /^\d{4}\.\d{2}\.\d{2}$/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const isValidDate = (year, month, day) => {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};

// package.json이 commonjs라 .js를 ES Module로 읽게 하려고 임시 .mjs 복사본을 씁니다.
const makeModuleCopies = () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "kolongolf-check-"));
  for (const file of moduleSources) {
    fs.copyFileSync(path.join(root, file), path.join(directory, file.replace(/\.js$/, ".mjs")));
  }
  return directory;
};

const checkSyntax = (directory, errors) => {
  for (const file of moduleSources) {
    const result = spawnSync(process.execPath, ["--check", path.join(directory, file.replace(/\.js$/, ".mjs"))], { encoding: "utf8" });
    if (result.status !== 0) errors.push(`${file} 문법 오류\n${(result.stderr || "").trim()}`);
  }
};

const checkImage = (reference, where, errors) => {
  if (typeof reference !== "string" || !reference.startsWith("images/")) {
    errors.push(`${where}: 사진 경로는 images/ 로 시작해야 합니다 (${reference})`);
    return;
  }
  if (!fs.existsSync(path.join(root, reference))) errors.push(`${where}: 사진 파일이 없습니다 (${reference})`);
  if (/-display\.(jpe?g|png)$/i.test(reference)) {
    for (const suffix of ["card", "thumb"]) {
      const derived = reference.replace(/-display\.(jpe?g|png)$/i, `-${suffix}.$1`);
      if (!fs.existsSync(path.join(root, derived))) {
        errors.push(`${where}: ${suffix} 파생본이 없습니다 (${derived}) → npm run images`);
      }
    }
  }
};

const checkData = ({ members, archives, heroSlides, upcomingEvents }, errors) => {
  const handles = new Set();
  members.forEach((member, index) => {
    const where = `members[${index}] ${member.name || ""}`;
    if (!member.handle || !member.name) errors.push(`${where}: handle과 name이 필요합니다`);
    if (handles.has(member.handle)) errors.push(`${where}: 닉네임이 중복됩니다 (${member.handle})`);
    handles.add(member.handle);
    if (!roles.has(member.role)) errors.push(`${where}: 역할은 ${[...roles].join("/")} 중 하나여야 합니다 (${member.role})`);
    if (member.handicap !== undefined && !(Number.isInteger(member.handicap) && member.handicap >= -10 && member.handicap <= 60)) {
      errors.push(`${where}: 핸디는 -10~60 사이 정수이거나 비워 두어야 합니다 (${member.handicap})`);
    }
  });

  const ids = new Set();
  archives.forEach((archive, index) => {
    const where = `archives[${index}] ${archive.title || ""}`;
    for (const field of ["id", "date", "label", "title", "location", "people", "summary"]) {
      if (!archive[field]) errors.push(`${where}: ${field} 값이 필요합니다`);
    }
    if (ids.has(archive.id)) errors.push(`${where}: id가 중복됩니다 (${archive.id})`);
    ids.add(archive.id);
    const match = archiveDatePattern.exec(archive.date || "");
    if (!match) errors.push(`${where}: 날짜는 YYYY.MM.DD 형식이어야 합니다 (${archive.date})`);
    else {
      const [year, month, day] = archive.date.split(".").map(Number);
      if (!isValidDate(year, month, day)) errors.push(`${where}: 존재하지 않는 날짜입니다 (${archive.date})`);
    }
    if (index > 0 && archive.date > archives[index - 1].date) {
      errors.push(`${where}: 기록은 최신순이어야 합니다 (${archive.date}가 ${archives[index - 1].date}보다 늦음)`);
    }
    if (!Array.isArray(archive.images) || !archive.images.length) errors.push(`${where}: 사진이 1장 이상 필요합니다`);
    else archive.images.forEach((image, imageIndex) => checkImage(image, `${where} 사진 ${imageIndex + 1}`, errors));
  });

  heroSlides.forEach((slide, index) => checkImage(slide.image, `heroSlides[${index}]`, errors));

  upcomingEvents.forEach((event, index) => {
    const where = `upcomingEvents[${index}] ${event.title || ""}`;
    for (const field of ["id", "date", "title", "body", "state"]) {
      if (!event[field]) errors.push(`${where}: ${field} 값이 필요합니다`);
    }
    if (!isoDatePattern.test(event.date || "")) {
      errors.push(`${where}: 날짜는 YYYY-MM-DD 형식이어야 합니다 (${event.date})`);
      return;
    }
    const [year, month, day] = event.date.split("-").map(Number);
    if (!isValidDate(year, month, day)) errors.push(`${where}: 존재하지 않는 날짜입니다 (${event.date})`);
    const lockup = event.dateLockup || {};
    if (lockup.year !== String(year) || lockup.month !== monthNames[month - 1] || lockup.day !== String(day).padStart(2, "0")) {
      errors.push(`${where}: dateLockup이 날짜와 다릅니다 (기대값 ${monthNames[month - 1]} ${String(day).padStart(2, "0")} ${year})`);
    }
    if (!Array.isArray(event.details)) errors.push(`${where}: details는 [["일시", "..."], ...] 형식이어야 합니다`);
  });
};

const runChecks = async () => {
  const errors = [];
  const directory = makeModuleCopies();
  try {
    checkSyntax(directory, errors);
    if (!errors.length) {
      const data = await import(pathToFileURL(path.join(directory, "data.mjs")).href);
      checkData(data, errors);
    }
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
  return errors;
};

module.exports = { runChecks };

if (require.main === module) {
  runChecks().then((errors) => {
    if (errors.length) {
      console.error(`[check] 실패 ${errors.length}건\n- ${errors.join("\n- ")}`);
      process.exitCode = 1;
    } else {
      console.log("[check] 문법·데이터 점검 통과");
    }
  });
}
