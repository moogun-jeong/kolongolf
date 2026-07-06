const members = [
  { handle: "덕충안길", name: "권순노", role: "정회원", note: "페이드 장인" },
  { handle: "살려줘제바알", name: "김경수", role: "정회원", note: "벙커 탈출 1위" },
  { handle: "오!건이", name: "김무건", role: "정회원", note: "파 세이브 감각" },
  { handle: "인생무생", name: "김무생", role: "정회원", note: "후반 집중력" },
  { handle: "울산땡주", name: "김영주", role: "정회원", note: "파3 스페셜" },
  { handle: "원조가가멜", name: "김정훈", role: "정회원", note: "백스핀 컨트롤" },
  { handle: "백돌이깬다", name: "김태연", role: "정회원", note: "정확한 어프로치" },
  { handle: "준빵", name: "김효준", role: "정회원", note: "스윙 템포" },
  { handle: "빽스윙쫌만더", name: "서무환", role: "회장", note: "클럽 리딩", email: "pleaselove@kolon.com" },
  { handle: "날아라호", name: "심재호", role: "정회원", note: "탄도 조절" },
  { handle: "오프로672", name: "오상택", role: "정회원", note: "코스 매니지먼트" },
  { handle: "필드난폭자", name: "윤석현", role: "정회원", note: "공격적 플레이" },
  { handle: "타키온", name: "이동수", role: "정회원", note: "퍼팅 스트로크" },
  { handle: "무근정", name: "정무근", role: "총무", note: "운영 관리", email: "moogunjeong@kolon.com" },
  { handle: "울산정쁘로", name: "정성원", role: "정회원", note: "아이언 정밀도" },
  { handle: "원펀쓰리강냉", name: "천기준", role: "정회원", note: "파워 스윙" },
  { handle: "무적부대", name: "추정술", role: "정회원", note: "위기 탈출" },
  { handle: "장금이에이스", name: "하선재", role: "정회원", note: "정교한 퍼터" },
  { handle: "서승규", name: "서승규", role: "신입회원", note: "침착한 코스 리딩" },
  { handle: "안상욱", name: "안상욱", role: "신입회원", note: "강한 임팩트" },
  { handle: "박동성", name: "박동성", role: "신입회원", note: "클러치 퍼팅" }
];

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

const svgOrnaments = {
  heroCourse: `
    <svg class="hero-course-svg" viewBox="0 0 560 420" aria-hidden="true" focusable="false">
      <path class="svg-fairway" d="M63 346C102 212 197 130 318 114c74-10 133-39 177-88" />
      <path class="svg-fairway soft" d="M42 278c88-12 154-52 198-121 44-69 107-104 188-108" />
      <path class="svg-fairway soft" d="M126 394c45-85 111-132 198-142 73-8 127-40 164-97" />
      <circle cx="418" cy="102" r="38" class="svg-green" />
      <circle cx="418" cy="102" r="7" class="svg-cup" />
      <path class="svg-flagpole" d="M418 101V44" />
      <path class="svg-flag" d="M421 45h47l-13 15 13 15h-47z" />
      <path class="svg-ball-trail" d="M94 324c62-48 127-74 195-79" />
      <circle cx="94" cy="324" r="6" class="svg-ball" />
    </svg>
  `,
  introMap: `
    <svg class="intro-course-svg" viewBox="0 0 360 210" aria-hidden="true" focusable="false">
      <path d="M28 162c42-70 92-103 151-98 57 5 95-13 123-56" />
      <path d="M56 190c36-42 76-62 121-59 64 5 107-21 131-76" />
      <circle cx="287" cy="54" r="26" />
      <path d="M287 54V18M287 18h34l-9 11 9 11h-34" />
    </svg>
  `,
  scheduleMap: `
    <svg class="schedule-course-svg" viewBox="0 0 320 240" aria-hidden="true" focusable="false">
      <path d="M36 184c46-82 102-124 170-126 34-1 59-13 77-36" />
      <path d="M72 216c22-32 51-53 87-62 47-12 83-40 107-84" />
      <circle cx="238" cy="55" r="30" />
      <path d="M238 55V21M238 21h31l-8 10 8 10h-31" />
      <circle cx="76" cy="190" r="5" />
    </svg>
  `,
  archiveMap: `
    <svg class="archive-course-svg" viewBox="0 0 720 260" aria-hidden="true" focusable="false">
      <path d="M34 204c92-110 191-161 297-153 108 8 199-11 273-57" />
      <path d="M124 246c85-64 170-93 254-86 90 8 167-20 230-84" />
      <circle cx="595" cy="64" r="38" />
      <path d="M595 64V18M595 18h48l-13 15 13 15h-48" />
    </svg>
  `,
  joinFlag: `
    <svg class="join-flag-svg" viewBox="0 0 520 260" aria-hidden="true" focusable="false">
      <path d="M52 219c63-91 144-134 244-129 82 4 139-20 172-73" />
      <path d="M90 244c79-49 152-68 219-57 73 12 132-5 177-52" />
      <circle cx="398" cy="82" r="34" />
      <path d="M398 82V29M398 29h58l-16 18 16 18h-58" />
      <circle cx="124" cy="211" r="7" />
    </svg>
  `
};

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

const archives = [
  {
    id: "2026-07-seoknohyup",
    date: "2026.07.04",
    label: "스크린 대회",
    title: "제8회 석노협 스크린골프대회",
    location: "골프존파크 삼산한국골프점",
    people: "A/B팀 8명 참가",
    summary: "울산석유화학공업단지 노동조합 협의회가 주관한 제8회 의장배 대회에 코오롱인더스트리 A/B팀이 참가했습니다. 용원 GC 백로·무학 코스에서 진행된 경기 장면과 대회 후 함께한 시상·식사 자리를 사진으로 남겼습니다.",
    highlights: ["석노협 의장배", "A/B팀 참가", "투비전 NX"],
    details: [
      "일시: 2026년 7월 4일(토) 08:00",
      "장소: 골프존파크 삼산한국골프점",
      "주관: 울산석유화학공업단지 노동조합 협의회",
      "방식: 회사별 4인 1팀, 투비전 NX, 용원 GC 백로·무학",
      "참가: 코오롱인더스트리 A팀(301호) 김효준, 서무환, 정무근, 허선재 / B팀(302호) 김경수, 박동성, 윤석현, 천기준",
      "경기 설정: 투어모드/G투어 난이도, 블루 티, 컨시드 1.5m, 멀리건 없음"
    ],
    images: [
      "images/archive-2026-07-1.jpeg",
      "images/archive-2026-07-2.jpeg",
      "images/archive-2026-07-3.jpeg",
      "images/archive-2026-07-4.jpeg",
      "images/archive-2026-07-5.jpeg",
      "images/archive-2026-07-6.jpeg",
      "images/archive-2026-07-7.jpg",
      "images/archive-2026-07-8.jpeg",
      "images/archive-2026-07-9.jpeg",
      "images/archive-2026-07-10.jpeg",
      "images/archive-2026-07-11.jpeg"
    ]
  },
  {
    id: "2026-06-screen",
    date: "2026.06.23",
    label: "스크린 행사",
    title: "2026년 6월 스크린골프 동호회 행사",
    location: "골프존파크 두왕테크노점",
    people: "6명 참가",
    summary: "골프존파크 두왕테크노점에서 동강시스타CC 코스로 18홀 스트로크 라운드를 진행했습니다. 서무환, 정무근, 김영주, 김효준, 김경수, 하선재 회원이 함께한 6월 스크린 행사입니다.",
    highlights: ["동강시스타CC", "18홀 스트로크", "6명 참가"],
    details: [
      "일시: 2026년 6월 23일(화) 17:00",
      "장소: 골프존파크 두왕테크노점(울산 남구 테크노산업로 78-11)",
      "참석: 서무환, 정무근, 김영주, 김효준, 김경수, 하선재",
      "경기 설정: 동강시스타CC, G투어모드/블루, 그린 스피드 약간 빠름",
      "운영: 방 2개 운영, 1조 1·2·3번 / 2조 4·5·6번 조 편성",
      "세부 규칙: 바람 강하게, 컨시드 1.5m, 멀리건 없음"
    ],
    images: [
      "images/archive-2026-06-1.jpeg",
      "images/archive-2026-06-notice.png"
    ]
  },
  {
    id: "2026-04-baystars",
    date: "2026.04.10",
    label: "필드 행사",
    title: "2026년 4월 베이스타즈CC 필드 행사",
    location: "베이스타즈CC",
    people: "12명 참가",
    summary: "조별 티오프 후 라운딩을 진행하고 명촌 중식 장소에 모여 필드 행사를 함께했습니다. 이동수 팀장님의 홀인원과 전체 1위 시상까지 함께한 자리였습니다.",
    highlights: ["Hole-in-one", "공동 1위", "12명 참가"],
    details: [
      "티오프: 07:20 BAY, 07:55 BAY, 08:09 STARS",
      "운영: 그린피·캐디피 개인 부담, 카트비 동호회 지원",
      "홀인원: 이동수 팀장(STARS 8번 홀)",
      "필드 전체 1위: 권순노 팀장, 서무환 팀장 공동 1위",
      "시상: 니어리스트 이동수, 다버디 심재호"
    ],
    images: [
      "images/archive-2026-04-2.png",
      "images/archive-2026-04-3.png",
      "images/archive-2026-04-1.png"
    ]
  },
  {
    id: "2026-03-regular",
    date: "2026.03.04",
    label: "정기 스크린 라운드",
    title: "2026년 3월 정기전",
    location: "울산골프존",
    people: "10명 참가",
    summary: "새 시즌의 흐름을 만든 3월 정기전입니다. 수상 순간과 단체 사진을 함께 담았습니다.",
    images: [
      "images/archive-2026-03-1-display.jpg",
      "images/archive-2026-03-2-display.jpg",
      "images/archive-2026-03-3-display.jpg",
      "images/archive-2026-03-4-display.jpg"
    ]
  },
  {
    id: "2025-12-year-end",
    date: "2025.12.09",
    label: "송년회",
    title: "2025년 12월 송년 라운드",
    location: "삼산동 울산골프존",
    people: "9명 참가",
    summary: "한 해의 마지막 스코어와 시상 순간을 남긴 송년 모임입니다.",
    images: ["images/archive-2025-12-display.jpg"]
  },
  {
    id: "2025-09-regular",
    date: "2025.09.30",
    label: "3분기 정기전",
    title: "2025년 9월 정기전",
    location: "골프존파크 선암 솔밭스크린",
    people: "9명 참가",
    summary: "가을 시즌 컨디션을 확인한 3분기 정기전입니다.",
    images: ["images/archive-2025-09-display.jpg"]
  },
  {
    id: "2025-05-field",
    date: "2025.05.01",
    label: "상반기 필드 라운딩",
    title: "2025년 5월 필드 라운딩",
    location: "힐스카이CC",
    people: "8명 참가",
    summary: "스크린을 벗어나 실제 코스에서 팀워크를 맞춘 상반기 필드 라운딩입니다.",
    images: ["images/archive-2025-05-display.jpg"]
  },
  {
    id: "2025-02-regular",
    date: "2025.02.25",
    label: "1분기 정기 모임",
    title: "2025년 2월 정기전",
    location: "골프존파크 두왕테크노골프점",
    people: "13명 참가",
    summary: "2025년 동호회 활동의 출발점이 된 1분기 정기 모임입니다.",
    images: ["images/archive-2025-02-display.jpg"]
  }
];

const heroSlides = [
  {
    image: "images/archive-2026-04-2.png",
    date: "2026.04.10",
    caption: "4월 베이스타즈CC 필드 행사"
  },
  {
    image: "images/archive-2026-04-3.png",
    date: "2026.04.10",
    caption: "필드 라운드 코스 스냅"
  },
  {
    image: "images/archive-2026-03-1-display.jpg",
    date: "2026.03.04",
    caption: "3월 정기 스크린 라운드"
  },
  {
    image: "images/archive-2025-05-display.jpg",
    date: "2025.05.01",
    caption: "상반기 필드 라운딩"
  }
];

const nextNotice = {
  eyebrow: "New Archive",
  title: "제8회 석노협 대회 사진",
  meta: "2026.07.04 · 골프존파크 삼산한국골프점",
  body: "코오롱인더스트리 A/B팀의 경기와 시상 장면을 아카이브에 정리했습니다."
};

const messageCopy = {
  unavailable: "방명록 저장소를 연결하는 중입니다. Cloudflare Pages 배포에서 곧 글을 남길 수 있습니다.",
  emptyGuestbook: "아직 남겨진 글이 없습니다. 첫 인사를 남겨주세요.",
  emptyArchive: "이 라운드에는 아직 댓글이 없습니다.",
  loading: "글을 불러오는 중입니다.",
  saved: "글을 남겼습니다.",
  saving: "등록 중입니다."
};

const getTurnstileSiteKey = () =>
  document.querySelector('meta[name="cf-turnstile-sitekey"]')?.getAttribute("content")?.trim() || "";

const isLocalApiDevelopment = () => {
  const { hostname, port } = window.location;
  return (
    (["localhost", "127.0.0.1"].includes(hostname) && port === "8788") ||
    (hostname.endsWith(".app.github.dev") && hostname.includes("-8788."))
  );
};

const getMessageApiBase = () => {
  if (isLocalApiDevelopment()) return "/api";
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
            <strong>Kolon Golf Society</strong>
            <span>screen golf society</span>
          </a>
          <nav class="main-nav" aria-label="메인 메뉴">
            <a href="#features">동호회</a>
            <a href="#schedule">일정</a>
            <a href="#members">회원</a>
            <a href="#archive">기록</a>
            <a href="#guestbook">방명록</a>
          </nav>
          <div class="account-links">
            <button type="button" data-open-modal="rsvpModal">공지</button>
            <button type="button" data-open-modal="joinModal">가입 문의</button>
          </div>
        </div>

        <nav class="mobile-panel" id="mobileNav" aria-label="모바일 메뉴">
          <a href="#features">동호회</a>
          <a href="#schedule">일정</a>
          <a href="#members">회원</a>
          <a href="#archive">기록</a>
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
    this.innerHTML = `
      <section class="hero-band" aria-labelledby="heroTitle">
        ${svgOrnaments.heroCourse}
        <button class="hero-arrow hero-arrow-prev" type="button" data-hero-slide="prev" aria-label="이전 대표 사진">
          <span aria-hidden="true">‹</span>
        </button>
        <div class="hero-inner">
          <div class="hero-copy" data-reveal>
            <p class="section-kicker">Kolon Golf Society</p>
            <h1 id="heroTitle">코오롱 스크린<br />골프 동호회</h1>
            <p>
              정기 스크린 라운드와 필드 행사를 함께 즐기는 코오롱 골프 동호회입니다.
              좋은 샷, 아쉬운 퍼트, 라운드 뒤 웃음까지 오래 남기는 모임입니다.
            </p>
            <div class="hero-meta-strip" aria-label="동호회 주요 정보">
              <span><strong>Latest</strong>제8회 석노협 대회</span>
              <span><strong>Course</strong>용원 GC 백로·무학</span>
              <span><strong>Members</strong>21명</span>
            </div>
            <div class="button-row">
              <a class="solid-button" href="#archive">대회 사진 보기</a>
              <a class="line-button" href="#archive">행사 사진 보기</a>
            </div>
          </div>
          <figure class="hero-media" data-reveal>
            <span class="hero-photo-tag" aria-hidden="true">Club Round</span>
            <img id="heroImage" src="${heroSlides[0].image}" alt="코오롱 골프 동호회 대표 라운딩 사진" fetchpriority="high" decoding="async" />
            <figcaption>
              <span id="heroDate">${heroSlides[0].date}</span>
              <strong id="heroCaption">${heroSlides[0].caption}</strong>
            </figcaption>
            <div class="hero-course-card" aria-label="최근 주요 기록">
              <span>Featured</span>
              <strong>Hole-in-one</strong>
              <small>STARS 8번 홀 · 이동수 팀장</small>
            </div>
          </figure>
        </div>
        <button class="hero-arrow hero-arrow-next" type="button" data-hero-slide="next" aria-label="다음 대표 사진">
          <span aria-hidden="true">›</span>
        </button>
      </section>
    `;
  }
}

class KolonIntro extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <section class="intro-section site-section" aria-labelledby="introTitle">
        ${svgOrnaments.introMap}
        <div class="intro-title" data-reveal>
          <p class="section-kicker">Club Philosophy</p>
          <h2 id="introTitle">좋은 샷보다 오래 남는 것은 함께한 라운드의 온도입니다.</h2>
        </div>
        <div class="intro-copy" data-reveal>
          <p>
            코오롱 골프 동호회는 정기 라운드와 친선 경기로 함께 실력을 겨루고 친목을 쌓습니다.
            실력 차이는 있어도 편하게 합류하고, 함께한 순간은 사진과 이야기로 오래 남깁니다.
          </p>
          <a class="text-button" href="#schedule">다음 모임 보기</a>
        </div>
      </section>
    `;
  }
}

class KolonPrinciples extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <section class="principles-section site-section" aria-label="동호회 분위기">
        <article class="principle-item" data-reveal>
          <span class="principle-index">01</span>
          <span class="principle-icon" aria-hidden="true">${principleIcons.round}</span>
          <h3>정기적으로 만나는 라운드</h3>
          <p>바쁜 일상 사이에서도 다시 만날 약속을 만들며 모임을 이어갑니다.</p>
        </article>
        <article class="principle-item" data-reveal>
          <span class="principle-index">02</span>
          <span class="principle-icon" aria-hidden="true">${principleIcons.score}</span>
          <h3>부담 없이 합류하는 경기</h3>
          <p>스코어는 겨루되 분위기는 편하게, 서로 응원하며 한 라운드를 즐깁니다.</p>
        </article>
        <article class="principle-item" data-reveal>
          <span class="principle-index">03</span>
          <span class="principle-icon" aria-hidden="true">${principleIcons.memory}</span>
          <h3>사진과 기록으로 남는 모임</h3>
          <p>멋진 샷과 즐거웠던 자리를 사진과 이야기로 남겨 다음 만남을 기다립니다.</p>
        </article>
      </section>
    `;
  }
}

class KolonImageStatement extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <section class="image-statement" aria-label="동호회 활동 사진">
        <img src="images/archive-2026-04-1.png" alt="코오롱 스크린 골프 동호회 4월 필드 행사 중식 모임 사진" loading="lazy" decoding="async" />
        <div class="statement-copy" data-reveal>
          <p class="section-kicker">Round Memory</p>
          <h2>필드에서 시작한 라운드는 함께 모인 자리까지 오래 이어집니다.</h2>
          <div class="statement-badges" aria-label="4월 필드 행사 주요 기록">
            <span>2026.04.10</span>
            <span>Baystars CC</span>
            <span>Hole-in-one</span>
          </div>
        </div>
      </section>
    `;
  }
}

class KolonSchedule extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <section class="schedule-section site-section" aria-labelledby="scheduleTitle">
        <div class="section-heading split" data-reveal>
          <div>
            <p class="section-kicker">Schedule</p>
            <h2 id="scheduleTitle">Screen Event Board</h2>
          </div>
          <p>2026년 7월 4일 토요일, 제8회 석노협 의장배 스크린골프대회에 코오롱인더스트리 2개 팀이 참가했습니다.</p>
        </div>

        <div class="schedule-board" data-reveal>
          <article class="next-event">
            ${svgOrnaments.scheduleMap}
            <div class="event-date-lockup" aria-hidden="true">
              <span>JUL</span>
              <strong>04</strong>
              <small>2026</small>
            </div>
            <div class="event-content">
              <div class="event-topline">
                <p class="event-state">참가 완료</p>
                <span>Chairman Cup</span>
              </div>
              <h3>제8회 석노협 스크린골프대회 기록</h3>
              <p>울산석유화학공업단지 노동조합 협의회 주관 의장배 대회입니다. 코오롱인더스트리는 A팀과 B팀, 총 8명이 회사별 4인 1팀 방식으로 참가했습니다.</p>
            </div>
          </article>

          <div class="event-detail-panel" aria-label="제8회 석노협 스크린골프대회 상세 정보">
            <dl>
              <div>
                <dt>일시</dt>
                <dd>2026.07.04(토) 08:00</dd>
              </div>
              <div>
                <dt>장소</dt>
                <dd>골프존파크 삼산한국골프점</dd>
              </div>
              <div>
                <dt>방식</dt>
                <dd>회사별 4인 1팀 · 투비전 NX · 용원 GC 백로·무학</dd>
              </div>
              <div>
                <dt>선수</dt>
                <dd>A팀 김효준, 서무환, 정무근, 허선재 · B팀 김경수, 박동성, 윤석현, 천기준</dd>
              </div>
            </dl>
            <div class="button-row">
              <button class="solid-button" type="button" data-open-modal="rsvpModal">공지 상세 보기</button>
              <button class="line-button" type="button" data-open-modal="locationModal">장소 안내</button>
            </div>
          </div>
        </div>

        <div class="section-heading compact" data-reveal>
          <p class="section-kicker">Schedule</p>
          <h3>최근 모임 이야기</h3>
        </div>

        <div class="schedule-notes">
          <article data-reveal>
            <span>01</span>
            <h3>석노협 의장배 대회 기록</h3>
            <p>7월 4일 오전 8시, 삼산한국골프점에서 코오롱인더스트리 A/B팀이 참가했습니다.</p>
          </article>
          <article data-reveal>
            <span>02</span>
            <h3>핵심 경기 조건</h3>
            <p>투비전 NX, 용원 GC 백로·무학, 투어모드 G투어 난이도, 컨시드 1.5m와 멀리건 없음 조건으로 진행됩니다.</p>
          </article>
          <article data-reveal>
            <span>03</span>
            <h3>대회 사진 아카이브</h3>
            <p>경기 장면과 대회 후 시상·식사 사진을 아카이브에서 확인할 수 있습니다.</p>
          </article>
        </div>
      </section>
    `;
  }
}

class KolonMembers extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    const renderMemberCard = (member, index, variant = "") => {
      const animal = getMemberAnimal(index);
      return `
        <article class="member-card ${variant}" data-member-card data-reveal>
          <div class="member-card-top">
            <span>${member.role}</span>
          </div>
          <div class="member-identity">
            ${renderMemberAnimal(animal, member.name)}
            <div>
              <h3>${member.handle}</h3>
              <p><strong>${member.name}</strong> · ${member.note}</p>
            </div>
          </div>
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
        <div class="section-heading split" data-reveal>
          <div>
            <p class="section-kicker">Members</p>
            <h2 id="membersTitle">Club Members</h2>
          </div>
          <div class="member-tools">
            <label class="search-field">
              <span>회원 검색</span>
              <input id="memberSearch" type="search" placeholder="이름 또는 역할" autocomplete="off" />
            </label>
            <button class="line-button small" id="memberReset" type="button">초기화</button>
          </div>
        </div>
        <div class="staff-grid" aria-label="운영진">
          ${staffItems}
        </div>
        <div class="member-grid" id="memberGrid" aria-label="정회원">
          ${memberItems}
        </div>
      </section>
    `;
  }
}

class KolonArchive extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    const renderDetails = (archive) =>
      archive.details?.length
        ? `
            <ul class="archive-details" aria-label="${archive.title} 상세 기록">
              ${archive.details.map((detail) => `<li>${detail}</li>`).join("")}
            </ul>
          `
        : "";

    const featured = archives[0];
    const featuredBadges = featured.highlights?.length
      ? featured.highlights.map((item) => `<span>${item}</span>`).join("")
      : "";

    const archiveItems = archives
      .slice(1)
      .map((archive, index) => {
        const archiveIndex = index + 1;
        return `
          <article class="archive-card" data-reveal>
            <button class="archive-photo" type="button" data-archive-index="${archiveIndex}" aria-label="${archive.title} 사진 보기">
              <img src="${archive.images[0]}" alt="${archive.title} 대표 사진" loading="lazy" decoding="async" />
              <span>사진 보기</span>
            </button>
            <div class="archive-body">
              <p class="archive-meta">${archive.date} · ${archive.label}</p>
              <h3>${archive.title}</h3>
              <p>${archive.summary}</p>
              ${renderDetails(archive)}
              <div class="archive-foot">
                <span>${archive.location}</span>
                <span>${archive.people}</span>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    this.innerHTML = `
      <section class="archive-section" aria-labelledby="archiveTitle">
        ${svgOrnaments.archiveMap}
        <div class="site-section">
          <div class="section-heading centered" data-reveal>
            <p class="section-kicker">Archive</p>
            <h2 id="archiveTitle">지난 라운드 이야기</h2>
            <p>함께 웃고 겨뤘던 라운드의 순간들을 모았습니다.</p>
          </div>
          <article class="featured-round" data-reveal>
            <button class="featured-photo" type="button" data-archive-index="0" aria-label="${featured.title} 사진 보기">
              <img src="${featured.images[0]}" alt="${featured.title} 대표 사진" loading="lazy" decoding="async" />
              <span>대표 라운드 보기</span>
            </button>
            <div class="featured-body">
              <p class="archive-meta">${featured.date} · ${featured.label}</p>
              <h3>${featured.title}</h3>
              <p>${featured.summary}</p>
              <div class="featured-badges" aria-label="${featured.title} 주요 기록">
                ${featuredBadges}
              </div>
              ${renderDetails(featured)}
              <div class="archive-foot">
                <span>${featured.location}</span>
                <span>${featured.people}</span>
              </div>
            </div>
          </article>
          <div class="archive-grid">
            ${archiveItems}
          </div>
        </div>
      </section>
    `;
  }
}

class KolonGuestbook extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <section class="guestbook-section site-section" aria-labelledby="guestbookTitle">
        <div class="section-heading split" data-reveal>
          <div>
            <p class="section-kicker">Guestbook</p>
            <h2 id="guestbookTitle">방명록</h2>
          </div>
          <p>함께한 라운드의 한마디, 다음 모임을 기다리는 마음을 편하게 남겨주세요.</p>
        </div>
        <div class="guestbook-board" data-reveal>
          <div class="guestbook-form-card">
            ${messageFormTemplate("guestbook", "오늘의 한마디를 남겨주세요.", "글 남기기")}
          </div>
          <div class="guestbook-list-card">
            <div class="message-list-head">
              <h3>최근 방명록</h3>
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
      <section class="join-section site-section" aria-labelledby="joinTitle" data-reveal>
        ${svgOrnaments.joinFlag}
        <p class="section-kicker">Join Us</p>
        <h2 id="joinTitle">함께 스윙하고, 기록하고, 다음 라운드를 기다립니다.</h2>
        <p>정기 라운드와 친선 매치를 함께할 코오롱 골프 동호회 멤버를 기다립니다.</p>
        <div class="button-row center">
          <button class="solid-button" type="button" data-open-modal="joinModal">가입 문의</button>
          <a class="line-button" href="#top">맨 위로</a>
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
      <div class="modal" id="rsvpModal" aria-hidden="true">
        <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="rsvpTitle">
          <div class="modal-head">
            <div>
              <p class="section-kicker">Tournament</p>
              <h3 id="rsvpTitle">제8회 석노협 스크린골프대회 기록</h3>
            </div>
            <button class="line-button small" type="button" data-close-modal>닫기</button>
          </div>
          <div class="modal-body">
            <p>일시: 2026년 7월 4일(토) 08:00</p>
            <p>장소: 골프존파크 삼산한국골프점</p>
            <p>방식: 회사별 4인 1팀 · 투비전 NX · 용원 GC 백로·무학</p>
            <p>A팀(301호): 김효준, 서무환, 정무근, 허선재</p>
            <p>B팀(302호): 김경수, 박동성, 윤석현, 천기준</p>
            <p>주요 설정: 투어모드/G투어 난이도, 블루 티, 컨시드 1.5m, 멀리건 없음, 매트룰 적용</p>
            <p>퍼팅 가이드와 퍼팅 방향키는 사용할 수 없는 조건으로 진행되었습니다.</p>
          </div>
        </div>
      </div>

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

      <div class="modal" id="locationModal" aria-hidden="true">
        <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="locationTitle">
          <div class="modal-head">
            <div>
              <p class="section-kicker">Location</p>
              <h3 id="locationTitle">석노협 대회 장소 안내</h3>
            </div>
            <button class="line-button small" type="button" data-close-modal>닫기</button>
          </div>
          <div class="modal-body">
            <p>장소: 골프존파크 삼산한국골프점</p>
            <p>일시: 2026년 7월 4일(토) 08:00</p>
            <p>참가: 코오롱인더스트리 A팀(301호), B팀(302호)</p>
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
            <img id="lightboxImage" src="" alt="동호회 아카이브 사진" />
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
    this.innerHTML = `
      <section class="bottom-notice" data-bottom-notice role="region" aria-labelledby="bottomNoticeTitle" aria-live="polite">
        <span class="notice-mark" aria-hidden="true"></span>
        <div class="notice-copy">
          <p>${nextNotice.eyebrow}</p>
          <h2 id="bottomNoticeTitle">${nextNotice.title}</h2>
          <span>${nextNotice.meta}</span>
          <small>${nextNotice.body}</small>
        </div>
        <div class="notice-actions">
          <label class="notice-check">
            <input type="checkbox" data-notice-snooze />
            <span>오늘 하루 숨기기</span>
          </label>
          <button class="line-button small" type="button" data-archive-index="0">사진 보기</button>
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
          <a class="brand footer-brand" href="#top">
            <span class="brand-mark" aria-hidden="true"></span>
            <strong>Kolon Golf Society</strong>
          </a>
          <nav aria-label="푸터 메뉴">
            <a href="#features">동호회</a>
            <a href="#schedule">일정</a>
            <a href="#members">회원</a>
            <a href="#archive">기록</a>
            <a href="#guestbook">방명록</a>
            <button type="button" data-open-modal="joinModal">가입 문의</button>
          </nav>
          <address>
            ${contactAddressHtml()}
          </address>
        </div>
      </footer>
    `;
  }
}

defineElement("kolon-site-header", KolonSiteHeader);
defineElement("kolon-hero", KolonHero);
defineElement("kolon-intro", KolonIntro);
defineElement("kolon-principles", KolonPrinciples);
defineElement("kolon-image-statement", KolonImageStatement);
defineElement("kolon-schedule", KolonSchedule);
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
  const sections = ["features", "schedule", "members", "archive", "guestbook"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const closeMenu = () => {
    header?.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
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
    header?.classList.toggle("menu-open", nextState);
  });

  mobilePanel?.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement || target instanceof HTMLButtonElement) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
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
  const cards = Array.from(document.querySelectorAll("[data-member-card]"));

  const applyFilter = () => {
    const query = input?.value.trim().toLowerCase() || "";
    cards.forEach((card) => {
      const isMatch = card.textContent.toLowerCase().includes(query);
      card.classList.toggle("is-hidden", !isMatch);
    });
  };

  input?.addEventListener("input", applyFilter);
  reset?.addEventListener("click", () => {
    if (!input) return;
    input.value = "";
    applyFilter();
    input.focus();
  });
};

const initHeroSlider = () => {
  const image = document.getElementById("heroImage");
  const date = document.getElementById("heroDate");
  const caption = document.getElementById("heroCaption");
  const controls = document.querySelectorAll("[data-hero-slide]");
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  let index = 0;
  let timer = null;

  const render = (nextIndex) => {
    index = (nextIndex + heroSlides.length) % heroSlides.length;
    const slide = heroSlides[index];
    if (image) {
      if (prefersReducedMotion) {
        image.src = slide.image;
      } else {
        image.classList.add("is-switching");
        window.setTimeout(() => {
          image.src = slide.image;
          window.requestAnimationFrame(() => image.classList.remove("is-switching"));
        }, 120);
      }
    }
    if (date) date.textContent = slide.date;
    if (caption) caption.textContent = slide.caption;
  };

  const restart = () => {
    if (prefersReducedMotion) return;
    window.clearInterval(timer);
    timer = window.setInterval(() => render(index + 1), 6400);
  };

  controls.forEach((control) => {
    control.addEventListener("click", () => {
      render(control.getAttribute("data-hero-slide") === "next" ? index + 1 : index - 1);
      restart();
    });
  });

  restart();
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

  const open = (archiveIndex) => {
    currentArchive = archives[archiveIndex];
    if (!currentArchive || !lightbox) return;
    currentGallery = currentArchive.images;
    thumbs.innerHTML = "";
    currentGallery.forEach((src, thumbIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lightbox-thumb";
      button.style.backgroundImage = `url("${src}")`;
      button.setAttribute("aria-label", `${thumbIndex + 1}번째 사진 보기`);
      button.addEventListener("click", () => render(thumbIndex));
      thumbs.append(button);
    });

    render(0);
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
    open(Number(trigger.getAttribute("data-archive-index")));
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
    if (!list) return;
    showListMessage(list, messageCopy.loading);
    try {
      const data = await requestJson(messageUrl(type, archiveId));
      renderList(list, data.items || []);
    } catch (error) {
      showListMessage(list, error.message || messageCopy.unavailable, true);
    }
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
    if (!siteKey) return;
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
      submitButton?.setAttribute("disabled", "true");
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
        submitButton?.removeAttribute("disabled");
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
  loadList(getListFor("guestbook"), "guestbook");
};

const initMemberExperienceEnhancements = () => {
  const apiBase = () =>
    (typeof getMessageApiBase === "function"
      ? getMessageApiBase()
      : document.querySelector('meta[name="message-api-base"]')?.content || "/api").replace(/\/$/, "");

  const makeLink = (href, text, className, action) => {
    const link = document.createElement("a");
    link.href = href;
    link.className = className;
    link.textContent = text;
    link.dataset.memberAction = action;
    return link;
  };

  const heroButtons = document.querySelector(".hero-copy .button-row");
  if (heroButtons && !heroButtons.querySelector('[data-member-action="guestbook"]')) {
    heroButtons.append(makeLink("#guestbook", "방명록 남기기", "line-button", "guestbook"));
  }

  const heroCopy = document.querySelector(".hero-copy");
  const heroMeta = document.querySelector(".hero-meta-strip");
  if (heroCopy && heroMeta && !heroCopy.querySelector(".member-quick-panel")) {
    heroMeta.insertAdjacentHTML(
      "afterend",
      `<nav class="member-quick-panel" aria-label="회원 빠른 이동">
        <a href="#schedule"><strong>다음 모임</strong><span>언제 어디서 만나는지</span></a>
        <a href="#archive"><strong>지난 사진</strong><span>함께한 순간 다시 보기</span></a>
        <a href="#guestbook"><strong>한마디</strong><span>오늘의 인사 남기기</span></a>
      </nav>`
    );
  }

  document.querySelectorAll(".search-link").forEach((link) => {
    link.setAttribute("href", "#archive");
    link.setAttribute("aria-label", "지난 라운드와 사진 보기");
    link.setAttribute("title", "지난 라운드 보기");
  });

  const scheduleSection = document.getElementById("schedule");
  if (scheduleSection && !scheduleSection.querySelector(".next-round-brief")) {
    scheduleSection.insertAdjacentHTML(
      "afterbegin",
      `<aside class="next-round-brief" data-reveal>
        <p class="section-kicker">7월 대회 기록</p>
        <h3>제8회 석노협 스크린골프대회 사진을 확인하세요.</h3>
        <ul>
          <li><strong>언제</strong><span>2026년 7월 4일(토) 08:00</span></li>
          <li><strong>어디서</strong><span>골프존파크 삼산한국골프점</span></li>
          <li><strong>참가</strong><span>코오롱인더스트리 A/B팀, 총 8명</span></li>
        </ul>
      </aside>`
    );
  }

  const archiveSection = document.getElementById("archive");
  if (archiveSection && !archiveSection.querySelector(".archive-invite-panel")) {
    archiveSection.insertAdjacentHTML(
      "afterbegin",
      `<aside class="archive-invite-panel" data-reveal>
        <div>
          <p class="section-kicker">지난 라운드</p>
          <h3>함께했던 사진과 그날의 이야기를 둘러보세요.</h3>
        </div>
        <a class="line-button small" href="#archive">사진과 댓글 보기</a>
      </aside>`
    );
  }

  const decorateArchiveCards = () => {
    document.querySelectorAll("[data-archive-index]").forEach((trigger) => {
      const index = Number(trigger.getAttribute("data-archive-index"));
      const archive = Array.isArray(archives) ? archives[index] : null;
      const card = trigger.closest(".archive-card") || trigger.closest(".featured-round");
      const target = card?.classList.contains("featured-round") ? card.querySelector(".featured-body") : card;
      if (!archive || !target || target.querySelector(".archive-card-actions")) return;
      target.insertAdjacentHTML(
        "beforeend",
        `<div class="archive-card-actions" data-archive-actions="${archive.id}">
          <span class="archive-card-chip">사진 ${archive.images?.length || 1}장</span>
          <span class="archive-card-chip" data-comment-count>댓글 확인 중</span>
          <button class="archive-card-comment" type="button" data-archive-index="${index}">댓글 남기기</button>
        </div>`
      );
    });
  };

  const loadArchiveCommentCounts = async () => {
    if (!Array.isArray(archives)) return;
    const targets = Array.from(document.querySelectorAll("[data-archive-actions]"));
    await Promise.all(targets.map(async (target) => {
      const archiveId = target.getAttribute("data-archive-actions");
      const countNode = target.querySelector("[data-comment-count]");
      if (!archiveId || !countNode) return;
      try {
        const url = `${apiBase()}/messages?type=archive_comment&archiveId=${encodeURIComponent(archiveId)}`;
        const response = await fetch(url, { headers: { "Accept": "application/json" } });
        const data = await response.json();
        const count = Array.isArray(data.items) ? data.items.length : 0;
        countNode.textContent = count ? `댓글 ${count}개` : "첫 댓글 기다리는 중";
      } catch {
        countNode.textContent = "댓글 준비 중";
      }
    }));
  };

  decorateArchiveCards();
  loadArchiveCommentCounts();



  document.querySelectorAll("img").forEach((image) => {
    const syncRatio = () => {
      if (!image.naturalWidth || !image.naturalHeight) return;
      image.classList.toggle("is-portrait-photo", image.naturalHeight > image.naturalWidth * 1.08);
    };
    if (image.complete) syncRatio();
    image.addEventListener("load", syncRatio, { once: true });
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

  const compressImage = (file) => new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("이미지 파일만 올릴 수 있습니다."));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      reject(new Error("사진 원본은 8MB 이하만 올릴 수 있습니다."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("사진을 읽지 못했습니다."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("사진을 처리하지 못했습니다."));
      image.onload = () => {
        const maxSize = 1400;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        context.fillStyle = "#f8f4e8";
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        let dataUrl = canvas.toDataURL("image/jpeg", 0.76);
        if (dataUrl.length > 360000) dataUrl = canvas.toDataURL("image/jpeg", 0.62);
        if (dataUrl.length > 380000) {
          reject(new Error("압축 후에도 사진이 큽니다. 더 작은 사진을 선택해주세요."));
          return;
        }
        resolve({ dataUrl, alt: file.name.replace(/\.[^.]+$/, "") });
      };
      image.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });

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

  const loadPublicArchives = async () => {
    const list = document.querySelector("[data-public-archive-list]");
    if (!list) return;
    list.innerHTML = `<p class="message-empty">회원 업로드를 불러오는 중입니다.</p>`;
    try {
      const response = await fetch(`${apiBase()}?limit=12`, { headers: { "Accept": "application/json" } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "회원 업로드를 불러오지 못했습니다.");
      renderPublicArchives(list, data.items || []);
    } catch (error) {
      list.innerHTML = `<p class="message-empty is-error">${escapeText(error.message || "회원 업로드를 불러오지 못했습니다.")}</p>`;
    }
  };

  if (archiveRoot && !archiveRoot.querySelector("[data-archive-upload-section]")) {
    archiveRoot.insertAdjacentHTML(
      "beforeend",
      `<section class="community-archive-section site-section" data-archive-upload-section>
        <div class="section-heading split" data-reveal>
          <div>
            <p class="section-kicker">회원 업로드</p>
            <h2>함께한 사진을 직접 올려주세요.</h2>
          </div>
          <p>올린 사진과 기록은 관리자 확인 후 아카이브에 공개됩니다.</p>
        </div>
        <div class="community-archive-board">
          <form class="community-archive-form" data-archive-upload-form>
            <div class="form-grid two">
              <label><span>작성자</span><input name="authorName" maxlength="24" placeholder="이름 또는 별명" required /></label>
              <label><span>날짜</span><input name="date" type="date" required /></label>
            </div>
            <label><span>제목</span><input name="title" maxlength="80" placeholder="예: 5월 정기전" required /></label>
            <div class="form-grid two">
              <label><span>장소</span><input name="location" maxlength="80" placeholder="예: 울산골프존" required /></label>
              <label><span>참석 인원</span><input name="people" maxlength="40" placeholder="예: 8명 참가" /></label>
            </div>
            <label><span>한 줄 기록</span><textarea name="summary" maxlength="500" placeholder="그날의 분위기나 기억에 남는 장면을 적어주세요." required></textarea></label>
            <label><span>사진</span><input name="images" type="file" accept="image/*" multiple required /><small>최대 4장, 업로드 전 자동으로 작게 압축됩니다.</small></label>
            <div class="message-form-actions">
              <button class="solid-button" type="submit">아카이브 신청하기</button>
              <p class="message-status" data-archive-upload-status>승인 후 홈페이지에 표시됩니다.</p>
            </div>
          </form>
          <div class="community-archive-list-card">
            <div class="message-list-head">
              <div><p class="section-kicker">공개된 회원 업로드</p><h3>새로 올라온 기록</h3></div>
              <button class="line-button small" type="button" data-public-archive-refresh>새로고침</button>
            </div>
            <div class="archive-grid community-archive-grid" data-public-archive-list></div>
          </div>
        </div>
      </section>`
    );
  }

  const uploadForm = document.querySelector("[data-archive-upload-form]");
  const uploadStatus = document.querySelector("[data-archive-upload-status]");
  uploadForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(uploadForm);
    const files = Array.from(uploadForm.querySelector("input[type='file']")?.files || []).slice(0, 4);
    const button = uploadForm.querySelector("button[type='submit']");
    if (!files.length) {
      setText(uploadStatus, "사진을 1장 이상 올려주세요.", true);
      return;
    }
    button?.setAttribute("disabled", "true");
    setText(uploadStatus, "사진을 압축하고 저장하는 중입니다.");
    try {
      const images = await Promise.all(files.map(compressImage));
      const payload = {
        authorName: String(formData.get("authorName") || ""),
        date: String(formData.get("date") || ""),
        title: String(formData.get("title") || ""),
        location: String(formData.get("location") || ""),
        people: String(formData.get("people") || ""),
        summary: String(formData.get("summary") || ""),
        images
      };
      const response = await fetch(apiBase(), {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "아카이브 신청을 저장하지 못했습니다.");
      uploadForm.reset();
      setText(uploadStatus, "신청이 접수됐습니다. 관리자 확인 후 공개됩니다.");
    } catch (error) {
      setText(uploadStatus, error.message || "아카이브 신청을 저장하지 못했습니다.", true);
    } finally {
      button?.removeAttribute("disabled");
    }
  });

  document.querySelector("[data-public-archive-refresh]")?.addEventListener("click", loadPublicArchives);
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
  initModals();
  initLightbox();
  initMessages();
  initMessageAdmin();
  initArchiveUploadsAndAdmin();
  initMemberExperienceEnhancements();
  initBottomNotice();
};

initPage();
