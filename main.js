import { members, rounds, handicapRule, archives, heroSlides, photoFocus, upcomingEvents } from "./data.js";

// ── 스코어 → 핸디·시즌 기록 계산 ───────────────────────────────────────────
// rounds는 최신이 맨 위입니다. 필드와 스크린은 절대 합산하지 않고 종류별로 따로 계산합니다.
const roundTypes = ["필드", "스크린"];
const memberNames = new Set(members.map((member) => member.name));
const oneDecimal = (value) => Math.round(value * 10) / 10;
const formatScore = (value) => `${value > 0 ? "+" : ""}${value}`;
const formatHandicap = (value) => (Number.isInteger(value) ? String(value) : value.toFixed(1));
const roundLabel = (round) => [round.date ? round.date.replaceAll("-", ".") : "날짜 미기재", round.course || `${round.type} 라운드`].join(" · ");

const buildPlayerStats = (type) => {
  const stats = new Map();
  rounds
    .filter((round) => round.type === type)
    .forEach((round) => {
      Object.entries(round.scores || {}).forEach(([name, score]) => {
        if (!memberNames.has(name)) return;
        if (!stats.has(name)) stats.set(name, { name, history: [] });
        stats.get(name).history.push({ score, round });
      });
    });
  stats.forEach((player) => {
    const recent = player.history.slice(0, handicapRule.recentRounds).map((entry) => entry.score);
    player.handicap = oneDecimal(recent.reduce((sum, score) => sum + score, 0) / recent.length);
    player.recentCount = recent.length;
    player.best = Math.min(...player.history.map((entry) => entry.score));
    player.rounds = player.history.length;
  });
  return stats;
};
const playerStats = Object.fromEntries(roundTypes.map((type) => [type, buildPlayerStats(type)]));

// 핸디가 낮을수록 위, 같으면 라운드가 많은 순, 그다음 베스트가 좋은 순입니다.
const leaderboardFor = (type) => [...playerStats[type].values()]
  .sort((left, right) => left.handicap - right.handicap || right.rounds - left.rounds || left.best - right.best);

// 라운드 안 순위(같은 스코어는 같은 순위). 초대손님도 그 라운드 기록에는 함께 표시합니다.
const roundStandings = (round) => {
  const entries = [
    ...Object.entries(round.scores || {}).map(([name, score]) => ({ name, score, guest: false })),
    ...Object.entries(round.guests || {}).map(([name, score]) => ({ name, score, guest: true }))
  ].sort((left, right) => left.score - right.score);
  return entries.map((entry) => ({ ...entry, rank: entries.findIndex((other) => other.score === entry.score) + 1 }));
};
const roundForArchive = (archiveId) => rounds.find((round) => round.archiveId === archiveId);

const rolePriority = {
  회장: 1,
  총무: 2,
  정회원: 3,
  신입회원: 4,
};

const staffRoles = new Set(["회장", "총무"]);

const getRoleMember = (role) => members.find((member) => member.role === role);

const contactLine = (role) => {
  const member = getRoleMember(role);
  if (!member) return "";
  return `${role}: ${member.name}${member.email ? ` · ${member.email}` : ""}`;
};

const contactAddressHtml = () => ["회장", "총무"]
  .map(contactLine)
  .filter(Boolean)
  .join("<br />");

const emojiAssetBase = "https://cdn.jsdelivr.net/npm/@twemoji/svg@15.0.0";

const memberAnimals = [
  { id: "deer", label: "사슴", code: "1f98c", hue: 82 },
  { id: "fox", label: "여우", code: "1f98a", hue: 42 },
  { id: "bear", label: "곰", code: "1f43b", hue: 72 },
  { id: "otter", label: "수달", code: "1f9a6", hue: 180 },
  { id: "owl", label: "부엉이", code: "1f989", hue: 108 },
  { id: "tiger", label: "호랑이", code: "1f42f", hue: 58 },
  { id: "horse", label: "말", code: "1f434", hue: 96 },
  { id: "eagle", label: "독수리", code: "1f985", hue: 34 },
  { id: "dolphin", label: "돌고래", code: "1f42c", hue: 214 },
  { id: "leopard", label: "표범", code: "1f406", hue: 318 },
  { id: "swan", label: "백조", code: "1f9a2", hue: 24 },
  { id: "panda", label: "판다", code: "1f43c", hue: 150 },
  { id: "monkey", label: "원숭이", code: "1f435", hue: 88 },
  { id: "elephant", label: "코끼리", code: "1f418", hue: 64 },
  { id: "lion", label: "사자", code: "1f981", hue: 196 },
  { id: "hedgehog", label: "고슴도치", code: "1f994", hue: 46 },
  { id: "penguin", label: "펭귄", code: "1f427", hue: 226 },
  { id: "flamingo", label: "플라밍고", code: "1f9a9", hue: 126 },
  { id: "wolf", label: "늑대", code: "1f43a", hue: 252 },
  { id: "shark", label: "상어", code: "1f988", hue: 205 },
  { id: "rhino", label: "코뿔소", code: "1f98f", hue: 286 }
];

const getMemberAnimal = (index) => {
  const animal = memberAnimals[index % memberAnimals.length];
  return {
    ...animal,
    asset: `${emojiAssetBase}/${animal.code}.svg`
  };
};

const renderMemberAnimal = (animal, name) => `
  <span class="member-animal" role="img" aria-label="${name} 회원 ${animal.label} 이모티콘" data-animal="${animal.id}" style="--animal-hue: ${animal.hue};">
    <img class="member-animal-emoji" src="${animal.asset}" alt="" width="44" height="44" loading="lazy" decoding="async" aria-hidden="true" />
  </span>
`;

const principleIcons = {
  round: `
    <svg class="principle-svg-icon" viewBox="0 0 56 56" aria-hidden="true" focusable="false">
      <path d="M11 42c10-17 23-25 38-22" />
      <circle cx="39" cy="22" r="8" />
      <path d="M39 22V8M39 8h11l-3 5 3 5H39" />
      <path d="M12 43h32" />
    </svg>
  `,
  score: `
    <svg class="principle-svg-icon" viewBox="0 0 56 56" aria-hidden="true" focusable="false">
      <path d="M16 9h24v38H16z" />
      <path d="M22 19h12M22 27h12M22 35h8" />
      <circle cx="39" cy="19" r="3" />
      <circle cx="39" cy="27" r="3" />
    </svg>
  `,
  memory: `
    <svg class="principle-svg-icon" viewBox="0 0 56 56" aria-hidden="true" focusable="false">
      <path d="M12 18h32v24H12z" />
      <path d="M19 18l4-6h10l4 6" />
      <circle cx="28" cy="30" r="8" />
      <path d="M42 14h5v8" />
    </svg>
  `
};

// 라이트박스 썸네일은 68x48로만 보이므로 -display 대신 짝이 되는 -thumb 파생본을 씁니다.
const thumbSource = (source) => source.replace(/-display\.(jpe?g|png)$/i, "-thumb.$1");

// 카드처럼 작은 칸에는 긴 변 1800px 원본 대신 가로 900px `-card` 파생본을 먼저 고르게 합니다.
// 라이트박스(크게 보기)는 계속 -display 원본을 씁니다.
const cardSource = (source) => source.replace(/-display\.(jpe?g|png)$/i, "-card.$1");
// sizes는 [미디어 조건, 칸 너비] 목록입니다. 확대(zoom)한 사진은 그만큼 더 큰 파일이 필요하므로 너비에 배율을 곱합니다.
const imageSizes = {
  hero: [["(max-width: 960px)", "(100vw - 32px)"], ["", "620px"]],
  featured: [["(max-width: 960px)", "(100vw - 32px)"], ["", "680px"]],
  card: [["(max-width: 760px)", "(100vw - 32px)"], ["(max-width: 1080px)", "46vw"], ["", "380px"]],
  lastRound: [["(max-width: 760px)", "(100vw - 32px)"], ["(max-width: 960px)", "54vw"], ["", "520px"]],
  full: [["", "100vw"]]
};
const sizesAttribute = (rules, zoom = 1) => rules
  .map(([media, width]) => `${media ? `${media} ` : ""}${zoom === 1 ? width.replace(/^\((.*)\)$/, "calc($1)") : `calc(${width} * ${zoom})`}`)
  .join(", ");

// data.js의 photoFocus로 인물이 모인 곳을 기준으로 채우고, 필요하면 그 지점을 중심으로 확대합니다.
const focusFor = (source) => photoFocus[source] || null;
const focusStyle = (source) => {
  const focus = focusFor(source);
  if (!focus) return "";
  const zoom = Number(focus.zoom) > 1 ? Number(focus.zoom) : 1;
  return ` style="--focus: ${focus.x ?? 50}% ${focus.y ?? 50}%; --zoom: ${zoom};"`;
};
const responsiveImageAttrs = (source, sizeKey) => {
  const zoom = Number(focusFor(source)?.zoom) > 1 ? Number(focusFor(source).zoom) : 1;
  return `src="${cardSource(source)}" srcset="${cardSource(source)} 900w, ${source} 1800w" sizes="${sizesAttribute(imageSizes[sizeKey], zoom)}"${focusStyle(source)}`;
};

const archiveIndexById = (id) => archives.findIndex((archive) => archive.id === id);

// 대표 사진 슬라이드에 연결된 기록에서 날짜·설명·갤러리 위치를 찾습니다.
const heroSlideInfo = (slide) => {
  const archiveIndex = archiveIndexById(slide.archiveId);
  const archive = archives[archiveIndex];
  return {
    ...slide,
    archiveIndex,
    imageIndex: Math.max(0, archive ? archive.images.indexOf(slide.image) : 0),
    date: slide.date || archive?.date || "",
    caption: slide.caption || archive?.title || ""
  };
};
// 방문할 때마다 대표 사진 순서를 무작위로 섞습니다(Fisher–Yates). 이후에는 섞인 순서대로 돌아갑니다.
const shuffled = (items) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const pick = Math.floor(Math.random() * (index + 1));
    [result[index], result[pick]] = [result[pick], result[index]];
  }
  return result;
};
const heroSlideData = shuffled(heroSlides).map(heroSlideInfo);

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// 오늘 이후의 확정 일정 중 가장 빠른 하나만 "다음 모임"으로 안내합니다.
const getNextEvent = () => {
  const today = startOfToday();
  return (
    upcomingEvents
      .filter((event) => {
        const eventDate = new Date(`${event.date}T00:00:00`);
        return !Number.isNaN(eventDate.valueOf()) && eventDate >= today;
      })
      .sort((left, right) => left.date.localeCompare(right.date))[0] || null
  );
};

// 오늘 기준 남은 날짜("D-20", 당일은 "D-DAY")
const ddayLabel = (event) => {
  const eventDate = new Date(`${event.date}T00:00:00`);
  const days = Math.round((eventDate - startOfToday()) / 86400000);
  if (Number.isNaN(days) || days < 0) return "";
  return days === 0 ? "D-DAY" : `D-${days}`;
};

// 캘린더 등록용 날짜 문자열입니다. 시간이 없으면 하루 종일 일정으로 넣습니다.
const calendarDates = (event) => {
  const compact = event.date.replaceAll("-", "");
  if (!event.startTime) {
    const next = new Date(`${event.date}T00:00:00`);
    next.setDate(next.getDate() + 1);
    const end = `${next.getFullYear()}${String(next.getMonth() + 1).padStart(2, "0")}${String(next.getDate()).padStart(2, "0")}`;
    return { allDay: true, start: compact, end };
  }
  const [hour, minute] = event.startTime.split(":").map(Number);
  const startMinutes = hour * 60 + minute;
  const endMinutes = Math.min(startMinutes + Math.round((Number(event.durationHours) || 5) * 60), 23 * 60 + 59);
  const time = (total) => `${String(Math.floor(total / 60)).padStart(2, "0")}${String(total % 60).padStart(2, "0")}00`;
  return { allDay: false, start: `${compact}T${time(startMinutes)}`, end: `${compact}T${time(endMinutes)}` };
};

const siteUrl = () => document.querySelector('link[rel="canonical"]')?.href || window.location.href.split("#")[0];
const eventLocation = (event) => event.location || event.details?.find(([term]) => term === "장소")?.[1] || "";

const googleCalendarUrl = (event) => {
  const { start, end } = calendarDates(event);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `[코오롱 골프] ${event.title}`,
    dates: `${start}/${end}`,
    details: `${event.body}\n\n${siteUrl()}`,
    location: eventLocation(event),
    ctz: "Asia/Seoul"
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// iPhone·갤럭시 기본 캘린더와 Outlook이 읽는 .ics 파일을 브라우저에서 바로 만듭니다.
// RFC 5545: 한 줄은 75바이트를 넘지 않게 접고, 이어지는 줄은 공백으로 시작합니다(한글은 글자 단위로 끊어 깨지지 않게).
const foldIcsLine = (line) => {
  const encoder = new TextEncoder();
  const parts = [];
  let current = "", bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > (parts.length ? 74 : 75)) {
      parts.push(current);
      current = "";
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  parts.push(current);
  return parts.join("\r\n ");
};

const icsText = (event) => {
  const { allDay, start, end } = calendarDates(event);
  const escape = (value) => String(value).replace(/[\\;,]/g, (char) => `\\${char}`).replace(/\n/g, "\\n");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const when = allDay
    ? [`DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${end}`]
    : [`DTSTART;TZID=Asia/Seoul:${start}`, `DTEND;TZID=Asia/Seoul:${end}`];
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Kolon Golf Society//KO", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@kolongolf`,
    `DTSTAMP:${stamp}`,
    ...when,
    `SUMMARY:${escape(`[코오롱 골프] ${event.title}`)}`,
    `LOCATION:${escape(eventLocation(event))}`,
    `DESCRIPTION:${escape(`${event.body}\n${siteUrl()}`)}`,
    "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", `DESCRIPTION:${escape(`내일 ${event.title}`)}`, "END:VALARM",
    "END:VEVENT", "END:VCALENDAR"
  ].map(foldIcsLine).join("\r\n");
};

const downloadIcs = (event) => {
  const url = URL.createObjectURL(new Blob([icsText(event)], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.id}.ics`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const calendarButtons = (event, variant = "") => `
  <div class="calendar-actions${variant ? ` ${variant}` : ""}" role="group" aria-label="${event.title} 캘린더에 추가">
    <button class="solid-button accent" type="button" data-add-calendar="${event.id}"><span class="calendar-icon" aria-hidden="true"></span>내 캘린더에 추가</button>
    <a class="line-button on-dark" href="${googleCalendarUrl(event)}" target="_blank" rel="noopener">Google 캘린더</a>
  </div>`;

const messageCopy = {
  unavailable: "방명록 저장소를 연결하는 중입니다. Cloudflare Pages 배포에서 곧 글을 남길 수 있습니다.",
  emptyGuestbook: "아직 남겨진 글이 없습니다. 첫 인사를 남겨주세요.",
  emptyArchive: "이 라운드에는 아직 댓글이 없습니다.",
  loading: "글을 불러오는 중입니다.",
  saved: "글을 남겼습니다.",
  saving: "등록 중입니다.",
  writeUnavailable: "지금은 글을 남길 수 없습니다. 이 화면에서는 방명록 저장소에 연결되지 않았습니다.",
  securityNotConfigured: "보안 확인(Turnstile) 설정이 끝나면 글을 남길 수 있습니다. 운영진에게 문의해주세요."
};

const getTurnstileSiteKey = () =>
  document.querySelector('meta[name="cf-turnstile-sitekey"]')?.getAttribute("content")?.trim() || "";

const localHostSuffixes = [".replit.dev", ".repl.co", ".app.github.dev", ".janeway.replit.dev"];

// 로컬·Replit 미리보기에서는 Turnstile 없이 쓰기가 가능하지만(서버의 로컬 전용 스위치),
// 공개 배포 화면에서는 sitekey가 없으면 서버가 저장을 거부합니다.
const isProductionHost = () => {
  const { hostname } = window.location;
  if (["localhost", "127.0.0.1", "[::1]", ""].includes(hostname)) return false;
  return !localHostSuffixes.some((suffix) => hostname.endsWith(suffix));
};

// GitHub Pages처럼 Functions가 없는 정적 호스트에서만 운영 API 주소를 씁니다.
// 그 외(로컬, Replit, Cloudflare Pages)는 항상 같은 출처의 `/api`를 호출해서
// 로컬 테스트가 운영 데이터를 건드리지 않도록 합니다.
const staticOnlyHostSuffixes = [".github.io"];

const isStaticOnlyHost = () =>
  staticOnlyHostSuffixes.some((suffix) => window.location.hostname.endsWith(suffix));

const getMessageApiBase = () => {
  if (!isStaticOnlyHost()) return "/api";
  return (
    document.querySelector('meta[name="message-api-base"]')?.getAttribute("content")?.trim() ||
    "https://kolongolf.pages.dev/api"
  );
};

const messageFormTemplate = (type, placeholder, buttonText) => `
  <form class="message-form" data-message-form data-message-type="${type}">
    <label>
      <span>이름 또는 닉네임</span>
      <input name="authorName" type="text" maxlength="20" autocomplete="name" required />
    </label>
    <label>
      <span>남기고 싶은 말</span>
      <textarea name="body" maxlength="500" rows="4" placeholder="${placeholder}" required></textarea>
    </label>
    <label class="message-honeypot" aria-hidden="true">
      <span>Website</span>
      <input name="website" type="text" tabindex="-1" autocomplete="off" />
    </label>
    <div class="turnstile-slot" data-turnstile-slot></div>
    <div class="message-form-actions">
      <button class="solid-button" type="submit">${buttonText}</button>
      <p class="message-status" data-message-status role="status"></p>
    </div>
  </form>
`;

const defineElement = (name, elementClass) => {
  if (!customElements.get(name)) customElements.define(name, elementClass);
};

class KolonSiteHeader extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <header class="site-header" data-site-header>
        <div class="mobile-bar">
          <button class="icon-button menu-toggle" type="button" aria-controls="mobileNav" aria-expanded="false" aria-label="메뉴 열기">
            <span></span>
          </button>
          <a class="brand compact" href="#top" aria-label="홈으로 이동">
            <span class="brand-mark" aria-hidden="true"></span>
            <strong>Kolon Golf</strong>
          </a>
          <a class="icon-button search-link" href="#members" aria-label="회원 검색"></a>
        </div>

        <div class="desktop-bar">
          <a class="brand" href="#top" aria-label="홈으로 이동">
            <span class="brand-mark" aria-hidden="true"></span>
            <strong>Kolon Golf</strong>
            <span class="brand-subtitle">Screen &amp; Field Society</span>
          </a>
          <nav class="main-nav" aria-label="메인 메뉴">
            <a href="#features">동호회</a>
            <a href="#schedule">일정</a>
            <a href="#leaderboard">순위</a>
            <a href="#archive">기록</a>
            <a href="#members">회원</a>
            <a href="#guestbook">방명록</a>
          </nav>
          <div class="account-links">
            <button type="button" data-open-modal="joinModal">가입 문의</button>
          </div>
        </div>

        <nav class="mobile-panel" id="mobileNav" aria-label="모바일 메뉴">
          <a href="#features">동호회</a>
          <a href="#schedule">일정</a>
          <a href="#leaderboard">순위</a>
          <a href="#archive">기록</a>
          <a href="#members">회원</a>
          <a href="#guestbook">방명록</a>
          <button type="button" data-open-modal="joinModal">가입 문의</button>
        </nav>
      </header>
    `;
  }
}

class KolonHero extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    const total = String(heroSlides.length).padStart(2, "0");
    const lastRound = archives[0];
    const first = heroSlideData[0];
    // 첫 장만 바로 불러오고, 나머지는 차례가 오기 직전에 data-* 값을 src로 옮겨 불러옵니다.
    const slides = heroSlideData.map((slide, index) => {
      const attrs = responsiveImageAttrs(slide.image, "hero");
      return `<img class="hero-slide${index === 0 ? " is-active" : ""}" ${index === 0 ? attrs : attrs.replace(/\b(src|srcset|sizes)="/g, "data-$1=\"")} alt="${index === 0 ? slide.caption : ""}" width="1000" height="750" decoding="async"${index === 0 ? ' fetchpriority="high"' : ""} />`;
    }).join("");
    this.innerHTML = `
      <section class="hero" aria-labelledby="heroTitle">
        <div class="hero-glow" aria-hidden="true"></div>
        <div class="hero-inner">
          <div class="hero-copy" data-reveal>
            <p class="eyebrow on-dark"><span class="eyebrow-dot" aria-hidden="true"></span>Kolon Screen Golf Society</p>
            <h1 id="heroTitle">함께 치는 골프,<br />오래 남는 <em>순간.</em></h1>
            <p class="hero-description">스크린에서 필드까지. 좋은 샷도, 아쉬운 퍼트도<br class="desktop-only" /> 함께라서 더 즐거운 코오롱 골프 동호회입니다.</p>
            <div class="button-row">
              <a class="solid-button accent" href="#archive">우리의 라운드 보기 <span aria-hidden="true">→</span></a>
              <button class="line-button on-dark" type="button" data-open-modal="joinModal">가입 문의</button>
            </div>
            <dl class="hero-scoreboard" aria-label="동호회 기록 요약">
              <div><dt>Members</dt><dd>${members.length}<small>명</small></dd></div>
              <div><dt>Rounds</dt><dd>${archives.length}<small>회</small></dd></div>
              <div><dt>Last Round</dt><dd>${lastRound.date.slice(5)}<small>${lastRound.date.slice(0, 4)}</small></dd></div>
            </dl>
          </div>
          <figure class="hero-media" data-reveal>
            <button class="hero-frame" id="heroFrame" type="button" data-archive-index="${first.archiveIndex}" data-image-index="${first.imageIndex}" aria-label="${first.caption} 사진 크게 보기">
              ${slides}
              <span class="hero-badge" aria-hidden="true">On &amp; Off the Fairway</span>
              <span class="hero-zoom-hint" aria-hidden="true">크게 보기</span>
            </button>
            <figcaption>
              <div class="hero-caption-copy"><span id="heroDate">${first.date}</span><strong id="heroCaption">${first.caption}</strong></div>
              <div class="hero-photo-controls" role="group" aria-label="대표 사진 선택">
                <span class="hero-slide-count" id="heroSlideCount" aria-live="polite">01 / ${total}</span>
                <button class="round-button" type="button" data-hero-slide="prev" aria-label="이전 대표 사진">←</button>
                <button class="round-button" type="button" data-hero-slide="next" aria-label="다음 대표 사진">→</button>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>`;
  }
}
class KolonIntro extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    const points = [
      ["round", "정기적으로 만나는 라운드", "바쁜 일상 사이에도 다음 약속을 만들며 스크린과 필드에서 꾸준히 만납니다."],
      ["score", "부담 없이 합류하는 경기", "스코어는 겨루되 분위기는 편하게. 실력보다 함께하는 마음이 먼저입니다."],
      ["memory", "사진과 기록으로 남는 모임", "멋진 샷과 즐거웠던 자리를 사진과 이야기로 남겨 다음 만남을 기다립니다."]
    ];
    this.innerHTML = `
      <section class="intro-section site-section" aria-labelledby="introTitle">
        <div class="intro-head" data-reveal>
          <p class="eyebrow">Our Society</p>
          <h2 id="introTitle">스코어보다 오래 남는 건,<br />함께한 사람들.</h2>
          <p>코오롱 골프 동호회는 스크린 라운드와 필드에서 만나 골프를 즐깁니다. 실력은 달라도 서로 응원하는 마음은 같습니다.</p>
        </div>
        <ul class="intro-points">
          ${points.map(([icon, title, body], index) => `
            <li class="intro-point" data-reveal>
              <span class="intro-point-icon" aria-hidden="true">${principleIcons[icon]}</span>
              <span class="intro-point-index" aria-hidden="true">0${index + 1}</span>
              <h3>${title}</h3>
              <p>${body}</p>
            </li>`).join("")}
        </ul>
      </section>`;
  }
}
class KolonSchedule extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    const next = getNextEvent();
    const last = archives[0];
    this.innerHTML = `
      <section class="schedule-section site-section" aria-labelledby="scheduleTitle">
        <div class="section-heading" data-reveal>
          <div><p class="eyebrow">Next Round</p><h2 id="scheduleTitle">다음에 만나요.</h2></div>
          <p>확정된 일정은 이곳에서 가장 먼저 알려드려요.</p>
        </div>
        <div class="schedule-board" data-reveal>
          <article class="next-event${next ? "" : " is-pending"}">
            <div class="event-date-lockup" aria-hidden="true"><span>${next ? next.dateLockup.month : "Next"}</span><strong>${next ? next.dateLockup.day : "TBD"}</strong><small>${next ? next.dateLockup.year : "Round"}</small></div>
            <div class="event-content">
              <p class="event-state"><span class="status-dot" aria-hidden="true"></span>${next ? next.state : "일정 조율 중"}${next && ddayLabel(next) ? `<span class="dday-chip" aria-label="${ddayLabel(next) === "D-DAY" ? "오늘" : `${ddayLabel(next).slice(2)}일 남음`}">${ddayLabel(next)}</span>` : ""}</p>
              <h3>${next ? next.title : "다음 라운드를 준비하고 있어요."}</h3>
              <p>${next ? next.body : "일시와 장소가 정해지면 바로 알려드릴게요. 함께하고 싶다면 언제든 문의해주세요."}</p>
              ${next
                ? `<dl class="upcoming-details">${next.details.map(([term, description]) => `<div><dt>${term}</dt><dd>${description}</dd></div>`).join("")}</dl>${calendarButtons(next)}`
                : `<button class="solid-button accent" type="button" data-open-modal="joinModal">모임 문의하기 <span aria-hidden="true">→</span></button>`}
            </div>
          </article>
          <article class="last-round">
            <button class="last-round-photo" type="button" data-archive-index="0" aria-label="${last.title} 사진 ${last.images.length}장 보기">
              <img ${responsiveImageAttrs(last.images[0], "lastRound")} alt="" width="800" height="600" loading="lazy" decoding="async" />
            </button>
            <div class="last-round-body">
              <p class="eyebrow">Last Round · ${last.date}</p>
              <h3>${last.title}</h3>
              <p>${last.people} · ${last.location}</p>
              <button class="text-button" type="button" data-archive-index="0">그날의 사진 ${last.images.length}장 보기 <span aria-hidden="true">→</span></button>
            </div>
          </article>
        </div>
      </section>`;
  }
}
class KolonLeaderboard extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    const handleOf = new Map(members.map((member) => [member.name, member.handle]));

    const renderTable = (type) => {
      const board = leaderboardFor(type);
      if (!board.length) {
        return `<p class="leaderboard-empty">아직 ${type} 스코어 기록이 없어요. 라운드가 끝나면 스코어카드를 올려주세요.</p>`;
      }
      const rows = board.map((player, index) => {
        const rank = board.findIndex((other) => other.handicap === player.handicap) + 1;
        const recent = player.history.slice(0, handicapRule.recentRounds)
          .map((entry) => `<span class="score-chip" title="${roundLabel(entry.round)}">${formatScore(entry.score)}</span>`).join("");
        return `
          <li class="leaderboard-row${rank <= 3 ? ` is-top is-rank-${rank}` : ""}"${index >= 10 ? " data-extra-row hidden" : ""}>
            <span class="leaderboard-rank">${rank}</span>
            <span class="leaderboard-player"><strong>${handleOf.get(player.name) || player.name}</strong><small>${player.name}</small></span>
            <span class="leaderboard-hcp"><small>핸디</small><strong>${formatHandicap(player.handicap)}</strong></span>
            <span class="leaderboard-recent"><small>최근 ${player.recentCount}라운드</small><span>${recent}</span></span>
            <span class="leaderboard-best"><small>베스트</small><strong>${formatScore(player.best)}</strong></span>
            <span class="leaderboard-count"><small>라운드</small><strong>${player.rounds}</strong></span>
          </li>`;
      }).join("");
      const more = board.length > 10
        ? `<button class="line-button small leaderboard-more" type="button" data-leaderboard-more aria-expanded="false">전체 ${board.length}명 보기 ＋</button>`
        : "";
      return `<ol class="leaderboard-list">${rows}</ol>${more}`;
    };

    const renderRounds = (type) => {
      const list = rounds.filter((round) => round.type === type);
      if (!list.length) return "";
      return `
        <div class="round-log">
          <h3 class="round-log-title">반영된 ${type} 라운드 ${list.length}회</h3>
          <ul>
            ${list.map((round) => {
              const standings = roundStandings(round);
              const top = standings.slice(0, 3).map((entry) => `${entry.rank}위 ${entry.name}${entry.guest ? "(초대)" : ""} ${formatScore(entry.score)}`).join(" · ");
              const archiveIndex = round.archiveId ? archiveIndexById(round.archiveId) : -1;
              const guestCount = Object.keys(round.guests || {}).length;
              return `<li>
                <div><strong>${roundLabel(round)}</strong><span>${Object.keys(round.scores || {}).length}명${guestCount ? ` + 초대 ${guestCount}명` : ""}${round.memo ? ` · ${round.memo}` : ""}</span></div>
                <p>${top}</p>
                ${archiveIndex >= 0 ? `<button class="text-button" type="button" data-archive-index="${archiveIndex}">사진 보기 <span aria-hidden="true">→</span></button>` : ""}
              </li>`;
            }).join("")}
          </ul>
        </div>`;
    };

    this.innerHTML = `
      <section class="leaderboard-section site-section" aria-labelledby="leaderboardTitle">
        <div class="section-heading" data-reveal>
          <div><p class="eyebrow">Season Leaderboard</p><h2 id="leaderboardTitle">시즌 순위.</h2></div>
          <p>스코어카드 기록으로 핸디를 자동 계산합니다. 핸디는 최근 ${handicapRule.recentRounds}라운드 평균이며, 필드와 스크린은 따로 셉니다.</p>
        </div>
        <div class="leaderboard-card" data-reveal>
          <div class="leaderboard-tabs" role="tablist" aria-label="라운드 종류">
            ${roundTypes.map((type, index) => `<button type="button" role="tab" id="leaderboardTab-${index}" aria-controls="leaderboardPanel-${index}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-leaderboard-tab="${index}">${type}<span>${playerStats[type].size}명</span></button>`).join("")}
          </div>
          ${roundTypes.map((type, index) => `
            <div class="leaderboard-panel" role="tabpanel" id="leaderboardPanel-${index}" aria-labelledby="leaderboardTab-${index}"${index === 0 ? "" : " hidden"}>
              ${renderTable(type)}
              ${renderRounds(type)}
            </div>`).join("")}
          <p class="leaderboard-foot">스코어는 파 대비 타수(+는 오버파)입니다. 초대손님은 라운드 기록에만 표시하고 순위·핸디에는 넣지 않습니다.</p>
        </div>
      </section>`;
  }
}

// 회원 카드: 필드 핸디는 항상 칸을 보여주고(기록 없으면 빈칸), 스크린 핸디는 기록이 있을 때만 덧붙입니다.
const memberHandicapHtml = (member) => {
  const field = playerStats["필드"].get(member.name);
  const screen = playerStats["스크린"].get(member.name);
  const fieldHtml = field
    ? `<p class="member-handicap" title="필드 최근 ${field.recentCount}라운드 평균"><span>핸디</span><strong>${formatHandicap(field.handicap)}</strong></p>`
    : `<p class="member-handicap is-empty"><span>핸디</span><strong aria-label="기록 없음"></strong></p>`;
  const screenHtml = screen
    ? `<p class="member-handicap is-screen" title="스크린 최근 ${screen.recentCount}라운드 평균"><span>스크린</span><strong>${formatHandicap(screen.handicap)}</strong></p>`
    : "";
  return `<div class="member-handicaps">${fieldHtml}${screenHtml}</div>`;
};

class KolonMembers extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    const renderMemberCard = (member, index, variant = "") => {
      const animal = getMemberAnimal(index);
      return `
        <article class="member-card ${variant}" data-member-card>
          ${renderMemberAnimal(animal, member.name)}
          <div class="member-identity">
            <h3>${member.handle}</h3>
            <p>${member.name}${variant ? ` · ${member.note}` : ""}</p>
            ${memberHandicapHtml(member)}
          </div>
          <span class="member-role" data-role="${member.role}">${member.role}</span>
        </article>
      `;
    };

    const indexedMembers = members.map((member, index) => ({ ...member, index }));
    const staffMembers = indexedMembers
      .filter((member) => staffRoles.has(member.role))
      .sort((left, right) => (rolePriority[left.role] || 99) - (rolePriority[right.role] || 99));
    const regularMembers = indexedMembers.filter((member) => !staffRoles.has(member.role));

    const staffItems = staffMembers
      .map((member) => renderMemberCard(member, member.index, "staff-card"))
      .join("");

    const memberItems = regularMembers
      .map((member) => renderMemberCard(member, member.index))
      .join("");

    this.innerHTML = `
      <section class="members-section site-section" aria-labelledby="membersTitle">
        <div class="section-heading" data-reveal>
          <div>
            <p class="eyebrow">Our Members</p>
            <h2 id="membersTitle">함께하는 골퍼 <span class="heading-count">${members.length}</span></h2>
          </div>
          <div class="member-tools" role="search">
            <label class="search-field">
              <span class="visually-hidden">회원 검색</span>
              <input id="memberSearch" type="search" placeholder="이름, 닉네임, 역할로 찾기" autocomplete="off" />
            </label>
            <button class="line-button small" id="memberReset" type="button">초기화</button>
          </div>
        </div>
        <div class="staff-grid" aria-label="운영진" data-reveal>
          ${staffItems}
        </div>
        <div class="member-grid" id="memberGrid" aria-label="회원" data-reveal>
          ${memberItems}
        </div>
        <p class="member-handicap-note">핸디: 필드 최근 ${handicapRule.recentRounds}라운드 평균(스크린은 따로 계산) · 기록이 없는 회원은 칸만 비워 두었습니다. <a href="#leaderboard">시즌 순위 보기</a></p>
        <div class="collection-footer"><p id="memberResult" role="status">함께하는 회원 ${members.length}명</p><button class="line-button" type="button" id="memberMore" aria-expanded="false" aria-controls="memberGrid">회원 모두 보기 ＋</button></div>
      </section>
    `;
  }
}

const roundWinnerChip = (archive) => {
  const round = roundForArchive(archive.id);
  if (!round) return "";
  const winners = roundStandings(round).filter((entry) => entry.rank === 1);
  if (!winners.length) return "";
  return `<p class="archive-winner"><span aria-hidden="true">🏆</span> 이날 1위 ${winners.map((entry) => `${entry.name}${entry.guest ? "(초대)" : ""}`).join(", ")} <strong>${formatScore(winners[0].score)}</strong></p>`;
};

class KolonArchive extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    const renderDetails = (archive) => archive.details?.length ? `<details class="archive-detail-disclosure"><summary>경기 상세 정보</summary><ul class="archive-details">${archive.details.map((detail) => `<li>${detail}</li>`).join("")}</ul></details>` : "";
    const photoCue = (archive) => `<span class="photo-open-label"><span aria-hidden="true">▣</span> ${archive.images.length}</span>`;
    const featured = archives[0];
    const archiveItems = archives.slice(1).map((archive, index) => `
      <article class="archive-card" data-archive-year="${archive.date.slice(0, 4)}" data-reveal>
        <button class="archive-photo" type="button" data-archive-index="${index + 1}" aria-label="${archive.title} 사진 ${archive.images.length}장 보기"><img ${responsiveImageAttrs(archive.images[0], "card")} alt="${archive.title} 대표 사진" width="800" height="600" loading="lazy" decoding="async" /><span class="archive-chip">${archive.label}</span>${photoCue(archive)}</button>
        <div class="archive-body"><p class="archive-meta"><time>${archive.date}</time></p><h3>${archive.title}</h3><p class="archive-summary">${archive.summary}</p>${roundWinnerChip(archive)}${renderDetails(archive)}<div class="archive-foot"><span>${archive.location}</span><span>${archive.people}</span></div></div>
      </article>`).join("");
    const years = [...new Set(archives.map((archive) => archive.date.slice(0, 4)))];
    this.innerHTML = `
      <section class="archive-section" aria-labelledby="archiveTitle">
        <div class="site-section">
          <div class="section-heading" data-reveal><div><p class="eyebrow">Round Stories</p><h2 id="archiveTitle">우리의 라운드.</h2></div><p>함께 웃고, 겨루고, 기억한 순간들. 사진을 누르면 갤러리와 댓글을 볼 수 있어요.</p></div>
          <div class="archive-toolbar" data-reveal><div class="archive-filters" role="group" aria-label="라운드 연도 필터"><button type="button" data-archive-filter="all" aria-pressed="true">전체</button>${years.map((year) => `<button type="button" data-archive-filter="${year}" aria-pressed="false">${year}</button>`).join("")}</div><p id="archiveResult" role="status">총 ${archives.length}개의 라운드</p></div>
          <article class="featured-round" data-archive-year="${featured.date.slice(0, 4)}" data-reveal>
            <button class="featured-photo" type="button" data-archive-index="0" aria-label="${featured.title} 사진 ${featured.images.length}장 보기"><img ${responsiveImageAttrs(featured.images[0], "featured")} alt="${featured.title} 대표 사진" width="1000" height="750" loading="lazy" decoding="async" /><span class="archive-chip accent">Latest</span>${photoCue(featured)}</button>
            <div class="featured-body"><p class="archive-meta"><time>${featured.date}</time> · ${featured.label}</p><h3>${featured.title}</h3><p class="archive-summary">${featured.summary}</p>${roundWinnerChip(featured)}${featured.highlights?.length ? `<ul class="archive-tags" aria-label="주요 기록">${featured.highlights.map((tag) => `<li>${tag}</li>`).join("")}</ul>` : ""}${renderDetails(featured)}<div class="archive-foot"><span>${featured.location}</span><span>${featured.people}</span></div></div>
          </article>
          <div class="archive-grid">${archiveItems}</div>
          <div class="collection-footer"><p>지난 기록은 연도별로 모아볼 수 있어요.</p><button class="line-button" type="button" id="archiveMore" aria-expanded="false">이전 라운드 더 보기 ＋</button></div>
        </div>
      </section>`;
  }
}
class KolonGuestbook extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <section class="guestbook-section site-section" aria-labelledby="guestbookTitle">
        <div class="section-heading" data-reveal>
          <div>
            <p class="eyebrow">Say Hello</p>
            <h2 id="guestbookTitle">반가운 한마디.</h2>
          </div>
          <p>오늘의 인사, 그날의 추억. 편하게 남겨주세요.</p>
        </div>
        <div class="guestbook-board" data-reveal>
          <div class="guestbook-form-card">
            <h3 class="card-title">방명록 남기기</h3>
            ${messageFormTemplate("guestbook", "오늘의 한마디를 남겨주세요.", "글 남기기")}
          </div>
          <div class="guestbook-list-card">
            <div class="message-list-head">
              <h3 class="card-title">최근 방명록</h3>
              <button class="line-button small" type="button" data-message-refresh data-message-type="guestbook">새로고침</button>
            </div>
            <div class="message-list" data-message-list data-message-type="guestbook" data-empty="${messageCopy.emptyGuestbook}"></div>
          </div>
        </div>
      </section>
    `;
  }
}

class KolonJoin extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <section class="join-section" aria-labelledby="joinTitle">
        <img class="join-backdrop" ${responsiveImageAttrs("images/archive-2026-03-1-display.jpg", "full")} alt="" width="1800" height="1350" loading="lazy" decoding="async" />
        <div class="join-inner" data-reveal>
          <p class="eyebrow on-dark"><span class="eyebrow-dot" aria-hidden="true"></span>Join Us</p>
          <h2 id="joinTitle">다음 라운드, <em>함께해요.</em></h2>
          <p>골프를 좋아하는 코오롱인이라면 누구나 환영합니다.<br class="desktop-only" /> 실력은 상관없어요. 함께 즐길 마음이면 충분합니다.</p>
          <div class="button-row">
            <button class="solid-button accent" type="button" data-open-modal="joinModal">가입 문의하기 <span aria-hidden="true">→</span></button>
            <a class="line-button on-dark" href="#top">맨 위로</a>
          </div>
        </div>
      </section>
    `;
  }
}

class KolonModalStack extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <div class="modal" id="joinModal" aria-hidden="true">
        <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="joinModalTitle">
          <div class="modal-head">
            <div>
              <p class="section-kicker">Join</p>
              <h3 id="joinModalTitle">가입 문의</h3>
            </div>
            <button class="line-button small" type="button" data-close-modal>닫기</button>
          </div>
          <div class="modal-body">
            <p>정기 라운드, 기록 공유, 친선 매치를 함께하는 코오롱 골프 동호회입니다.</p>
            <p>${contactLine("회장")}</p>
            <p>${contactLine("총무")}</p>
          </div>
        </div>
      </div>

      <div class="modal lightbox" id="photoLightbox" aria-hidden="true">
        <div class="modal-card lightbox-card" role="dialog" aria-modal="true" aria-labelledby="lightboxTitle">
          <div class="modal-head">
            <div>
              <p class="section-kicker">Archive Photo</p>
              <h3 id="lightboxTitle">행사 사진</h3>
              <p id="lightboxCaption">모임 사진</p>
            </div>
            <button class="line-button small" type="button" data-close-modal>닫기</button>
          </div>
          <div class="lightbox-stage">
            <button class="lightbox-nav" id="lightboxPrev" type="button" aria-label="이전 사진">‹</button>
            <img id="lightboxImage" alt="동호회 아카이브 사진" />
            <button class="lightbox-nav" id="lightboxNext" type="button" aria-label="다음 사진">›</button>
          </div>
          <div class="lightbox-thumbs" id="lightboxThumbs" aria-label="썸네일 목록"></div>
          <div class="archive-comment-panel" data-archive-comments>
            <div class="message-list-head">
              <div>
                <p class="section-kicker">Round Comments</p>
                <h4 id="archiveCommentTitle">라운드 댓글</h4>
              </div>
              <button class="line-button small" type="button" data-message-refresh data-message-type="archive_comment">새로고침</button>
            </div>
            <div class="message-list compact" data-message-list data-message-type="archive_comment" data-empty="${messageCopy.emptyArchive}"></div>
            ${messageFormTemplate("archive_comment", "이 라운드의 기억을 남겨주세요.", "댓글 남기기")}
          </div>
        </div>
      </div>
    `;
  }
}

class KolonBottomNotice extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";

    // 하단 공지는 "다음 일정" 안내이므로 확정된 미래 일정이 있을 때만 띄웁니다.
    const nextEvent = getNextEvent();
    if (!nextEvent) {
      this.innerHTML = "";
      this.hidden = true;
      return;
    }

    this.innerHTML = `
      <section class="bottom-notice" data-bottom-notice role="region" aria-labelledby="bottomNoticeTitle" aria-live="polite">
        <span class="notice-mark" aria-hidden="true"></span>
        <div class="notice-copy">
          <p>${nextEvent.eyebrow}${ddayLabel(nextEvent) ? ` · <strong>${ddayLabel(nextEvent)}</strong>` : ""}</p>
          <h2 id="bottomNoticeTitle">${nextEvent.title}</h2>
          <span>${nextEvent.details?.[0]?.[1] || nextEvent.date}</span>
          <small>${nextEvent.body}</small>
        </div>
        <div class="notice-actions">
          <label class="notice-check">
            <input type="checkbox" data-notice-snooze />
            <span>오늘 하루 숨기기</span>
          </label>
          <a class="line-button small" href="#schedule">일정 보기</a>
          <button class="notice-close" type="button" data-close-bottom-notice aria-label="하단 일정 공지 닫기"></button>
        </div>
      </section>
    `;
  }
}

class KolonFooter extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <footer class="site-footer">
        <div class="footer-inner">
          <div class="footer-brand-block">
            <a class="brand footer-brand" href="#top">
              <span class="brand-mark" aria-hidden="true"></span>
              <strong>Kolon Golf</strong>
            </a>
            <p>스크린에서 필드까지, 함께 치는 코오롱 골프 동호회.</p>
          </div>
          <nav aria-label="푸터 메뉴">
            <a href="#features">동호회</a>
            <a href="#schedule">일정</a>
            <a href="#leaderboard">순위</a>
            <a href="#archive">기록</a>
            <a href="#members">회원</a>
            <a href="#guestbook">방명록</a>
            <button type="button" data-open-modal="joinModal">가입 문의</button>
          </nav>
          <address>
            ${contactAddressHtml()}
          </address>
          <p class="footer-copy">© ${new Date().getFullYear()} Kolon Golf Society</p>
        </div>
      </footer>
    `;
  }
}

defineElement("kolon-site-header", KolonSiteHeader);
defineElement("kolon-hero", KolonHero);
defineElement("kolon-intro", KolonIntro);
defineElement("kolon-schedule", KolonSchedule);
defineElement("kolon-leaderboard", KolonLeaderboard);
defineElement("kolon-members", KolonMembers);
defineElement("kolon-archive", KolonArchive);
defineElement("kolon-guestbook", KolonGuestbook);
defineElement("kolon-join", KolonJoin);
defineElement("kolon-modal-stack", KolonModalStack);
defineElement("kolon-bottom-notice", KolonBottomNotice);
defineElement("kolon-footer", KolonFooter);

document.body.append(document.createElement("kolon-footer"));
document.documentElement.classList.add("js");

const initHeader = () => {
  const header = document.querySelector("[data-site-header]");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobilePanel = document.getElementById("mobileNav");
  const navLinks = Array.from(document.querySelectorAll(".main-nav a, .mobile-panel a"));
  const sections = ["features", "schedule", "leaderboard", "members", "archive", "guestbook"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const closeMenu = () => {
    header?.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "메뉴 열기");
    if (mobilePanel) mobilePanel.inert = true;
  };

  const syncHeaderState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  const syncActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  menuToggle?.addEventListener("click", () => {
    const nextState = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(nextState));
    menuToggle.setAttribute("aria-label", nextState ? "메뉴 닫기" : "메뉴 열기");
    if (mobilePanel) mobilePanel.inert = !nextState;
    header?.classList.toggle("menu-open", nextState);
  });

  mobilePanel?.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement || target instanceof HTMLButtonElement) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });

  closeMenu();
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header?.classList.contains("menu-open")) { closeMenu(); menuToggle?.focus(); }
  });
  syncHeaderState();
  window.addEventListener("scroll", syncHeaderState, { passive: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) syncActiveLink(visible.target.id);
      },
      { threshold: [0.18, 0.34], rootMargin: "-18% 0px -62% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
  }
};

const initSmoothScroll = () => {
  document.querySelectorAll("a[href^='#']").forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
};

const initReveal = () => {
  const revealTargets = Array.from(document.querySelectorAll("[data-reveal]"));
  revealTargets.forEach((target, index) => {
    target.classList.add("reveal-ready");
    target.style.setProperty("--reveal-delay", `${Math.min(index * 35, 180)}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
  );

  revealTargets.forEach((target) => observer.observe(target));
};

const initScrollProgress = () => {
  const progress = document.getElementById("scrollProgress");
  if (!progress) return;

  const update = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const value = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    progress.style.setProperty("--progress", value.toFixed(4));
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
};

const initMemberSearch = () => {
  const input = document.getElementById("memberSearch");
  const reset = document.getElementById("memberReset");
  const more = document.getElementById("memberMore");
  const status = document.getElementById("memberResult");
  const cards = Array.from(document.querySelectorAll("[data-member-card]"));
  let expanded = false;
  const applyFilter = () => {
    const query = input?.value.trim().toLowerCase() || "";
    let regularCount = 0, matches = 0, shown = 0;
    cards.forEach((card) => {
      const match = card.textContent.toLowerCase().includes(query);
      if (match) matches += 1;
      const regular = !card.classList.contains("staff-card");
      if (match && regular) regularCount += 1;
      card.hidden = !match || (!query && !expanded && regular && regularCount > 8);
      card.classList.remove("is-hidden");
      if (!card.hidden) shown += 1;
    });
    if (status) status.textContent = query ? (matches ? `검색 결과 ${matches}명` : "일치하는 회원이 없습니다.") : `${members.length}명 중 ${shown}명`;
    if (more) {
      more.hidden = Boolean(query) || regularCount <= 8;
      more.setAttribute("aria-expanded", String(expanded));
      more.textContent = expanded ? "간략히 보기 −" : `회원 ${members.length}명 모두 보기 ＋`;
    }
  };
  input?.addEventListener("input", applyFilter);
  reset?.addEventListener("click", () => { if (input) { input.value = ""; applyFilter(); input.focus(); } });
  more?.addEventListener("click", () => { expanded = !expanded; applyFilter(); });
  applyFilter();
};
const initHeroSlider = () => {
  const frame = document.getElementById("heroFrame");
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const date = document.getElementById("heroDate");
  const caption = document.getElementById("heroCaption");
  const count = document.getElementById("heroSlideCount");
  if (!frame || slides.length < 2) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0, timer = 0, paused = false;

  // 보이지 않는 슬라이드까지 한꺼번에 받지 않도록, 필요한 장만 data-* 값을 실제 속성으로 옮깁니다.
  const ensureLoaded = (slideIndex) => {
    const image = slides[(slideIndex + slides.length) % slides.length];
    if (!image?.dataset.src) return;
    image.sizes = image.dataset.sizes;
    image.srcset = image.dataset.srcset;
    image.src = image.dataset.src;
    delete image.dataset.src;
  };

  const show = (nextIndex) => {
    index = (nextIndex + heroSlideData.length) % heroSlideData.length;
    const slide = heroSlideData[index];
    ensureLoaded(index);
    ensureLoaded(index + 1);
    slides.forEach((image, imageIndex) => {
      const active = imageIndex === index;
      image.classList.toggle("is-active", active);
      image.alt = active ? slide.caption : "";
    });
    frame.dataset.archiveIndex = String(slide.archiveIndex);
    frame.dataset.imageIndex = String(slide.imageIndex);
    frame.setAttribute("aria-label", `${slide.caption} 사진 크게 보기`);
    if (date) date.textContent = slide.date;
    if (caption) caption.textContent = slide.caption;
    if (count) count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(heroSlideData.length).padStart(2, "0")}`;
  };

  // 자동 넘김은 움직임 최소화 설정을 존중하고, 사용자가 사진을 보는 동안에는 멈춥니다.
  const schedule = () => {
    window.clearInterval(timer);
    if (reduceMotion || paused) return;
    timer = window.setInterval(() => show(index + 1), 6000);
  };

  document.querySelectorAll("[data-hero-slide]").forEach((control) => {
    control.addEventListener("click", () => {
      show(index + (control.dataset.heroSlide === "next" ? 1 : -1));
      schedule();
    });
  });
  const media = frame.closest(".hero-media");
  media?.addEventListener("pointerenter", () => { paused = true; schedule(); });
  media?.addEventListener("pointerleave", () => { paused = false; schedule(); });
  media?.addEventListener("focusin", () => { paused = true; schedule(); });
  media?.addEventListener("focusout", () => { paused = false; schedule(); });
  document.addEventListener("visibilitychange", () => { paused = document.hidden; schedule(); });
  // 첫 화면이 다 뜬 뒤 다음 장을 미리 받아 둡니다.
  window.addEventListener("load", () => ensureLoaded(1), { once: true });
  schedule();
};

const initLeaderboard = () => {
  const tabs = Array.from(document.querySelectorAll("[data-leaderboard-tab]"));
  const select = (tab) => {
    tabs.forEach((other) => {
      const active = other === tab;
      other.setAttribute("aria-selected", String(active));
      other.tabIndex = active ? 0 : -1;
      document.getElementById(other.getAttribute("aria-controls")).hidden = !active;
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      const next = tabs[(index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      select(next);
      next.focus();
    });
  });
  document.querySelectorAll("[data-leaderboard-more]").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = button.closest(".leaderboard-panel");
      const expanded = button.getAttribute("aria-expanded") !== "true";
      panel.querySelectorAll("[data-extra-row]").forEach((row) => { row.hidden = !expanded; });
      button.setAttribute("aria-expanded", String(expanded));
      button.textContent = expanded ? "상위 10명만 보기 −" : `전체 ${panel.querySelectorAll(".leaderboard-row").length}명 보기 ＋`;
    });
  });
};

const initCalendarButtons = () => {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-add-calendar]");
    if (!button) return;
    const calendarEvent = upcomingEvents.find((item) => item.id === button.getAttribute("data-add-calendar"));
    if (calendarEvent) downloadIcs(calendarEvent);
  });
};
const initModals = () => {
  const modals = Array.from(document.querySelectorAll(".modal"));
  let lastFocusedElement = null;

  const syncBody = () => {
    document.body.classList.toggle("modal-open", modals.some((modal) => modal.classList.contains("open")));
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    syncBody();
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
  };

  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    lastFocusedElement = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    syncBody();
    modal.querySelector("button, a, input, [tabindex]:not([tabindex='-1'])")?.focus();
  };

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const openTrigger = target.closest("[data-open-modal]");
    if (openTrigger) {
      event.preventDefault();
      openModal(openTrigger.getAttribute("data-open-modal"));
      return;
    }

    const closeTrigger = target.closest("[data-close-modal]");
    if (closeTrigger) {
      event.preventDefault();
      closeModal(closeTrigger.closest(".modal"));
      return;
    }

    if (target.classList.contains("modal")) closeModal(target);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    modals.forEach(closeModal);
  });

  return { openModal, closeModal };
};

const initLightbox = () => {
  const lightbox = document.getElementById("photoLightbox");
  const image = document.getElementById("lightboxImage");
  const title = document.getElementById("lightboxTitle");
  const caption = document.getElementById("lightboxCaption");
  const thumbs = document.getElementById("lightboxThumbs");
  const prev = document.getElementById("lightboxPrev");
  const next = document.getElementById("lightboxNext");
  let currentGallery = [];
  let currentArchive = null;
  let index = 0;

  const render = (nextIndex) => {
    if (!currentGallery.length || !currentArchive) return;
    index = (nextIndex + currentGallery.length) % currentGallery.length;
    if (image) {
      image.src = currentGallery[index];
      image.alt = `${currentArchive.title} ${index + 1}번째 사진`;
    }
    if (title) title.textContent = currentArchive.title;
    if (caption) caption.textContent = `${currentArchive.date} · ${currentArchive.location} · ${index + 1}/${currentGallery.length}`;

    thumbs?.querySelectorAll(".lightbox-thumb").forEach((thumb, thumbIndex) => {
      thumb.classList.toggle("active", thumbIndex === index);
    });
  };

  const open = (archiveIndex, startIndex = 0) => {
    currentArchive = archives[archiveIndex];
    if (!currentArchive || !lightbox) return;
    currentGallery = currentArchive.images;
    thumbs.innerHTML = "";
    currentGallery.forEach((src, thumbIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lightbox-thumb";
      button.style.backgroundImage = `url("${thumbSource(src)}")`;
      button.setAttribute("aria-label", `${thumbIndex + 1}번째 사진 보기`);
      button.addEventListener("click", () => render(thumbIndex));
      thumbs.append(button);
    });

    render(Math.min(Math.max(0, startIndex), currentGallery.length - 1));
    document.dispatchEvent(new CustomEvent("archive-comment-scope", { detail: { archive: currentArchive } }));
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    lightbox.querySelector("[data-close-modal]")?.focus();
  };

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const trigger = target.closest("[data-archive-index]");
    if (!trigger) return;
    event.preventDefault();
    open(Number(trigger.getAttribute("data-archive-index")), Number(trigger.getAttribute("data-image-index")) || 0);
  });

  prev?.addEventListener("click", () => render(index - 1));
  next?.addEventListener("click", () => render(index + 1));

  document.addEventListener("keydown", (event) => {
    if (!lightbox?.classList.contains("open")) return;
    if (event.key === "ArrowLeft") render(index - 1);
    if (event.key === "ArrowRight") render(index + 1);
  });
};

const initMessages = () => {
  const siteKey = getTurnstileSiteKey();
  let turnstileReady = null;

  const formatDate = (value) => {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat("ko-KR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(value));
    } catch {
      return "";
    }
  };

  const setStatus = (form, message, isError = false) => {
    const status = form?.querySelector("[data-message-status]");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  };

  const showListMessage = (list, message, isError = false) => {
    if (!list) return;
    list.innerHTML = "";
    const empty = document.createElement("p");
    empty.className = "message-empty";
    empty.classList.toggle("is-error", isError);
    empty.textContent = message;
    list.append(empty);
  };

  const renderList = (list, items) => {
    if (!list) return;
    list.innerHTML = "";
    if (!items.length) {
      showListMessage(list, list.dataset.empty || messageCopy.emptyGuestbook);
      return;
    }

    items.forEach((item) => {
      const article = document.createElement("article");
      article.className = "message-item";

      const meta = document.createElement("div");
      meta.className = "message-meta";

      const author = document.createElement("strong");
      author.textContent = item.authorName || "익명";

      const time = document.createElement("time");
      time.dateTime = item.createdAt ? new Date(item.createdAt).toISOString() : "";
      time.textContent = formatDate(item.createdAt);

      const body = document.createElement("p");
      body.textContent = item.body || "";

      meta.append(author, time);
      article.append(meta, body);
      list.append(article);
    });
  };

  const requestJson = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Accept": "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers
      }
    });
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) throw new Error(messageCopy.unavailable);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || messageCopy.unavailable);
    return data;
  };

  const messageUrl = (type, archiveId = "") => {
    const params = new URLSearchParams({ type });
    if (archiveId) params.set("archiveId", archiveId);
    return `${getMessageApiBase().replace(/\/$/, "")}/messages?${params.toString()}`;
  };

  const loadList = async (list, type, archiveId = "") => {
    if (!list) return false;
    showListMessage(list, messageCopy.loading);
    try {
      const data = await requestJson(messageUrl(type, archiveId));
      renderList(list, data.items || []);
      return true;
    } catch (error) {
      showListMessage(list, error.message || messageCopy.unavailable, true);
      return false;
    }
  };

  // API가 없는 화면(예: Functions 없이 띄운 미리보기)에서는 폼을 비워두고 기다리게 하지 않고
  // 아예 입력을 막은 뒤 이유를 보여줍니다.
  let writeEnabled = true;
  const setWriteAvailability = (available, reason = "") => {
    writeEnabled = available;
    document.querySelectorAll("[data-message-form]").forEach((form) => {
      form.classList.toggle("is-unavailable", !available);
      form.querySelectorAll("input, textarea, button").forEach((field) => {
        field.disabled = !available;
      });
      if (!available) setStatus(form, reason, true);
      else if (form.querySelector("[data-message-status]")?.classList.contains("is-error")) setStatus(form, "");
    });
  };

  const loadTurnstile = () => {
    if (!siteKey) return Promise.resolve();
    if (window.turnstile) return Promise.resolve();
    if (turnstileReady) return turnstileReady;
    turnstileReady = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
    return turnstileReady;
  };

  const setupTurnstile = async () => {
    // 로컬·Replit 개발 서버는 ALLOW_INSECURE_WRITES를 쓰므로 운영 도메인 전용
    // sitekey를 렌더링하지 않습니다. 허용되지 않은 hostname 오류(110200)도 피합니다.
    if (!siteKey || !isProductionHost()) return;
    try {
      await loadTurnstile();
      document.querySelectorAll("[data-turnstile-slot]").forEach((slot) => {
        if (slot.dataset.widgetId || !window.turnstile) return;
        slot.dataset.widgetId = window.turnstile.render(slot, {
          sitekey: siteKey,
          theme: "light"
        });
      });
    } catch {
      document.querySelectorAll("[data-message-form]").forEach((form) => {
        setStatus(form, "보안 확인을 불러오지 못했습니다.", true);
      });
    }
  };

  const getTurnstileToken = (form) => {
    if (!siteKey || !window.turnstile) return "";
    const slot = form.querySelector("[data-turnstile-slot]");
    return slot?.dataset.widgetId ? window.turnstile.getResponse(slot.dataset.widgetId) : "";
  };

  const resetTurnstile = (form) => {
    if (!siteKey || !window.turnstile) return;
    const slot = form.querySelector("[data-turnstile-slot]");
    if (slot?.dataset.widgetId) window.turnstile.reset(slot.dataset.widgetId);
  };

  const getListFor = (type) =>
    document.querySelector(`.message-list[data-message-type="${type}"]`);

  document.querySelectorAll("[data-message-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      if (formData.get("website")) {
        form.reset();
        setStatus(form, messageCopy.saved);
        return;
      }

      if (!writeEnabled) return;

      const type = form.dataset.messageType || "guestbook";
      const archiveId = form.dataset.archiveId || "";
      const authorName = String(formData.get("authorName") || "").trim();
      const body = String(formData.get("body") || "").trim();
      const turnstileToken = getTurnstileToken(form);

      if (!authorName || !body) {
        setStatus(form, "이름과 내용을 모두 입력해주세요.", true);
        return;
      }
      if (type === "archive_comment" && !archiveId) {
        setStatus(form, "댓글을 남길 라운드를 먼저 열어주세요.", true);
        return;
      }

      const submitButton = form.querySelector("button[type='submit']");
      if (submitButton) submitButton.disabled = true;
      setStatus(form, messageCopy.saving);

      try {
        await requestJson(`${getMessageApiBase().replace(/\/$/, "")}/messages`, {
          method: "POST",
          body: JSON.stringify({ type, archiveId, authorName, body, turnstileToken })
        });
        form.reset();
        resetTurnstile(form);
        setStatus(form, messageCopy.saved);
        const list = getListFor(type);
        await loadList(list, type, archiveId);
      } catch (error) {
        setStatus(form, error.message || messageCopy.unavailable, true);
        resetTurnstile(form);
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  });

  document.querySelectorAll("[data-message-refresh]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.messageType || "guestbook";
      const list = getListFor(type);
      loadList(list, type, button.dataset.archiveId || "");
    });
  });

  document.addEventListener("archive-comment-scope", (event) => {
    const archive = event.detail?.archive;
    if (!archive?.id) return;
    const panel = document.querySelector("[data-archive-comments]");
    const title = document.getElementById("archiveCommentTitle");
    const form = panel?.querySelector('[data-message-form][data-message-type="archive_comment"]');
    const list = panel?.querySelector('[data-message-list][data-message-type="archive_comment"]');
    const refresh = panel?.querySelector('[data-message-refresh][data-message-type="archive_comment"]');
    if (title) title.textContent = `${archive.title} 댓글`;
    if (form) form.dataset.archiveId = archive.id;
    if (list) list.dataset.archiveId = archive.id;
    if (refresh) refresh.dataset.archiveId = archive.id;
    loadList(list, "archive_comment", archive.id);
  });

  setupTurnstile();

  (async () => {
    const reachable = await loadList(getListFor("guestbook"), "guestbook");
    if (!reachable) {
      setWriteAvailability(false, messageCopy.writeUnavailable);
      return;
    }
    // 공개 배포에서 sitekey가 없으면 서버가 fail-closed로 저장을 거부하므로 미리 알려줍니다.
    if (isProductionHost() && !siteKey) {
      setWriteAvailability(false, messageCopy.securityNotConfigured);
      return;
    }
    setWriteAvailability(true);
  })();
};

const initMemberExperienceEnhancements = () => {
  const cards = Array.from(document.querySelectorAll("[data-archive-year]"));
  const filters = Array.from(document.querySelectorAll("[data-archive-filter]"));
  const more = document.getElementById("archiveMore");
  const status = document.getElementById("archiveResult");
  let year = "all", expanded = false;
  const applyFilter = () => {
    const matching = cards.filter((card) => year === "all" || card.dataset.archiveYear === year);
    cards.forEach((card) => { const position = matching.indexOf(card); card.hidden = position < 0 || (!expanded && position >= 4); });
    filters.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.archiveFilter === year)));
    if (status) status.textContent = `${year === "all" ? "전체" : year} · ${matching.length}개의 라운드`;
    if (more) { more.hidden = matching.length <= 4; more.setAttribute("aria-expanded", String(expanded)); more.textContent = expanded ? "최근 라운드만 보기 −" : `이전 라운드 ${matching.length - 4}개 더 보기 ＋`; }
  };
  filters.forEach((button) => button.addEventListener("click", () => { year = button.dataset.archiveFilter; expanded = false; applyFilter(); }));
  more?.addEventListener("click", () => { expanded = !expanded; applyFilter(); });
  applyFilter();
  // Load previews only for cards entering view; production database remains read-only.
  const loadCount = async (target) => {
    const count = target.querySelector("[data-comment-count]");
    try {
      const response = await fetch(`${getMessageApiBase().replace(/\/$/, "")}/messages?type=archive_comment&archiveId=${encodeURIComponent(target.dataset.archiveActions)}`, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Messages unavailable");
      const data = await response.json();
      if (!Array.isArray(data.items)) throw new Error("Invalid messages");
      count.textContent = data.items.length ? `댓글 ${data.items.length}${data.items.length >= 20 ? "+" : ""}개` : "댓글 남기기";
    } catch { count.textContent = "사진과 댓글"; }
  };
  const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { observer.unobserve(entry.target); loadCount(entry.target); } });
  }, { rootMargin: "100px" }) : null;
  cards.forEach((card) => {
    const trigger = card.querySelector("[data-archive-index]");
    const archive = archives[Number(trigger?.dataset.archiveIndex)];
    const body = card.querySelector(".archive-body, .featured-body");
    if (!archive || !body) return;
    body.insertAdjacentHTML("beforeend", `<div class="archive-card-actions" data-archive-actions="${archive.id}"><button class="archive-card-comment" type="button" data-archive-index="${trigger.dataset.archiveIndex}" aria-label="${archive.title} 사진과 댓글 보기"><span data-comment-count>사진과 댓글</span><span aria-hidden="true">↗</span></button></div>`);
    const actions = body.querySelector("[data-archive-actions]");
    if (observer) observer.observe(actions); else loadCount(actions);
  });
  document.querySelectorAll("img").forEach((image) => {
    const syncRatio = () => { if (image.naturalWidth && image.naturalHeight) image.classList.toggle("is-portrait-photo", image.naturalHeight > image.naturalWidth * 1.08); };
    if (image.complete) syncRatio();
    image.addEventListener("load", syncRatio);
  });
};
const initMessageAdmin = () => {
  const footerNav = document.querySelector(".site-footer nav");
  if (!footerNav || footerNav.querySelector("[data-admin-open]")) return;

  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "admin-footer-button";
  launcher.dataset.adminOpen = "true";
  launcher.textContent = "관리자";
  footerNav.append(launcher);

  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="modal admin-panel-modal" id="messageAdminPanel" aria-hidden="true">
      <section class="modal-card admin-panel-card" role="dialog" aria-modal="true" aria-labelledby="adminPanelTitle">
        <div class="modal-head">
          <div>
            <p class="section-kicker">댓글 관리</p>
            <h3 id="adminPanelTitle">방명록과 아카이브 댓글 관리</h3>
            <p>비밀번호 확인 후 글을 숨기거나 완전히 삭제할 수 있습니다.</p>
          </div>
          <button class="notice-close" type="button" data-admin-close aria-label="관리자 창 닫기"></button>
        </div>
        <div class="admin-panel-body">
          <form class="admin-auth-form" data-admin-auth>
            <label>
              <span>관리자 비밀번호</span>
              <input type="password" name="adminToken" autocomplete="current-password" placeholder="Cloudflare ADMIN_TOKEN" />
            </label>
            <button class="solid-button" type="submit">댓글 불러오기</button>
          </form>
          <div class="admin-toolbar">
            <label>
              <span>보기</span>
              <select data-admin-filter>
                <option value="">전체 댓글</option>
                <option value="guestbook">방명록</option>
                <option value="archive_comment">아카이브 댓글</option>
              </select>
            </label>
            <button class="line-button small" type="button" data-admin-refresh>새로고침</button>
          </div>
          <p class="message-status" data-admin-status>관리자 비밀번호를 입력하면 최근 댓글을 불러옵니다.</p>
          <div class="admin-message-list" data-admin-list></div>
        </div>
      </section>
    </div>`
  );

  const modal = document.getElementById("messageAdminPanel");
  const form = modal?.querySelector("[data-admin-auth]");
  const tokenInput = modal?.querySelector("input[name='adminToken']");
  const list = modal?.querySelector("[data-admin-list]");
  const status = modal?.querySelector("[data-admin-status]");
  const filter = modal?.querySelector("[data-admin-filter]");
  const refresh = modal?.querySelector("[data-admin-refresh]");
  const storageKey = "kolongolf:admin-token";
  let cachedItems = [];

  const setStatus = (message, isError = false) => {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", isError);
  };

  const open = () => {
    modal?.classList.add("open");
    modal?.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (tokenInput instanceof HTMLInputElement) {
      tokenInput.value = window.sessionStorage.getItem(storageKey) || "";
      tokenInput.focus();
    }
  };

  const close = () => {
    modal?.classList.remove("open");
    modal?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  const getToken = () => tokenInput instanceof HTMLInputElement ? tokenInput.value.trim() : "";

  const escapeText = (value) => String(value || "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  }[char]));

  const formatDate = (value) => {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(value));
    } catch {
      return "";
    }
  };

  const labelType = (type) => type === "archive_comment" ? "아카이브 댓글" : "방명록";
  const labelStatus = (item) => item.status === "hidden" ? "숨김" : "노출 중";

  const render = (items) => {
    if (!list) return;
    cachedItems = items;
    if (!items.length) {
      list.innerHTML = `<p class="message-empty">표시할 댓글이 없습니다.</p>`;
      return;
    }

    list.innerHTML = items.map((item) => `
      <article class="admin-message-card ${item.status === "hidden" ? "is-hidden-message" : ""}">
        <div class="admin-message-head">
          <span>${labelType(item.type)}</span>
          <strong>${escapeText(item.authorName || "익명")}</strong>
          <em>${labelStatus(item)}</em>
        </div>
        <p>${escapeText(item.body)}</p>
        <div class="admin-message-meta">
          <span>#${item.id}</span>
          ${item.archiveId ? `<span>${escapeText(item.archiveId)}</span>` : ""}
          <time>${formatDate(item.createdAt)}</time>
        </div>
        <div class="admin-message-actions">
          ${item.status === "hidden"
            ? `<button class="line-button small" type="button" data-admin-action="show" data-message-id="${item.id}">다시 보이기</button>`
            : `<button class="line-button small" type="button" data-admin-action="hide" data-message-id="${item.id}">숨기기</button>`}
          <button class="line-button small danger" type="button" data-admin-action="delete" data-message-id="${item.id}">완전 삭제</button>
        </div>
      </article>
    `).join("");
  };

  const adminRequest = async (path, options = {}) => {
    const token = getToken();
    if (!token) throw new Error("관리자 비밀번호를 입력해주세요.");
    const response = await fetch(`${getMessageApiBase().replace(/\/$/, "")}${path}`, {
      ...options,
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers
      }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "요청을 처리하지 못했습니다.");
    window.sessionStorage.setItem(storageKey, token);
    return data;
  };

  const load = async () => {
    setStatus("댓글을 불러오는 중입니다.");
    const type = filter instanceof HTMLSelectElement ? filter.value : "";
    try {
      const params = new URLSearchParams({ admin: "1", limit: "200" });
      if (type) params.set("type", type);
      const data = await adminRequest(`/messages?${params.toString()}`);
      render(data.items || []);
      setStatus(`최근 댓글 ${data.items?.length || 0}개를 불러왔습니다.`);
    } catch (error) {
      render([]);
      setStatus(error.message || "댓글을 불러오지 못했습니다.", true);
    }
  };

  launcher.addEventListener("click", open);
  modal?.querySelector("[data-admin-close]")?.addEventListener("click", close);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    load();
  });

  refresh?.addEventListener("click", load);
  filter?.addEventListener("change", () => {
    if (cachedItems.length) load();
  });

  list?.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-admin-action]");
    if (!(button instanceof HTMLButtonElement)) return;
    const id = Number(button.dataset.messageId);
    const action = button.dataset.adminAction;
    if (!id || !action) return;

    if (action === "delete" && !window.confirm("정말 완전히 삭제할까요? 이 작업은 되돌릴 수 없습니다.")) return;

    button.disabled = true;
    setStatus("변경사항을 저장하는 중입니다.");
    try {
      if (action === "delete") {
        await adminRequest("/messages", {
          method: "DELETE",
          body: JSON.stringify({ id })
        });
      } else {
        await adminRequest("/messages", {
          method: "PATCH",
          body: JSON.stringify({ id, status: action === "hide" ? "hidden" : "visible" })
        });
      }
      await load();
    } catch (error) {
      setStatus(error.message || "변경사항을 저장하지 못했습니다.", true);
    } finally {
      button.disabled = false;
    }
  });
};
// 회원 공개 사진 업로드는 사용하지 않습니다(운영진이 직접 사진을 정리해 배포).
// 예전에 올라온 회원 업로드는 읽기 전용으로 보여주고, 관리자 창에서 승인/숨김/삭제만 할 수 있습니다.
// 업로드 폼과 브라우저 압축 코드는 2026-10-12에 제거했습니다. 다시 필요하면 git 기록의
// `publicArchiveUploadEnabled` 구현을 참고하고, 서버의 ENABLE_ARCHIVE_UPLOADS도 함께 켜야 합니다.
const initArchiveUploadsAndAdmin = () => {
  const apiBase = () => `${getMessageApiBase().replace(/\/$/, "")}/archives`;
  const archiveRoot = document.getElementById("archive");

  const setText = (node, message, isError = false) => {
    if (!node) return;
    node.textContent = message;
    node.classList.toggle("is-error", isError);
  };

  const escapeText = (value) => String(value || "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  }[char]));

  const renderPublicArchives = (list, items) => {
    if (!list) return;
    if (!items.length) {
      list.innerHTML = `<p class="message-empty">아직 공개된 회원 업로드가 없습니다.</p>`;
      return;
    }
    list.innerHTML = items.map((item) => {
      const cover = item.images?.[0]?.dataUrl || "";
      const imageCount = item.images?.length || 0;
      return `
        <article class="archive-card community-archive-card">
          ${cover ? `<a class="archive-photo" href="${cover}" target="_blank" rel="noopener" aria-label="${escapeText(item.title)} 사진 크게 보기"><img src="${cover}" alt="${escapeText(item.title)} 대표 사진" loading="lazy" decoding="async" /><span>사진 보기</span></a>` : ""}
          <div class="archive-body">
            <p class="archive-meta">${escapeText(item.date)} · 회원 업로드</p>
            <h3>${escapeText(item.title)}</h3>
            <p>${escapeText(item.summary)}</p>
            <div class="archive-foot">
              <span>${escapeText(item.location)}</span>
              ${item.people ? `<span>${escapeText(item.people)}</span>` : ""}
              <span>사진 ${imageCount}장</span>
            </div>
          </div>
        </article>
      `;
    }).join("");
  };

  const publicArchiveSectionHtml = () => `<section class="community-archive-section site-section" data-archive-upload-section>
        <div class="section-heading">
          <div>
            <p class="eyebrow">Member Uploads</p>
            <h2>회원이 올린 지난 기록</h2>
          </div>
          <p>새 사진은 운영진이 직접 정리해 올립니다. 공유하고 싶은 사진은 운영진에게 전달해주세요.</p>
        </div>
        <div class="community-archive-board is-readonly">
          <div class="community-archive-list-card">
            <div class="message-list-head">
              <div><p class="section-kicker">공개된 회원 업로드</p><h3>지금까지 올라온 기록</h3></div>
              <button class="line-button small" type="button" data-public-archive-refresh>새로고침</button>
            </div>
            <div class="archive-grid community-archive-grid" data-public-archive-list></div>
          </div>
        </div>
      </section>`;

  const ensurePublicArchiveSection = () => {
    if (!archiveRoot) return null;
    if (!archiveRoot.querySelector("[data-archive-upload-section]")) {
      archiveRoot.insertAdjacentHTML("beforeend", publicArchiveSectionHtml());
    }
    return archiveRoot.querySelector("[data-public-archive-list]");
  };

  const loadPublicArchives = async () => {
    if (!archiveRoot) return;
    try {
      const response = await fetch(`${apiBase()}?limit=12`, { headers: { "Accept": "application/json" } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "회원 업로드를 불러오지 못했습니다.");
      const items = data.items || [];
      // 남아 있는 기록이 있을 때만 섹션을 보여줍니다.
      if (!items.length) {
        archiveRoot.querySelector("[data-archive-upload-section]")?.remove();
        return;
      }
      renderPublicArchives(ensurePublicArchiveSection(), items);
    } catch {
      // 조회 실패는 관리자 화면에서 확인합니다. 공개 화면에 오류 문구를 남기지 않습니다.
    }
  };

  // 섹션이 나중에 삽입되므로 위임으로 새로고침 버튼을 처리합니다.
  document.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("[data-public-archive-refresh]")) {
      loadPublicArchives();
    }
  });
  loadPublicArchives();

  const adminBody = document.querySelector("#messageAdminPanel .admin-panel-body");
  if (adminBody && !adminBody.querySelector("[data-admin-archive-board]")) {
    adminBody.insertAdjacentHTML(
      "beforeend",
      `<section class="admin-archive-board" data-admin-archive-board>
        <div class="message-list-head">
          <div><p class="section-kicker">아카이브 관리</p><h3>회원 업로드 승인 관리</h3></div>
          <button class="line-button small" type="button" data-admin-archive-refresh>업로드 불러오기</button>
        </div>
        <p class="message-status" data-admin-archive-status>회원이 올린 아카이브를 승인하거나 숨길 수 있습니다.</p>
        <div class="admin-archive-list" data-admin-archive-list></div>
      </section>`
    );
  }

  const getAdminToken = () => document.querySelector("#messageAdminPanel input[name='adminToken']")?.value.trim() || "";
  const adminArchiveStatus = document.querySelector("[data-admin-archive-status]");
  const adminArchiveList = document.querySelector("[data-admin-archive-list]");

  const adminArchiveRequest = async (options = {}) => {
    const token = getAdminToken();
    if (!token) throw new Error("관리자 비밀번호를 입력해주세요.");
    const response = await fetch(options.path ? `${apiBase()}${options.path}` : `${apiBase()}?admin=1&limit=200`, {
      method: options.method || "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
        ...(options.body ? { "Content-Type": "application/json" } : {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "요청을 처리하지 못했습니다.");
    return data;
  };

  const renderAdminArchives = (items) => {
    if (!adminArchiveList) return;
    if (!items.length) {
      adminArchiveList.innerHTML = `<p class="message-empty">관리할 회원 업로드가 없습니다.</p>`;
      return;
    }
    adminArchiveList.innerHTML = items.map((item) => {
      const cover = item.images?.[0]?.dataUrl || "";
      const statusLabel = item.status === "visible" ? "공개" : item.status === "hidden" ? "숨김" : "대기";
      const imageTools = (item.images || []).map((image, imageIndex) => `
        <figure class="admin-archive-image ${image.status === "hidden" ? "is-hidden-image" : ""}">
          <img src="${image.dataUrl}" alt="${escapeText(image.alt || item.title)}" loading="lazy" decoding="async" />
          <figcaption>
            <span>${image.status === "hidden" ? "숨김" : `사진 ${imageIndex + 1}`}</span>
            <button class="line-button small" type="button" data-admin-archive-image-action="${image.status === "hidden" ? "visible" : "hidden"}" data-image-id="${image.id}">${image.status === "hidden" ? "다시 보이기" : "사진 숨기기"}</button>
            <button class="line-button small danger" type="button" data-admin-archive-image-action="delete" data-image-id="${image.id}">사진 삭제</button>
          </figcaption>
        </figure>
      `).join("");
      return `
        <article class="admin-archive-card">
          ${cover ? `<img src="${cover}" alt="${escapeText(item.title)} 대표 사진" loading="lazy" decoding="async" />` : ""}
          <div>
            <div class="admin-message-head"><span>${statusLabel}</span><strong>${escapeText(item.title)}</strong><em>${escapeText(item.authorName || "익명")}</em></div>
            <p>${escapeText(item.summary)}</p>
            <div class="admin-message-meta"><span>#${item.id}</span><span>${escapeText(item.date)}</span><span>${escapeText(item.location)}</span><span>사진 ${item.images?.length || 0}장</span></div>
            ${imageTools ? `<div class="admin-archive-images">${imageTools}</div>` : ""}
            <div class="admin-message-actions">
              <button class="line-button small" type="button" data-admin-archive-action="visible" data-archive-id="${item.id}">공개</button>
              <button class="line-button small" type="button" data-admin-archive-action="hidden" data-archive-id="${item.id}">숨기기</button>
              <button class="line-button small" type="button" data-admin-archive-action="pending" data-archive-id="${item.id}">대기</button>
              <button class="line-button small danger" type="button" data-admin-archive-action="delete" data-archive-id="${item.id}">완전 삭제</button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  };

  const loadAdminArchives = async () => {
    setText(adminArchiveStatus, "회원 업로드를 불러오는 중입니다.");
    try {
      const data = await adminArchiveRequest();
      renderAdminArchives(data.items || []);
      setText(adminArchiveStatus, `회원 업로드 ${data.items?.length || 0}개를 불러왔습니다.`);
    } catch (error) {
      renderAdminArchives([]);
      setText(adminArchiveStatus, error.message || "회원 업로드를 불러오지 못했습니다.", true);
    }
  };

  document.querySelector("[data-admin-archive-refresh]")?.addEventListener("click", loadAdminArchives);
  adminArchiveList?.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const imageButton = target.closest("[data-admin-archive-image-action]");
    const archiveButton = target.closest("[data-admin-archive-action]");
    const button = imageButton || archiveButton;
    if (!(button instanceof HTMLButtonElement)) return;

    const imageAction = imageButton instanceof HTMLButtonElement ? imageButton.dataset.adminArchiveImageAction : "";
    const archiveAction = archiveButton instanceof HTMLButtonElement ? archiveButton.dataset.adminArchiveAction : "";
    const imageId = Number(button.dataset.imageId);
    const id = Number(button.dataset.archiveId);

    if (imageAction) {
      if (!imageId) return;
      if (imageAction === "delete" && !window.confirm("이 사진을 완전히 삭제할까요?")) return;
    } else {
      if (!id || !archiveAction) return;
      if (archiveAction === "delete" && !window.confirm("이 아카이브와 사진을 완전히 삭제할까요?")) return;
    }

    button.disabled = true;
    setText(adminArchiveStatus, "변경사항을 저장하는 중입니다.");
    try {
      if (imageAction === "delete") {
        await adminArchiveRequest({ method: "DELETE", body: { imageId } });
      } else if (imageAction) {
        await adminArchiveRequest({ method: "PATCH", body: { imageId, status: imageAction } });
      } else if (archiveAction === "delete") {
        await adminArchiveRequest({ method: "DELETE", body: { id } });
      } else {
        await adminArchiveRequest({ method: "PATCH", body: { id, status: archiveAction } });
      }
      await loadAdminArchives();
      await loadPublicArchives();
    } catch (error) {
      setText(adminArchiveStatus, error.message || "변경사항을 저장하지 못했습니다.", true);
    } finally {
      button.disabled = false;
    }
  });
};
const initBottomNotice = () => {
  const notice = document.querySelector("[data-bottom-notice]");
  if (!notice) return;

  const storageKey = "kolongolf:bottom-notice:hidden-until";
  const hideForToday = 24 * 60 * 60 * 1000;
  const checkbox = notice.querySelector("[data-notice-snooze]");
  const close = notice.querySelector("[data-close-bottom-notice]");

  const getHiddenUntil = () => {
    try {
      return Number(window.localStorage.getItem(storageKey)) || 0;
    } catch {
      return 0;
    }
  };

  const setHiddenUntil = () => {
    try {
      window.localStorage.setItem(storageKey, String(Date.now() + hideForToday));
    } catch {
      // Storage can be unavailable in private browsing or embedded previews.
    }
  };

  if (getHiddenUntil() > Date.now()) {
    notice.hidden = true;
    return;
  }

  window.requestAnimationFrame(() => {
    notice.classList.add("is-visible");
  });

  close?.addEventListener("click", () => {
    if (checkbox instanceof HTMLInputElement && checkbox.checked) setHiddenUntil();
    notice.classList.remove("is-visible");
    window.setTimeout(() => {
      notice.hidden = true;
    }, 220);
  });
};

const initPage = () => {
  initHeader();
  initSmoothScroll();
  initReveal();
  initScrollProgress();
  initMemberSearch();
  initHeroSlider();
  initCalendarButtons();
  initLeaderboard();
  initModals();
  initLightbox();
  initMessages();
  initMessageAdmin();
  initArchiveUploadsAndAdmin();
  initMemberExperienceEnhancements();
  initBottomNotice();
};

initPage();
