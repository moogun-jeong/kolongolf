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
// 임시 폴더는 빌드 환경마다 다를 수 있어 저장소 안(.check-tmp, gitignore)에 먼저 만들고, 실패하면 OS 임시 폴더를 씁니다.
const makeTempDirectory = () => {
  try {
    const base = path.join(root, ".check-tmp");
    fs.mkdirSync(base, { recursive: true });
    return fs.mkdtempSync(path.join(base, "run-"));
  } catch {
    return fs.mkdtempSync(path.join(os.tmpdir(), "kolongolf-check-"));
  }
};

const makeModuleCopies = () => {
  const directory = makeTempDirectory();
  for (const file of moduleSources) {
    fs.copyFileSync(path.join(root, file), path.join(directory, file.replace(/\.js$/, ".mjs")));
  }
  return directory;
};

const checkSyntax = (directory, errors) => {
  for (const file of moduleSources) {
    const result = spawnSync(process.execPath, ["--check", path.join(directory, file.replace(/\.js$/, ".mjs"))], { encoding: "utf8" });
    // 자식 프로세스를 띄우지 못한 경우(result.error)는 환경 문제이므로 데이터 오류와 구분합니다.
    if (result.error) throw new Error(`문법 검사 프로세스를 실행하지 못했습니다: ${result.error.message}`);
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

const checkData = ({ members, archives, heroSlides, photoFocus = {}, upcomingEvents, rounds = [], handicapRule }, errors) => {
  const handles = new Set();
  members.forEach((member, index) => {
    const where = `members[${index}] ${member.name || ""}`;
    if (!member.handle || !member.name) errors.push(`${where}: handle과 name이 필요합니다`);
    if (handles.has(member.handle)) errors.push(`${where}: 닉네임이 중복됩니다 (${member.handle})`);
    handles.add(member.handle);
    if (!roles.has(member.role)) errors.push(`${where}: 역할은 ${[...roles].join("/")} 중 하나여야 합니다 (${member.role})`);
    if (member.handicap !== undefined) {
      errors.push(`${where}: 핸디는 이제 rounds 스코어에서 자동 계산됩니다. members의 handicap 값을 지우고 스코어를 rounds에 넣어주세요`);
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

  // 스코어 기록: 이름 오타·숫자 형식·날짜·종류를 확인합니다(이름 오타는 핸디가 엉뚱한 사람에게 가지 않도록 막습니다).
  if (!handicapRule || !(Number.isInteger(handicapRule.recentRounds) && handicapRule.recentRounds >= 1)) {
    errors.push("handicapRule.recentRounds는 1 이상의 정수여야 합니다");
  }
  const memberNameSet = new Set(members.map((member) => member.name));
  const roundIds = new Set();
  let previousDate = "";
  rounds.forEach((round, index) => {
    const where = `rounds[${index}] ${round.id || ""}`;
    if (!round.id || !/^[a-z0-9-]+$/.test(round.id)) errors.push(`${where}: id는 영문 소문자·숫자·하이픈으로 적어주세요 (${round.id})`);
    if (roundIds.has(round.id)) errors.push(`${where}: id가 중복됩니다`);
    roundIds.add(round.id);
    if (!["필드", "스크린"].includes(round.type)) errors.push(`${where}: type은 "필드" 또는 "스크린"이어야 합니다 (${round.type})`);
    if (round.date) {
      if (!isoDatePattern.test(round.date)) errors.push(`${where}: date는 YYYY-MM-DD 형식이거나 ""(비움)이어야 합니다 (${round.date})`);
      else {
        const [year, month, day] = round.date.split("-").map(Number);
        if (!isValidDate(year, month, day)) errors.push(`${where}: 존재하지 않는 날짜입니다 (${round.date})`);
        if (previousDate && round.date > previousDate) {
          errors.push(`${where}: rounds는 최신이 맨 위여야 합니다 (${round.date}가 위쪽 ${previousDate}보다 늦음)`);
        }
        previousDate = round.date;
      }
    }
    if (round.archiveId && !archives.some((archive) => archive.id === round.archiveId)) {
      errors.push(`${where}: archiveId가 지난 기록에 없습니다 (${round.archiveId})`);
    }
    const scores = round.scores || {};
    const guests = round.guests || {};
    if (!Object.keys(scores).length) errors.push(`${where}: scores에 회원 스코어가 1개 이상 필요합니다`);
    const validScore = (value) => Number.isInteger(value) && value >= -20 && value <= 90;
    Object.entries(scores).forEach(([name, score]) => {
      if (!memberNameSet.has(name)) errors.push(`${where}: "${name}"은 회원명부에 없는 이름입니다 — 오타이거나 초대손님이면 guests에 넣어주세요`);
      if (!validScore(score)) errors.push(`${where} ${name}: 스코어는 -20~90 사이 정수여야 합니다 (${JSON.stringify(score)})`);
    });
    Object.entries(guests).forEach(([name, score]) => {
      if (memberNameSet.has(name)) errors.push(`${where}: "${name}"은 회원입니다 — guests가 아니라 scores에 넣어주세요`);
      if (Object.prototype.hasOwnProperty.call(scores, name)) errors.push(`${where}: "${name}"이 scores와 guests에 모두 있습니다`);
      if (!validScore(score)) errors.push(`${where} 초대손님 ${name}: 스코어는 -20~90 사이 정수여야 합니다 (${JSON.stringify(score)})`);
    });
  });

  heroSlides.forEach((slide, index) => {
    const where = `heroSlides[${index}]`;
    checkImage(slide.image, where, errors);
    const archive = archives.find((item) => item.id === slide.archiveId);
    if (!archive) errors.push(`${where}: archiveId가 지난 기록에 없습니다 (${slide.archiveId})`);
    else if (!archive.images.includes(slide.image)) {
      errors.push(`${where}: 사진이 연결된 기록(${slide.archiveId})의 images에 없습니다 — 크게 보기에서 열 수 없습니다`);
    }
  });

  Object.entries(photoFocus).forEach(([image, focus]) => {
    const where = `photoFocus ${image}`;
    checkImage(image, where, errors);
    for (const axis of ["x", "y"]) {
      if (focus[axis] !== undefined && !(Number.isFinite(focus[axis]) && focus[axis] >= 0 && focus[axis] <= 100)) {
        errors.push(`${where}: ${axis}는 0~100 사이 숫자여야 합니다 (${focus[axis]})`);
      }
    }
    if (focus.zoom !== undefined && !(Number.isFinite(focus.zoom) && focus.zoom >= 1 && focus.zoom <= 3)) {
      errors.push(`${where}: zoom은 1~3 사이 숫자여야 합니다 (${focus.zoom})`);
    }
  });

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
    if (event.startTime !== undefined && !/^([01]\d|2[0-3]):[0-5]\d$/.test(event.startTime)) {
      errors.push(`${where}: startTime은 HH:MM 형식이어야 합니다 (${event.startTime})`);
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
    fs.rmSync(path.join(root, ".check-tmp"), { recursive: true, force: true });
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
