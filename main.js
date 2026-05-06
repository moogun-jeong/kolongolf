const members = [
  { handle: "덕충안길", name: "권순노", role: "정회원", note: "페이드 장인" },
  { handle: "살려줘제바알", name: "김경수", role: "정회원", note: "벙커 탈출 1위" },
  { handle: "오!건2", name: "김무건", role: "회장", note: "경기 운영" },
  { handle: "인생무생", name: "김무생", role: "정회원", note: "후반 집중력" },
  { handle: "울산땡주", name: "김영주", role: "정회원", note: "파3 스페셜" },
  { handle: "원조가가멜", name: "김정훈", role: "정회원", note: "백스핀 컨트롤" },
  { handle: "백돌이깬다", name: "김태연", role: "정회원", note: "정확한 어프로치" },
  { handle: "준빵", name: "김효준", role: "정회원", note: "스윙 템포" },
  { handle: "빽스윙쫌만더", name: "서무환", role: "정회원", note: "장타 본능" },
  { handle: "날아라호", name: "심재호", role: "정회원", note: "탄도 조절" },
  { handle: "오상택", name: "오상택", role: "정회원", note: "코스 매니지먼트" },
  { handle: "필드난폭자", name: "윤석현", role: "정회원", note: "공격적 플레이" },
  { handle: "타키온", name: "이동수", role: "정회원", note: "퍼팅 스트로크" },
  { handle: "무근정", name: "정무근", role: "총무", note: "운영 관리" },
  { handle: "울산정쁘로", name: "정성원", role: "정회원", note: "아이언 정밀도" },
  { handle: "원펀쓰리강냉", name: "천기준", role: "정회원", note: "파워 스윙" },
  { handle: "무적부대", name: "추정술", role: "정회원", note: "위기 탈출" },
  { handle: "장금이에이스", name: "하선재", role: "정회원", note: "정교한 퍼터" }
];

const memberMarks = [
  ["flag", "플래그"],
  ["score", "스코어카드"],
  ["tee", "티"],
  ["cup", "홀컵"],
  ["green", "그린"],
  ["ball", "골프공"]
];

const memberMarkSprite = `
  <svg class="member-mark-sprite" aria-hidden="true" focusable="false">
    <defs>
      <symbol id="mark-flag" viewBox="0 0 32 32"><path d="M10 27V5"/><path d="M10 6h14l-3 5 3 5H10"/><path d="M6 27h10"/></symbol>
      <symbol id="mark-score" viewBox="0 0 32 32"><path d="M9 5h14v22H9z"/><path d="M13 11h6M13 16h6M13 21h4"/></symbol>
      <symbol id="mark-tee" viewBox="0 0 32 32"><path d="M11 10h10"/><path d="M16 10v16"/><path d="M10 26h12"/></symbol>
      <symbol id="mark-cup" viewBox="0 0 32 32"><path d="M8 12c0 8 16 8 16 0"/><path d="M8 12h16M16 17v9M11 26h10"/></symbol>
      <symbol id="mark-green" viewBox="0 0 32 32"><path d="M5 22c6-7 16-7 22 0"/><path d="M16 22V7"/><path d="M16 7h8l-2 4 2 4h-8"/></symbol>
      <symbol id="mark-ball" viewBox="0 0 32 32"><circle cx="16" cy="16" r="9"/><path d="M12 12h.01M16 11h.01M20 13h.01M13 17h.01M18 18h.01M15 22h.01"/></symbol>
    </defs>
  </svg>
`;

const getMemberMark = (index) => {
  const [id, label] = memberMarks[index % memberMarks.length];
  return { id, label };
};

const renderMemberMark = (mark) => `
  <svg class="member-mark" viewBox="0 0 32 32" role="img" aria-label="${mark.label} 아이콘" focusable="false">
    <use href="#mark-${mark.id}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></use>
  </svg>
`;

const archives = [
  {
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
    date: "2026.03.04",
    label: "정기 스크린 라운드",
    title: "2026년 3월 정기전",
    location: "울산골프존",
    people: "10명 참가",
    summary: "새 시즌의 흐름을 만든 3월 정기전입니다. 수상 순간과 단체 사진을 함께 담았습니다.",
    images: [
      "images/archive-2026-03-1.jpeg",
      "images/archive-2026-03-2.jpeg",
      "images/archive-2026-03-3.jpeg",
      "images/archive-2026-03-4.jpeg"
    ]
  },
  {
    date: "2025.12.09",
    label: "송년회",
    title: "2025년 12월 송년 라운드",
    location: "삼산동 울산골프존",
    people: "9명 참가",
    summary: "한 해의 마지막 스코어와 시상 순간을 남긴 송년 모임입니다.",
    images: ["images/archive-2025-12.webp"]
  },
  {
    date: "2025.09.30",
    label: "3분기 정기전",
    title: "2025년 9월 정기전",
    location: "골프존파크 선암 솔밭스크린",
    people: "9명 참가",
    summary: "가을 시즌 컨디션을 확인한 3분기 정기전입니다.",
    images: ["images/archive-2025-09.webp"]
  },
  {
    date: "2025.05.01",
    label: "상반기 필드 라운딩",
    title: "2025년 5월 필드 라운딩",
    location: "힐스카이CC",
    people: "8명 참가",
    summary: "스크린을 벗어나 실제 코스에서 팀워크를 맞춘 상반기 필드 라운딩입니다.",
    images: ["images/archive-2025-05.webp"]
  },
  {
    date: "2025.02.25",
    label: "1분기 정기 모임",
    title: "2025년 2월 정기전",
    location: "골프존파크 두왕테크노골프점",
    people: "13명 참가",
    summary: "2025년 동호회 활동의 출발점이 된 1분기 정기 모임입니다.",
    images: ["images/archive-2025-02.webp"]
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
    image: "images/archive-2026-03-1.jpeg",
    date: "2026.03.04",
    caption: "3월 정기 스크린 라운드"
  },
  {
    image: "images/archive-2025-05.webp",
    date: "2025.05.01",
    caption: "상반기 필드 라운딩"
  }
];

const nextNotice = {
  eyebrow: "Next Round",
  title: "2분기 말 스크린 행사 예정",
  meta: "확정 대기 · 운영진 공지 예정",
  body: "세부 일정이 확정되면 회장/총무 안내와 함께 홈페이지 일정에서도 알려드리겠습니다."
};

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
            <span>premium screen golf club</span>
          </a>
          <nav class="main-nav" aria-label="메인 메뉴">
            <a href="#features">Club</a>
            <a href="#schedule">Schedule</a>
            <a href="#members">Members</a>
            <a href="#archive">Rounds</a>
          </nav>
          <div class="account-links">
            <button type="button" data-open-modal="rsvpModal">Notice</button>
            <button type="button" data-open-modal="joinModal">Join</button>
          </div>
        </div>

        <nav class="mobile-panel" id="mobileNav" aria-label="모바일 메뉴">
          <a href="#features">Club</a>
          <a href="#schedule">Schedule</a>
          <a href="#members">Members</a>
          <a href="#archive">Rounds</a>
          <button type="button" data-open-modal="joinModal">Join</button>
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
        <button class="hero-arrow hero-arrow-prev" type="button" data-hero-slide="prev" aria-label="이전 대표 사진">
          <span aria-hidden="true">‹</span>
        </button>
        <div class="hero-inner">
          <div class="hero-copy" data-reveal>
            <p class="section-kicker">Kolon Golf Society</p>
            <h1 id="heroTitle">함께 걷는 페어웨이,<br />함께 만드는<br />라운딩의 품격</h1>
            <p>
              매월 정기 라운딩과 스크린 모임을 함께하는 코오롱 골프 동호회입니다.
              일정, 회원, 지난 라운드의 사진과 기록을 한 곳에서 확인합니다.
            </p>
            <div class="hero-meta-strip" aria-label="동호회 주요 정보">
              <span><strong>Next Round</strong>2분기 말 예정</span>
              <span><strong>Latest Record</strong>베이스타즈CC</span>
              <span><strong>Members</strong>18명</span>
            </div>
            <div class="button-row">
              <a class="solid-button" href="#schedule">월례회 일정 보기</a>
              <a class="line-button" href="#archive">지난 라운드 보기</a>
            </div>
          </div>
          <figure class="hero-media" data-reveal>
            <span class="hero-photo-tag" aria-hidden="true">Club Round</span>
            <img id="heroImage" src="${heroSlides[0].image}" alt="코오롱 골프 동호회 대표 라운딩 사진" fetchpriority="high" />
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
        <div class="intro-title" data-reveal>
          <p class="section-kicker">Club Philosophy</p>
          <h2 id="introTitle">좋은 샷보다 오래 남는 것은 함께한 라운드의 온도입니다.</h2>
        </div>
        <div class="intro-copy" data-reveal>
          <p>
            코오롱 골프 동호회는 정기 일정, 친선 경기, 필드 라운딩 기록을 차분하게 공유합니다.
            누구나 부담 없이 합류하고, 함께한 순간은 사진과 기록으로 오래 남깁니다.
          </p>
          <a class="text-button" href="#schedule">다가오는 일정 보기</a>
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
      <section class="principles-section site-section" aria-label="동호회 핵심 운영 방식">
        <article class="principle-item" data-reveal>
          <span class="principle-index">01</span>
          <span class="principle-icon icon-calendar" aria-hidden="true"></span>
          <h3>정기적으로 만나는 라운드</h3>
          <p>다음 모임의 상태와 운영 안내를 한눈에 확인할 수 있게 정리합니다.</p>
        </article>
        <article class="principle-item" data-reveal>
          <span class="principle-index">02</span>
          <span class="principle-icon icon-members" aria-hidden="true"></span>
          <h3>부담 없이 합류하는 경기</h3>
          <p>회원명부와 운영진 정보를 간결하게 보여주어 모임 흐름을 쉽게 파악합니다.</p>
        </article>
        <article class="principle-item" data-reveal>
          <span class="principle-index">03</span>
          <span class="principle-icon icon-heart" aria-hidden="true"></span>
          <h3>사진과 기록으로 남는 모임</h3>
          <p>라운딩 사진, 장소, 수상 기록을 모임별 이야기로 보관합니다.</p>
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
        <img src="images/archive-2026-04-1.png" alt="코오롱 스크린 골프 동호회 4월 필드 행사 중식 모임 사진" loading="lazy" />
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
            <h2 id="scheduleTitle">Next Round Board</h2>
          </div>
          <p>다가오는 스크린 행사와 지난 필드 기록을 한 화면에서 확인합니다.</p>
        </div>

        <div class="schedule-board" data-reveal>
          <article class="next-event">
            <div class="event-date-lockup" aria-hidden="true">
              <span>Q2</span>
              <strong>Late</strong>
              <small>2026</small>
            </div>
            <div class="event-content">
              <div class="event-topline">
                <p class="event-state">확정 대기</p>
                <span>Screen Round</span>
              </div>
              <h3>2026년 2분기 말 스크린 행사</h3>
              <p>세부 일정과 장소가 확정되면 회장/총무 안내와 함께 홈페이지 일정에서도 바로 확인할 수 있습니다.</p>
            </div>
          </article>

          <div class="event-detail-panel" aria-label="다음 일정 상세 정보">
            <dl>
              <div>
                <dt>일시</dt>
                <dd>2026년 2분기 말 예정</dd>
              </div>
              <div>
                <dt>장소</dt>
                <dd>운영진 공지 예정</dd>
              </div>
              <div>
                <dt>방식</dt>
                <dd>스크린 라운드</dd>
              </div>
              <div>
                <dt>상태</dt>
                <dd>참가 방식 확정 대기</dd>
              </div>
            </dl>
            <div class="button-row">
              <button class="solid-button" type="button" data-open-modal="rsvpModal">공지 확인</button>
              <a class="line-button" href="#archive">4월 행사 보기</a>
            </div>
          </div>
        </div>

        <div class="section-heading compact" data-reveal>
          <p class="section-kicker">Schedule</p>
          <h3>최근 운영 흐름</h3>
        </div>

        <div class="schedule-notes">
          <article data-reveal>
            <span>01</span>
            <h3>4월 베이스타즈CC 필드 행사</h3>
            <p>라운딩부터 이동수 팀장님의 홀인원, 공동 1위 시상, 중식 모임까지 함께한 자리였습니다.</p>
          </article>
          <article data-reveal>
            <span>02</span>
            <h3>2분기 말 스크린 행사 예정</h3>
            <p>다음 일정은 스크린 라운드로 진행할 예정이며 세부 정보는 준비 중입니다.</p>
          </article>
          <article data-reveal>
            <span>03</span>
            <h3>운영진 상세 안내 예정</h3>
            <p>일시, 장소, 참가 방식이 확정되면 운영진 안내와 홈페이지 일정에 함께 공지합니다.</p>
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
      const mark = getMemberMark(index);
      return `
        <article class="member-card ${variant}" data-member-card data-reveal>
          <div class="member-card-top">
            <span>${member.role}</span>
            ${renderMemberMark(mark)}
          </div>
          <h3>${member.handle}</h3>
          <p><strong>${member.name}</strong> · ${member.note}</p>
        </article>
      `;
    };

    const staffMembers = members.filter((member) => member.role !== "정회원");
    const regularMembers = members.filter((member) => member.role === "정회원");

    const staffItems = staffMembers
      .map((member, index) => renderMemberCard(member, index, "staff-card"))
      .join("");

    const memberItems = regularMembers
      .map(
        (member, index) => {
          return renderMemberCard(member, index + staffMembers.length);
        }
      )
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
        ${memberMarkSprite}
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
              <img src="${archive.images[0]}" alt="${archive.title} 대표 사진" loading="lazy" />
              <span>View photos</span>
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
        <div class="site-section">
          <div class="section-heading centered" data-reveal>
            <p class="section-kicker">Archive</p>
            <h2 id="archiveTitle">지난 라운드 이야기</h2>
            <p>주요 라운드 기록은 크게, 나머지 모임은 카드형 아카이브로 이어집니다.</p>
          </div>
          <article class="featured-round" data-reveal>
            <button class="featured-photo" type="button" data-archive-index="0" aria-label="${featured.title} 사진 보기">
              <img src="${featured.images[0]}" alt="${featured.title} 대표 사진" loading="lazy" />
              <span>View featured round</span>
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

class KolonJoin extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    this.innerHTML = `
      <section class="join-section site-section" aria-labelledby="joinTitle" data-reveal>
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
              <p class="section-kicker">Next Screen Event</p>
              <h3 id="rsvpTitle">2분기 말 스크린 행사 안내</h3>
            </div>
            <button class="line-button small" type="button" data-close-modal>닫기</button>
          </div>
          <div class="modal-body">
            <p>일시: 2026년 2분기 말 예정</p>
            <p>장소: 운영진 공지 예정</p>
            <p>방식: 스크린 라운드</p>
            <p>자세한 일정과 참가 방식은 운영진 안내와 함께 홈페이지에서도 알려드리겠습니다.</p>
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
            <p>회장: 김무건 · gun77@kolon.com</p>
            <p>총무: 정무근 · moogunjeong@kolon.com</p>
          </div>
        </div>
      </div>

      <div class="modal" id="locationModal" aria-hidden="true">
        <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="locationTitle">
          <div class="modal-head">
            <div>
              <p class="section-kicker">Location</p>
              <h3 id="locationTitle">다음 일정 장소 안내</h3>
            </div>
            <button class="line-button small" type="button" data-close-modal>닫기</button>
          </div>
          <div class="modal-body">
            <p>장소: 운영진 공지 예정</p>
            <p>주소: 장소 확정 후 안내</p>
            <p>일시: 2026년 2분기 말 예정</p>
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
            <span>일주일간 열지 않기</span>
          </label>
          <button class="line-button small" type="button" data-open-modal="rsvpModal">상세 보기</button>
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
            <a href="#features">Club</a>
            <a href="#schedule">Schedule</a>
            <a href="#members">Members</a>
            <a href="#archive">Rounds</a>
            <button type="button" data-open-modal="joinModal">Join</button>
          </nav>
          <address>
            회장 김무건 · gun77@kolon.com<br />
            총무 정무근 · moogunjeong@kolon.com
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
  const sections = ["features", "schedule", "members", "archive"]
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

const initBottomNotice = () => {
  const notice = document.querySelector("[data-bottom-notice]");
  if (!notice) return;

  const storageKey = "kolongolf:bottom-notice:hidden-until";
  const week = 7 * 24 * 60 * 60 * 1000;
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
      window.localStorage.setItem(storageKey, String(Date.now() + week));
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
  initBottomNotice();
};

initPage();
