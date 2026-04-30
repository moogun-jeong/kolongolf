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

const memberAnimals = [
  ["hawk", "매"],
  ["fox", "여우"],
  ["bear", "곰"],
  ["wolf", "늑대"],
  ["deer", "사슴"],
  ["turtle", "거북"],
  ["rabbit", "토끼"],
  ["penguin", "펭귄"],
  ["horse", "말"],
  ["dolphin", "돌고래"],
  ["owl", "부엉이"],
  ["tiger", "호랑이"],
  ["seal", "물범"],
  ["panda", "판다"],
  ["crane", "두루미"],
  ["shark", "상어"],
  ["lion", "사자"],
  ["whale", "고래"]
];

const memberAnimalSprite = `
  <svg class="member-animal-sprite" aria-hidden="true" focusable="false">
    <defs>
      <symbol id="animal-hawk" viewBox="0 0 32 32"><path d="M3 18l9-7 4 5 4-5 9 7-9 6h-8z"/><path d="M13 18h6"/></symbol>
      <symbol id="animal-fox" viewBox="0 0 32 32"><path d="M5 9l7 4 4-5 4 5 7-4-4 16H9z"/><path d="M12 20h8"/></symbol>
      <symbol id="animal-bear" viewBox="0 0 32 32"><circle cx="10" cy="10" r="4"/><circle cx="22" cy="10" r="4"/><path d="M8 15c1-5 15-5 16 0v5c0 5-16 5-16 0z"/></symbol>
      <symbol id="animal-wolf" viewBox="0 0 32 32"><path d="M6 7l7 5 3-6 3 6 7-5-4 18H10z"/><path d="M12 17l4 4 4-4"/></symbol>
      <symbol id="animal-deer" viewBox="0 0 32 32"><path d="M12 11L8 6M20 11l4-5M10 8H6m16 0h4M10 14c0-6 12-6 12 0v5c0 6-12 6-12 0z"/></symbol>
      <symbol id="animal-turtle" viewBox="0 0 32 32"><path d="M6 20c0-8 20-8 20 0 0 6-20 6-20 0z"/><path d="M26 19h4M2 19h4m4-5v12m12-12v12"/></symbol>
      <symbol id="animal-rabbit" viewBox="0 0 32 32"><path d="M12 15C5 5 9 2 15 12M20 15c7-10 3-13-3-3"/><path d="M9 17c0-6 14-6 14 0v5c0 5-14 5-14 0z"/></symbol>
      <symbol id="animal-penguin" viewBox="0 0 32 32"><path d="M10 16c0-10 12-10 12 0v6c0 7-12 7-12 0z"/><path d="M10 20l-5 4m17-4l5 4M14 25h4"/></symbol>
      <symbol id="animal-horse" viewBox="0 0 32 32"><path d="M9 25V9l7-4 7 7-3 13"/><path d="M11 13h10m-6 12v-7"/></symbol>
      <symbol id="animal-dolphin" viewBox="0 0 32 32"><path d="M4 21c8-10 17-11 24-4l-5 1 3 5c-8-4-15 1-22-2z"/><path d="M15 13l-2-5"/></symbol>
      <symbol id="animal-owl" viewBox="0 0 32 32"><path d="M8 11l4-5 4 5 4-5 4 5v9c0 7-16 7-16 0z"/><circle cx="13" cy="16" r="2"/><circle cx="19" cy="16" r="2"/></symbol>
      <symbol id="animal-tiger" viewBox="0 0 32 32"><path d="M6 8l6 4 4-4 4 4 6-4-3 17H9z"/><path d="M12 13l-2 4m10-4l2 4m-6-3v5"/></symbol>
      <symbol id="animal-seal" viewBox="0 0 32 32"><path d="M5 21c3-9 19-9 22 0-6 6-16 6-22 0z"/><path d="M10 23l-5 4m17-4l5 4"/></symbol>
      <symbol id="animal-panda" viewBox="0 0 32 32"><circle cx="10" cy="10" r="4"/><circle cx="22" cy="10" r="4"/><path d="M8 15c0-7 16-7 16 0v5c0 6-16 6-16 0z"/><path d="M13 18h6"/></symbol>
      <symbol id="animal-crane" viewBox="0 0 32 32"><path d="M8 24c4-13 11-13 16-3"/><path d="M16 21V7l7 5M16 7l-5 4m5 10l-3 6m3-6l4 6"/></symbol>
      <symbol id="animal-shark" viewBox="0 0 32 32"><path d="M3 18c8-7 18-7 26 0-8 5-18 5-26 0z"/><path d="M16 13l-3-6m11 11l5-4M10 21l-4 5"/></symbol>
      <symbol id="animal-lion" viewBox="0 0 32 32"><path d="M16 5l4 4 6 1-1 6 3 5-6 2-3 5-3-4-3 4-3-5-6-2 3-5-1-6 6-1z"/><circle cx="16" cy="17" r="5"/></symbol>
      <symbol id="animal-whale" viewBox="0 0 32 32"><path d="M4 19c4-7 17-9 24-1l-4 6H10z"/><path d="M25 16l3-6m0 0l2 5m-18 9l-3 4h9l-3-4"/></symbol>
    </defs>
  </svg>
`;

const getMemberAnimal = (index) => {
  const [id, label] = memberAnimals[index % memberAnimals.length];
  return { id, label };
};

const renderMemberAnimal = (animal) => `
  <svg class="member-animal" viewBox="0 0 32 32" role="img" aria-label="${animal.label} 아이콘" focusable="false">
    <use href="#animal-${animal.id}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></use>
  </svg>
`;

const archives = [
  {
    date: "2026.04.10",
    label: "필드 행사",
    title: "2026년 4월 베이스타즈CC 필드 행사",
    location: "베이스타즈CC",
    people: "12명 참가",
    summary: "조별 티오프 후 라운딩을 진행하고 명촌 중식 장소에 모여 마무리한 4월 필드 행사 기록입니다.",
    details: [
      "티오프: 07:20 BAY, 07:55 BAY, 08:09 STARS",
      "운영: 그린피·캐디피 개인 부담, 카트비 동호회 지원",
      "시상: 니어리스트(STARS 5H), 다버디상, 각 조 1위"
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
    summary: "새 시즌의 흐름을 만든 3월 정기전. 수상 기록과 단체 사진을 함께 보관했습니다.",
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
    summary: "가을 시즌 컨디션을 확인한 3분기 정기전 기록입니다.",
    images: ["images/archive-2025-09.webp"]
  },
  {
    date: "2025.05.01",
    label: "상반기 필드 라운딩",
    title: "2025년 5월 필드 라운딩",
    location: "힐스카이CC",
    people: "8명 참가",
    summary: "스크린을 벗어나 실제 코스에서 팀워크를 맞춘 상반기 필드 기록입니다.",
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
    caption: "필드 라운드 코스 기록"
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
  eyebrow: "Next Notice",
  title: "2분기 말 스크린 행사 준비 중",
  meta: "일시·장소·참가 방식은 추후 공지",
  body: "세부 일정이 확정되면 회장/총무 공지와 함께 홈페이지 일정도 업데이트합니다."
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
          <a class="brand compact" href="#top" aria-label="홈으로 이동">kolongolf</a>
          <a class="icon-button search-link" href="#members" aria-label="회원 검색"></a>
        </div>

        <div class="desktop-bar">
          <a class="brand" href="#top" aria-label="홈으로 이동">
            <strong>kolongolf</strong>
            <span>screen golf society</span>
          </a>
          <nav class="main-nav" aria-label="메인 메뉴">
            <a href="#features">About</a>
            <a href="#schedule">Schedule</a>
            <a href="#members">Members</a>
            <a href="#archive">Archive</a>
          </nav>
          <div class="account-links">
            <button type="button" data-open-modal="rsvpModal">Notice</button>
            <button type="button" data-open-modal="joinModal">Join</button>
          </div>
        </div>

        <nav class="mobile-panel" id="mobileNav" aria-label="모바일 메뉴">
          <a href="#features">About</a>
          <a href="#schedule">Schedule</a>
          <a href="#members">Members</a>
          <a href="#archive">Archive</a>
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
            <p class="section-kicker">Kolon Screen Golf</p>
            <h1 id="heroTitle">함께 치고,<br />함께 기록하는<br />스크린 골프 모임</h1>
            <p>
              코오롱 스크린 골프 동호회는 함께 라운드하고 기록을 나누는 사내 골프 모임입니다.
              정기 일정, 멤버 소식, 지난 모임의 사진과 이야기를 한 곳에 모아 공유합니다.
            </p>
            <div class="hero-meta-strip" aria-label="동호회 주요 정보">
              <span><strong>Next</strong>2분기 말</span>
              <span><strong>Archive</strong>라운드 기록</span>
              <span><strong>Members</strong>18명</span>
            </div>
            <a class="text-button" href="#features">About us</a>
          </div>
          <figure class="hero-media" data-reveal>
            <span class="hero-photo-tag" aria-hidden="true">CLUB PHOTO</span>
            <img id="heroImage" src="${heroSlides[0].image}" alt="코오롱 스크린 골프 동호회 대표 사진" fetchpriority="high" />
            <figcaption>
              <span id="heroDate">${heroSlides[0].date}</span>
              <strong id="heroCaption">${heroSlides[0].caption}</strong>
            </figcaption>
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
          <p class="section-kicker">Club Note</p>
          <h2 id="introTitle">좋은 샷보다 오래 남는 것은 같이 친 시간입니다.</h2>
        </div>
        <div class="intro-copy" data-reveal>
          <p>
            정기전은 분기 단위로 운영하고, 장소와 경기 방식은 확정 즉시 공유합니다.
            스크린 라운드는 부담 없이 참여하되 기록은 깔끔하게 남겨 다음 모임의 기준점으로 사용합니다.
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
          <span class="principle-icon icon-calendar" aria-hidden="true"></span>
          <h3>일정은 명확하게</h3>
          <p>장소, 시간, 모집 상태를 한 화면에서 확인할 수 있도록 정리합니다.</p>
        </article>
        <article class="principle-item" data-reveal>
          <span class="principle-icon icon-members" aria-hidden="true"></span>
          <h3>멤버는 가볍게 찾기</h3>
          <p>닉네임과 역할을 기준으로 빠르게 검색하고 모임 구성을 확인합니다.</p>
        </article>
        <article class="principle-item" data-reveal>
          <span class="principle-icon icon-heart" aria-hidden="true"></span>
          <h3>기록은 오래 남기기</h3>
          <p>라운드 사진, 참가자, 장소를 카드형 아카이브로 보관합니다.</p>
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
          <h2>필드에서 시작한 라운드는 함께 모인 자리까지 기록으로 남습니다.</h2>
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
        <div class="section-heading centered" data-reveal>
          <p class="section-kicker">Schedule</p>
          <h2 id="scheduleTitle">다가오는 모임</h2>
          <p>4월 필드 행사는 기록으로 보관했고, 다음 모임은 2분기 말 스크린 행사로 준비합니다.</p>
        </div>

        <div class="schedule-grid">
          <article class="next-event" data-reveal>
            <div class="event-topline">
              <p class="event-state">상세 추후 공지</p>
              <span>Q2 Screen</span>
            </div>
            <h3>2026년 2분기 말 스크린 행사</h3>
            <div class="event-date-lockup" aria-hidden="true">
              <span>Q2</span>
              <strong>Late</strong>
            </div>
            <dl>
              <div>
                <dt>일시</dt>
                <dd>2026년 2분기 말 예정</dd>
              </div>
              <div>
                <dt>장소</dt>
                <dd>추후 공지</dd>
              </div>
              <div>
                <dt>방식</dt>
                <dd>스크린 라운드 예정</dd>
              </div>
              <div>
                <dt>안내</dt>
                <dd>자세한 내용은 추후 공지</dd>
              </div>
            </dl>
            <div class="button-row">
              <button class="solid-button" type="button" data-open-modal="rsvpModal">공지 확인</button>
              <a class="line-button" href="#archive">4월 기록 보기</a>
            </div>
          </article>

          <div class="schedule-notes">
            <article data-reveal>
              <span>01</span>
              <h3>4월 필드 행사 기록 완료</h3>
              <p>베이스타즈CC 라운딩과 중식 모임 사진을 아카이브에 반영했습니다.</p>
            </article>
            <article data-reveal>
              <span>02</span>
              <h3>2분기 말 스크린 행사 준비</h3>
              <p>다음 일정은 스크린 라운드로 진행할 예정이며 세부 정보는 준비 중입니다.</p>
            </article>
            <article data-reveal>
              <span>03</span>
              <h3>상세 공지 대기</h3>
              <p>일시, 장소, 참가 방식이 확정되면 운영진 공지 후 홈페이지에 업데이트합니다.</p>
            </article>
          </div>
        </div>
      </section>
    `;
  }
}

class KolonMembers extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    const memberItems = members
      .map(
        (member, index) => {
          const animal = getMemberAnimal(index);
          return `
          <article class="member-card" data-member-card data-reveal>
            <div class="member-card-top">
              <span>${member.role}</span>
              ${renderMemberAnimal(animal)}
            </div>
            <h3>${member.handle}</h3>
            <p><strong>${member.name}</strong> · ${member.note}</p>
          </article>
        `;
        }
      )
      .join("");

    this.innerHTML = `
      <section class="members-section site-section" aria-labelledby="membersTitle">
        <div class="section-heading split" data-reveal>
          <div>
            <p class="section-kicker">Members</p>
            <h2 id="membersTitle">회원명부</h2>
          </div>
          <div class="member-tools">
            <label class="search-field">
              <span>회원 검색</span>
              <input id="memberSearch" type="search" placeholder="이름 또는 역할" autocomplete="off" />
            </label>
            <button class="line-button small" id="memberReset" type="button">초기화</button>
          </div>
        </div>
        ${memberAnimalSprite}
        <div class="member-grid" id="memberGrid">
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
    const archiveItems = archives
      .map((archive, index) => {
        const details = archive.details?.length
          ? `
              <ul class="archive-details" aria-label="${archive.title} 상세 기록">
                ${archive.details.map((detail) => `<li>${detail}</li>`).join("")}
              </ul>
            `
          : "";

        return `
          <article class="archive-card" data-reveal>
            <button class="archive-photo" type="button" data-archive-index="${index}" aria-label="${archive.title} 사진 보기">
              <img src="${archive.images[0]}" alt="${archive.title} 대표 사진" loading="lazy" />
            </button>
            <div class="archive-body">
              <p class="archive-meta">${archive.date} · ${archive.label}</p>
              <h3>${archive.title}</h3>
              <p>${archive.summary}</p>
              ${details}
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
            <h2 id="archiveTitle">지난 라운드 기록</h2>
            <p>사진을 선택하면 해당 모임의 기록 이미지를 크게 볼 수 있습니다.</p>
          </div>
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
        <h2 id="joinTitle">함께 스윙하고, 기록하고, 다음 모임을 기다립니다.</h2>
        <p>정기 라운드와 친선 매치를 함께할 동호회 멤버를 기다립니다.</p>
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
            <p>장소: 추후 공지</p>
            <p>방식: 스크린 라운드 예정</p>
            <p>자세한 일정과 참가 방식은 운영진 공지 후 업데이트합니다.</p>
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
            <p>정기 라운드, 기록 공유, 친선 매치를 함께합니다.</p>
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
            <p>장소: 추후 공지</p>
            <p>주소: 장소 확정 후 업데이트</p>
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
              <p id="lightboxCaption">기록 이미지</p>
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
          <a class="brand footer-brand" href="#top">kolongolf</a>
          <nav aria-label="푸터 메뉴">
            <a href="#features">About</a>
            <a href="#schedule">Schedule</a>
            <a href="#members">Members</a>
            <a href="#archive">Archive</a>
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

  const closeMenu = () => {
    header?.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
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
    if (image) image.src = slide.image;
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
