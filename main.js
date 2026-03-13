document.documentElement.classList.add("js");

const clubData = {
  seasonLabel: "2026 시즌",
  nextRound: {
    title: "2026년 2분기 정기 스크린 라운드",
    status: "일정 조율 중",
    date: "",
    scheduleLabel: "2026년 2분기 일정 조율 중",
    venue: "울산권 스크린장 후보 검토 중",
    lead:
      "장소 후보와 시간대를 먼저 정리한 뒤 정기 라운드 일정을 확정할 예정입니다. 일정이 잡히면 참석 회신과 조 편성 안내까지 이어서 공유합니다.",
    note:
      "공지 확인 후 참석 여부를 먼저 남겨 주세요. 라운드가 끝나면 사진, 참석 닉네임, 간단한 메모를 기록에 반영합니다.",
    facts: [
      { label: "진행 시기", value: "2026년 2분기" },
      { label: "후보 지역", value: "울산 남구 중심" },
      { label: "참여 방식", value: "공지 후 참석 의사 취합" },
      { label: "기록 정리", value: "당일 사진·참석·후기 정리" }
    ],
    steps: [
      {
        title: "장소 후보 정리",
        detail: "접근성과 타석 환경, 퇴근 후 합류 편의성을 기준으로 후보를 압축합니다.",
        status: "active"
      },
      {
        title: "일정 확정 후 참석 오픈",
        detail: "회장/총무 공지와 함께 참석 의사를 받고, 조 편성 기준을 바로 정리합니다.",
        status: "pending"
      },
      {
        title: "라운드 후 기록 업로드",
        detail: "대표 사진, 참석 닉네임, 한 줄 후기를 같은 날 아카이브에 반영합니다.",
        status: "pending"
      }
    ],
    participationRules: [
      {
        title: "공지 확인 후 빠른 회신",
        detail: "참석 여부를 빠르게 모아야 시간대와 조 편성을 안정적으로 맞출 수 있습니다."
      },
      {
        title: "시작 10분 전 도착",
        detail: "스크린 셋업과 경기 흐름을 맞추기 위한 기본 루틴입니다."
      },
      {
        title: "라운드 후 사진 또는 한 줄 후기",
        detail: "기록 관리가 쌓여야 동호회 아카이브가 살아납니다."
      }
    ],
    notes: [
      {
        title: "운영 상태",
        detail: "현재는 장소 후보 정리 단계이며, 날짜는 후보가 좁혀진 뒤 확정합니다."
      },
      {
        title: "의견 수집 포인트",
        detail: "선호 시간대, 퇴근 후 이동 편의성, 다시 가고 싶은 스크린장 의견을 받고 있습니다."
      },
      {
        title: "기록 업데이트 기준",
        detail: "행사가 끝나면 대표 사진, 참석 닉네임, 간단한 메모를 같은 흐름에서 업데이트합니다."
      }
    ],
    talkTopics: ["장소 추천", "선호 시간대", "베스트샷 회고", "다음 친선 매치"]
  },
  guideCards: [
    {
      kicker: "동호회",
      title: "분기별 정기 라운드를 기본으로 모입니다",
      body:
        "스크린 정기전과 친목 라운드를 이어가며 꾸준히 만나는 사내 동호회입니다.",
      accent: true
    },
    {
      kicker: "참여 방식",
      title: "공지 확인 후 참석 의사만 남기면 됩니다",
      body:
        "일정이 확정되면 참석 회신을 받고, 조 편성과 장소 안내를 이어서 공유합니다."
    },
    {
      kicker: "기록 문화",
      title: "사진과 참석 닉네임을 함께 남깁니다",
      body:
        "지난 모임 사진, 참석 닉네임, 한 줄 메모를 보관해 다음 만남까지 흐름을 이어갑니다."
    },
    {
      kicker: "모임 분위기",
      title: "편하게 합류하고 자연스럽게 친해지는 분위기",
      body:
        "좋은 샷엔 반응하고 장소 추천과 후기 공유가 자연스럽게 오가는 동호회입니다."
    }
  ],
  contacts: [
    {
      title: "가입 문의",
      body: "가입을 원하면 운영진 메일로 간단히 문의해 주세요.",
      tags: ["신규 문의", "사내 동호회"],
      email: "gun77@kolon.com",
      href: "mailto:gun77@kolon.com?subject=%EC%BD%94%EC%98%A4%EB%A1%B1%20%EC%8A%A4%ED%81%AC%EB%A6%B0%20%EA%B3%A8%ED%94%84%20%EA%B0%80%EC%9E%85%20%EB%AC%B8%EC%9D%98"
    },
    {
      title: "운영 제안",
      body: "장소 후보, 시간대 선호, 운영 의견은 총무 메일로 전달해 주세요.",
      tags: ["장소 제안", "운영 의견"],
      email: "moogunjeong@kolon.com",
      href: "mailto:moogunjeong@kolon.com?subject=%EC%BD%94%EC%98%A4%EB%A1%B1%20%EC%8A%A4%ED%81%AC%EB%A6%B0%20%EA%B3%A8%ED%94%84%20%EC%9A%B4%EC%98%81%20%EC%A0%9C%EC%95%88"
    },
    {
      title: "사진/기록 전달",
      body: "행사 후 대표 사진이나 남기고 싶은 한 줄 후기가 있으면 총무에게 보내 주세요.",
      tags: ["사진 업로드", "기록 전달"],
      email: "moogunjeong@kolon.com",
      href: "mailto:moogunjeong@kolon.com?subject=%EC%BD%94%EC%98%A4%EB%A1%B1%20%EC%8A%A4%ED%81%AC%EB%A6%B0%20%EA%B3%A8%ED%94%84%20%EA%B8%B0%EB%A1%9D%20%EC%A0%84%EB%8B%AC"
    }
  ],
  members: [
    { nickname: "오!건2", role: "회장", style: "경기 운영", note: "정기전 흐름을 매끄럽게 잡는 운영 중심 멤버입니다." },
    { nickname: "무근정", role: "총무", style: "운영 관리", note: "일정 정리와 기록 업데이트를 꾸준히 챙기는 운영 멤버입니다." },
    { nickname: "덕충안길", role: "정회원", style: "페이드 장인", note: "구질 컨트롤이 안정적이라 흐름을 잃지 않는 타입입니다." },
    { nickname: "살려줘제바알", role: "정회원", style: "벙커 탈출 1위", note: "위기 상황에서 분위기를 살리는 플레이가 강점입니다." },
    { nickname: "인생무생", role: "정회원", style: "후반 집중력", note: "후반부에 템포를 올리는 꾸준한 플레이가 돋보입니다." },
    { nickname: "울산땡주", role: "정회원", style: "파3 스페셜", note: "짧은 홀에서 감각을 발휘하는 타입입니다." },
    { nickname: "원조가가멜", role: "정회원", style: "백스핀 컨트롤", note: "볼 컨트롤과 감각적인 샷 메이킹이 장점입니다." },
    { nickname: "백돌이깬다", role: "정회원", style: "정확한 어프로치", note: "세밀한 접근 플레이로 안정감을 더합니다." },
    { nickname: "준빵", role: "정회원", style: "스윙 템포", note: "균형 잡힌 템포와 꾸준한 참석률이 인상적입니다." },
    { nickname: "빽스윙쫌만더", role: "정회원", style: "장타 본능", note: "과감한 스윙으로 라운드 분위기를 끌어올립니다." },
    { nickname: "날아라호", role: "정회원", style: "탄도 조절", note: "상황에 맞게 탄도 변화를 주는 컨트롤형입니다." },
    { nickname: "택버디", role: "정회원", style: "코스 매니지먼트", note: "플랜을 세워 차분하게 공략하는 스타일입니다." },
    { nickname: "필드난폭자", role: "정회원", style: "공격적 플레이", note: "승부처에서 과감하게 밀어붙이는 타입입니다." },
    { nickname: "타키온", role: "정회원", style: "퍼팅 스트로크", note: "그린 주변과 마무리 감각이 좋은 멤버입니다." },
    { nickname: "울산정쁘로", role: "정회원", style: "아이언 정밀도", note: "중거리 공략의 정교함이 강점입니다." },
    { nickname: "원펀쓰리강냉", role: "정회원", style: "파워 스윙", note: "임팩트가 강하고 존재감이 확실한 스윙 타입입니다." },
    { nickname: "무적부대", role: "정회원", style: "위기 탈출", note: "어려운 상황에서도 흐름을 살리는 회복력이 좋습니다." },
    { nickname: "장금이에이스", role: "정회원", style: "정교한 퍼터", note: "마무리 단계에서 안정감을 더하는 멤버입니다." }
  ],
  archive: [
    {
      id: "round-2026-03",
      date: "2026-03-04",
      type: "정기전",
      title: "2026년 3월 정기 스크린 라운드",
      venue: "울산골프존",
      address: "울산 남구 화합로 108",
      summary:
        "10명이 함께한 3월 정기 스크린 라운드입니다. 대표 사진과 참석 닉네임을 남기고 다음 모임 이야기도 함께 나눈 자리였습니다.",
      notes: [
        "대표 사진 4장 업로드",
        "참석 닉네임 기록 정리 완료",
        "다음 라운드 장소 의견 수집 시작"
      ],
      tags: ["스크린", "정기전", "기록 완료"],
      attendees: ["무근정", "덕충안길", "살려줘제바알", "오!건2", "원조가가멜", "준빵", "날아라호", "타키온", "원펀쓰리강냉", "장금이에이스"],
      photos: [
        { src: "images/archive-2026-03-1.webp", thumb: "images/archive-2026-03-1.jpeg", caption: "2026.03 정기 스크린 라운드 대표 사진 1" },
        { src: "images/archive-2026-03-2.webp", thumb: "images/archive-2026-03-2.jpeg", caption: "2026.03 정기 스크린 라운드 대표 사진 2" },
        { src: "images/archive-2026-03-3.webp", thumb: "images/archive-2026-03-3.jpeg", caption: "2026.03 정기 스크린 라운드 대표 사진 3" },
        { src: "images/archive-2026-03-4.webp", thumb: "images/archive-2026-03-4.jpeg", caption: "2026.03 정기 스크린 라운드 대표 사진 4" }
      ]
    },
    {
      id: "round-2025-12",
      date: "2025-12-09",
      type: "친목",
      title: "2025년 12월 송년 라운드",
      venue: "삼산동 울산골프존",
      address: "울산 남구 화합로 108",
      summary:
        "연말 분위기 속에서 친목과 라운드를 함께한 송년 모임입니다. 참석 닉네임과 사진을 함께 남겼습니다.",
      notes: [
        "연말 친목 중심 모임",
        "참석 닉네임 기록 보관",
        "송년회 성격의 라운드"
      ],
      tags: ["송년회", "친목", "스크린"],
      attendees: ["살려줘제바알", "준빵", "무근정", "허니완", "OB게스트", "빽스윙쫌만더", "오!건2", "무적부대", "장금이에이스"],
      photos: [{ src: "images/archive-2025-12.webp", thumb: "images/archive-2025-12.webp", caption: "2025.12 송년회 · 삼산동 울산골프존" }]
    },
    {
      id: "round-2025-09",
      date: "2025-09-30",
      type: "정기전",
      title: "2025년 9월 3분기 정기전",
      venue: "골프존파크 선암 솔밭스크린",
      address: "울산 남구 두왕로92번길 11-5",
      summary:
        "선암 솔밭스크린에서 9명이 함께한 3분기 정기전 기록입니다. 분기별 정기 라운드 흐름이 이어졌던 모임입니다.",
      notes: [
        "3분기 정기전 진행",
        "정기전 참석 기록 보관",
        "분기 단위 운영 흐름 유지"
      ],
      tags: ["스크린", "정기전", "3분기"],
      attendees: ["원조가가멜", "타키온", "빽스윙쫌만더", "오!건2", "준빵", "날아라호", "무적부대", "장금이에이스", "무근정"],
      photos: [{ src: "images/archive-2025-09.webp", thumb: "images/archive-2025-09.webp", caption: "2025.09 3분기 정기전 · 선암 솔밭스크린" }]
    },
    {
      id: "round-2025-05",
      date: "2025-05-01",
      type: "필드",
      title: "2025년 5월 상반기 필드 라운딩",
      venue: "힐스카이CC",
      address: "구 루나엑스",
      summary:
        "상반기 필드 라운딩 기록입니다. 8명이 함께했고, 스크린에서 이어진 인연이 필드까지 연결된 자리였습니다.",
      notes: [
        "상반기 필드 라운딩",
        "필드 행사 기록 보관",
        "참석 닉네임 정리 완료"
      ],
      tags: ["필드", "상반기", "라운딩"],
      attendees: ["오!건2", "인생무생", "무근정", "원펀쓰리강냉", "원조가가멜", "준빵", "필드난폭자", "타키온"],
      photos: [{ src: "images/archive-2025-05.webp", thumb: "images/archive-2025-05.webp", caption: "2025.05 상반기 필드 라운딩 · 힐스카이CC" }]
    },
    {
      id: "round-2025-02",
      date: "2025-02-25",
      type: "정기전",
      title: "2025년 2월 1분기 정기 모임",
      venue: "골프존파크 두왕테크노골프점",
      address: "울산 남구 테크노산업로 78-11, 2층",
      summary:
        "1분기 정기 모임으로 시즌의 출발을 만든 행사입니다. 참석 인원이 많았고 한 해 라운드 분위기를 여는 자리였습니다.",
      notes: [
        "시즌 스타트 성격의 정기 모임",
        "참석자 다수 기록",
        "분기 운영 기준점 역할"
      ],
      tags: ["스크린", "정기전", "1분기"],
      attendees: ["준빵", "날아라호", "타키온", "장금이에이스", "살려줘제바알", "울산땡주", "무근정", "오!건2", "인생무생", "허니완", "원조가가멜", "빽스윙쫌만더", "버디헌터", "필드난폭자"],
      photos: [{ src: "images/archive-2025-02.webp", thumb: "images/archive-2025-02.webp", caption: "2025.02 1분기 정기 모임 · 두왕테크노골프점" }]
    }
  ]
};

const state = {
  archiveYear: "all",
  archiveType: "all",
  archiveQuery: "",
  memberQuery: "",
  galleryPhotos: [],
  galleryIndex: 0,
  lastFocusedByDialog: new Map()
};

const elements = {
  scrollProgress: document.getElementById("scrollProgress"),
  seasonBadge: document.getElementById("seasonBadge"),
  headlineMetrics: document.getElementById("headlineMetrics"),
  nextRoundStatus: document.getElementById("nextRoundStatus"),
  nextRoundDday: document.getElementById("nextRoundDday"),
  nextRoundTitle: document.getElementById("nextRoundTitle"),
  nextRoundLead: document.getElementById("nextRoundLead"),
  nextRoundFacts: document.getElementById("nextRoundFacts"),
  nextRoundSteps: document.getElementById("nextRoundSteps"),
  nextRoundNote: document.getElementById("nextRoundNote"),
  boardPanel: document.getElementById("boardPanel"),
  latestRoundPanel: document.getElementById("latestRoundPanel"),
  noticePanel: document.getElementById("noticePanel"),
  archiveSearch: document.getElementById("archiveSearch"),
  yearFilters: document.getElementById("yearFilters"),
  typeFilters: document.getElementById("typeFilters"),
  recordSummary: document.getElementById("recordSummary"),
  archiveResultMeta: document.getElementById("archiveResultMeta"),
  archiveGrid: document.getElementById("archiveGrid"),
  memberSearch: document.getElementById("memberSearch"),
  memberSummary: document.getElementById("memberSummary"),
  memberResultMeta: document.getElementById("memberResultMeta"),
  memberGrid: document.getElementById("memberGrid"),
  guideGrid: document.getElementById("guideGrid"),
  contactGrid: document.getElementById("contactGrid"),
  footerMeta: document.getElementById("footerMeta"),
  headerShell: document.querySelector(".header-shell"),
  mainNav: document.getElementById("mainNav"),
  navToggle: document.getElementById("navToggle"),
  noticeDialog: document.getElementById("noticeDialog"),
  noticeDialogBody: document.getElementById("noticeDialogBody"),
  detailDialog: document.getElementById("detailDialog"),
  detailDialogTitle: document.getElementById("detailDialogTitle"),
  detailDialogBody: document.getElementById("detailDialogBody"),
  lightboxDialog: document.getElementById("lightboxDialog"),
  lightboxTitle: document.getElementById("lightboxTitle"),
  lightboxCaption: document.getElementById("lightboxCaption"),
  lightboxImage: document.getElementById("lightboxImage"),
  lightboxStrip: document.getElementById("lightboxStrip"),
  lightboxPrev: document.getElementById("lightboxPrev"),
  lightboxNext: document.getElementById("lightboxNext"),
  navLinks: Array.from(document.querySelectorAll(".main-nav a"))
};

const roleOrder = { 회장: 0, 총무: 1, 정회원: 2 };
const weekdayNames = ["일", "월", "화", "수", "목", "금", "토"];
const archiveById = new Map(clubData.archive.map((event) => [event.id, event]));

let revealObserver;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function parseLocalDate(dateString) {
  return new Date(`${dateString}T00:00:00`);
}

function formatDate(dateString) {
  const date = parseLocalDate(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = weekdayNames[date.getDay()] ?? "";
  return `${year}.${month}.${day} (${weekday})`;
}

function formatDateShort(dateString) {
  const date = parseLocalDate(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function getDdayLabel(dateString) {
  if (!dateString) return "일정 조율 중";
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = parseLocalDate(dateString);
  const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays === 0) return "D-DAY";
  return `D+${Math.abs(diffDays)}`;
}

function getRoleLabel(role) {
  return role === "회장" || role === "총무" ? "운영" : "정회원";
}

function getArchiveStats(events = clubData.archive) {
  const totalAttendance = events.reduce((sum, event) => sum + event.attendees.length, 0);
  const totalPhotos = events.reduce((sum, event) => sum + event.photos.length, 0);
  const latest = events[0];
  return {
    eventCount: events.length,
    totalAttendance,
    totalPhotos,
    latestDate: latest ? formatDateShort(latest.date) : "-"
  };
}

function getMemberActivity() {
  const activity = new Map(
    clubData.members.map((member) => [member.nickname, { count: 0, lastAttended: null }])
  );

  clubData.archive.forEach((event) => {
    event.attendees.forEach((nickname) => {
      const entry = activity.get(nickname);
      if (!entry) return;
      entry.count += 1;
      if (!entry.lastAttended) entry.lastAttended = event.date;
    });
  });

  return clubData.members
    .map((member) => ({
      ...member,
      count: activity.get(member.nickname)?.count ?? 0,
      lastAttended: activity.get(member.nickname)?.lastAttended ?? ""
    }))
    .sort((left, right) => {
      const roleGap = (roleOrder[left.role] ?? 99) - (roleOrder[right.role] ?? 99);
      if (roleGap !== 0) return roleGap;
      if (right.count !== left.count) return right.count - left.count;
      return left.nickname.localeCompare(right.nickname, "ko");
    });
}

function getTopParticipants(limit = 3) {
  return getMemberActivity()
    .filter((member) => member.count > 0)
    .slice(0, limit);
}

function renderHeadlineMetrics() {
  const stats = getArchiveStats();
  const latest = clubData.archive[0];
  const metrics = [
    { label: "활동 멤버", value: `${clubData.members.length}명` },
    { label: "보관 라운드", value: `${stats.eventCount}회` },
    { label: "누적 참석", value: `${stats.totalAttendance}건` },
    { label: "최근 기록", value: latest ? formatDateShort(latest.date) : "-" }
  ];

  elements.headlineMetrics.innerHTML = metrics
    .map(
      (item) => `
        <div class="metric-card">
          <dt>${escapeHtml(item.label)}</dt>
          <dd>${escapeHtml(item.value)}</dd>
        </div>
      `
    )
    .join("");
}

function renderHeroBoard() {
  const nextRound = clubData.nextRound;
  elements.seasonBadge.textContent = clubData.seasonLabel;
  elements.nextRoundStatus.textContent = nextRound.status;
  elements.nextRoundDday.textContent = getDdayLabel(nextRound.date);
  elements.nextRoundTitle.textContent = nextRound.title;
  elements.nextRoundLead.textContent = nextRound.lead;
  elements.nextRoundNote.textContent = nextRound.note;

  elements.nextRoundFacts.innerHTML = nextRound.facts
    .map(
      (item) => `
        <div class="fact-card">
          <dt>${escapeHtml(item.label)}</dt>
          <dd>${escapeHtml(item.value)}</dd>
        </div>
      `
    )
    .join("");

  elements.nextRoundSteps.innerHTML = nextRound.steps
    .map(
      (step, index) => `
        <div class="step-item" data-status="${escapeHtml(step.status)}">
          <span class="step-index">${String(index + 1).padStart(2, "0")}</span>
          <div class="step-copy">
            <strong>${escapeHtml(step.title)}</strong>
            <p>${escapeHtml(step.detail)}</p>
          </div>
        </div>
      `
    )
    .join("");
}

function renderBoardPanel() {
  const nextRound = clubData.nextRound;
  elements.boardPanel.innerHTML = `
    <p class="panel-label">준비 순서</p>
    <h3>다음 모임은 아래 흐름으로 안내합니다.</h3>
    <div class="ops-flow">
      ${nextRound.steps
        .map(
          (step) => `
            <div class="ops-flow-item">
              <strong>${escapeHtml(step.title)}</strong>
              <p>${escapeHtml(step.detail)}</p>
            </div>
          `
        )
        .join("")}
    </div>
    <p class="rule-header">참여 안내</p>
    <div class="rule-list">
      ${nextRound.participationRules
        .map(
          (rule) => `
            <div class="rule-item">
              <strong>${escapeHtml(rule.title)}</strong>
              <p>${escapeHtml(rule.detail)}</p>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderLatestRoundPanel() {
  const latest = clubData.archive[0];
  if (!latest) return;

  const firstPhoto = latest.photos[0];
  elements.latestRoundPanel.innerHTML = `
    <div class="recap-card">
      <div>
        <p class="panel-label">최근 기록</p>
        <h3>${escapeHtml(latest.title)}</h3>
      </div>
      <button
        class="recap-media"
        type="button"
        data-gallery-event="${escapeHtml(latest.id)}"
        data-gallery-index="0"
        aria-label="${escapeHtml(latest.title)} 대표 사진 보기"
      >
        <img src="${escapeHtml(firstPhoto.thumb || firstPhoto.src)}" alt="${escapeHtml(firstPhoto.caption)}" loading="lazy" />
      </button>
      <div class="recap-meta">
        <p>${escapeHtml(formatDate(latest.date))} · ${escapeHtml(latest.venue)}</p>
        <p>${escapeHtml(latest.summary)}</p>
        <div class="tag-row">
          <span class="tag">${latest.attendees.length}명 참석</span>
          <span class="tag alt">사진 ${latest.photos.length}장</span>
          <span class="tag">${escapeHtml(latest.type)}</span>
        </div>
      </div>
      <div class="archive-actions">
        <button class="inline-link" type="button" data-event-detail="${escapeHtml(latest.id)}">상세 기록 보기</button>
        <button class="inline-link" type="button" data-gallery-event="${escapeHtml(latest.id)}" data-gallery-index="0">사진 전체 보기</button>
      </div>
    </div>
  `;
}

function renderNoticePanel() {
  const topParticipants = getTopParticipants(4);
  elements.noticePanel.innerHTML = `
    <p class="panel-label">운영 메모</p>
    <h3>다음 모임 전에 참고할 메모입니다.</h3>
    <div class="note-list">
      ${clubData.nextRound.notes
        .map(
          (note) => `
            <div class="note-item">
              <strong>${escapeHtml(note.title)}</strong>
              <p>${escapeHtml(note.detail)}</p>
            </div>
          `
        )
        .join("")}
    </div>
    <p class="topic-header">같이 이야기할 주제</p>
    <div class="topic-chips">
      ${clubData.nextRound.talkTopics.map((topic) => `<span class="chip">${escapeHtml(topic)}</span>`).join("")}
    </div>
    <div class="mini-stats">
      ${topParticipants
        .map(
          (member) => `
            <div class="mini-stat">
              <dt>최근 활동 상위</dt>
              <dd>${escapeHtml(member.nickname)} · ${member.count}회</dd>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function getVisibleArchive() {
  const query = state.archiveQuery.trim().toLowerCase();
  return clubData.archive.filter((event) => {
    const yearMatch = state.archiveYear === "all" || event.date.startsWith(state.archiveYear);
    const typeMatch = state.archiveType === "all" || event.type === state.archiveType;
    if (!query) return yearMatch && typeMatch;

    const haystack = [
      event.title,
      event.venue,
      event.address,
      event.summary,
      event.tags.join(" "),
      event.attendees.join(" ")
    ]
      .join(" ")
      .toLowerCase();

    return yearMatch && typeMatch && haystack.includes(query);
  });
}

function renderRecordSummary(events) {
  const stats = getArchiveStats(events);
  const summaryItems = [
    { label: "표시된 라운드", value: `${stats.eventCount}회` },
    { label: "표시된 참석", value: `${stats.totalAttendance}건` },
    { label: "표시된 사진", value: `${stats.totalPhotos}장` },
    { label: "가장 최근 기록", value: stats.latestDate }
  ];

  elements.recordSummary.innerHTML = summaryItems
    .map(
      (item) => `
        <div class="summary-card">
          <dt>${escapeHtml(item.label)}</dt>
          <dd>${escapeHtml(item.value)}</dd>
        </div>
      `
    )
    .join("");
}

function renderArchiveResultMeta(events) {
  const activeFilters = [state.archiveYear !== "all", state.archiveType !== "all", Boolean(state.archiveQuery.trim())].filter(Boolean).length;
  const filterText = activeFilters > 0 ? `필터 ${activeFilters}개 적용` : "전체 보기";
  elements.archiveResultMeta.textContent = `${filterText} · ${events.length}건 표시`;
}

function renderArchiveGrid(events) {
  if (!events.length) {
    elements.archiveGrid.innerHTML = `
      <article class="archive-card" data-reveal>
        <h3>조건에 맞는 기록이 없습니다.</h3>
        <p class="archive-summary">검색어를 줄이거나 연도/유형 필터를 초기화해 다시 확인해 주세요.</p>
      </article>
    `;
    refreshRevealTargets(elements.archiveGrid);
    return;
  }

  elements.archiveGrid.innerHTML = events
    .map((event) => {
      const previewPhotos = event.photos.slice(0, Math.min(3, event.photos.length));
      const attendeePreview = event.attendees.slice(0, 6);

      return `
        <article class="archive-card" data-reveal>
          <div class="archive-card-head">
            <div>
              <p class="archive-date">${escapeHtml(formatDateShort(event.date))}</p>
              <h3>${escapeHtml(event.title)}</h3>
            </div>
            <div class="tag-row">
              <span class="tag">${escapeHtml(event.type)}</span>
              <span class="tag alt">${event.attendees.length}명</span>
            </div>
          </div>
          <div class="archive-layout">
            <div>
              <p class="archive-summary">${escapeHtml(event.summary)}</p>
              <dl class="archive-facts">
                <div class="archive-fact">
                  <dt>일시</dt>
                  <dd>${escapeHtml(formatDate(event.date))}</dd>
                </div>
                <div class="archive-fact">
                  <dt>장소</dt>
                  <dd>${escapeHtml(event.venue)}</dd>
                </div>
                <div class="archive-fact">
                  <dt>참석</dt>
                  <dd>${event.attendees.length}명</dd>
                </div>
                <div class="archive-fact">
                  <dt>사진</dt>
                  <dd>${event.photos.length}장</dd>
                </div>
              </dl>
              <div class="tag-row" style="margin-top:0.9rem;">
                ${event.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
              </div>
              <div class="attendee-row" style="margin-top:0.9rem;">
                ${attendeePreview.map((nickname) => `<span class="attendee-chip">${escapeHtml(nickname)}</span>`).join("")}
                ${event.attendees.length > attendeePreview.length ? `<span class="attendee-chip">+${event.attendees.length - attendeePreview.length}</span>` : ""}
              </div>
              <div class="archive-actions">
                <button class="inline-link" type="button" data-event-detail="${escapeHtml(event.id)}">상세 기록</button>
                <button class="inline-link" type="button" data-gallery-event="${escapeHtml(event.id)}" data-gallery-index="0">사진 보기</button>
              </div>
            </div>
            <div class="archive-gallery">
              ${previewPhotos
                .map(
                  (photo, index) => `
                    <button
                      class="photo-tile"
                      type="button"
                      data-gallery-event="${escapeHtml(event.id)}"
                      data-gallery-index="${index}"
                      data-photo-label="${index + 1} / ${event.photos.length}"
                      aria-label="${escapeHtml(event.title)} 사진 ${index + 1} 보기"
                    >
                      <img src="${escapeHtml(photo.thumb || photo.src)}" alt="${escapeHtml(photo.caption)}" loading="lazy" />
                    </button>
                  `
                )
                .join("")}
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  refreshRevealTargets(elements.archiveGrid);
}

function renderArchiveFilters() {
  const years = Array.from(new Set(clubData.archive.map((event) => event.date.slice(0, 4))));
  const types = Array.from(new Set(clubData.archive.map((event) => event.type)));

  elements.yearFilters.innerHTML = [
    `<button class="filter-button ${state.archiveYear === "all" ? "is-active" : ""}" type="button" data-filter-year="all">전체</button>`,
    ...years.map(
      (year) =>
        `<button class="filter-button ${state.archiveYear === year ? "is-active" : ""}" type="button" data-filter-year="${escapeHtml(year)}">${escapeHtml(year)}</button>`
    )
  ].join("");

  elements.typeFilters.innerHTML = [
    `<button class="filter-button ${state.archiveType === "all" ? "is-active" : ""}" type="button" data-filter-type="all">전체</button>`,
    ...types.map(
      (type) =>
        `<button class="filter-button ${state.archiveType === type ? "is-active" : ""}" type="button" data-filter-type="${escapeHtml(type)}">${escapeHtml(type)}</button>`
    )
  ].join("");
}

function updateArchiveView() {
  const visibleEvents = getVisibleArchive();
  renderArchiveFilters();
  renderRecordSummary(visibleEvents);
  renderArchiveResultMeta(visibleEvents);
  renderArchiveGrid(visibleEvents);
}

function getVisibleMembers() {
  const query = state.memberQuery.trim().toLowerCase();
  return getMemberActivity().filter((member) => {
    if (!query) return true;
    const haystack = [member.nickname, member.role, member.style, member.note].join(" ").toLowerCase();
    return haystack.includes(query);
  });
}

function renderMemberSummary(members) {
  const allMembers = getMemberActivity();
  const totalAttendance = clubData.archive.reduce((sum, event) => sum + event.attendees.length, 0);
  const averageAttendance = (totalAttendance / clubData.archive.length).toFixed(1);
  const topMember = allMembers.find((member) => member.count > 0);
  const summaryItems = [
    { label: "등록 닉네임", value: `${clubData.members.length}명` },
    { label: "평균 참석", value: `${averageAttendance}명 / 회` },
    { label: "최다 참여", value: topMember ? `${topMember.nickname} · ${topMember.count}회` : "-" },
    { label: "표시된 회원", value: `${members.length}명` }
  ];

  elements.memberSummary.innerHTML = summaryItems
    .map(
      (item) => `
        <div class="summary-card">
          <dt>${escapeHtml(item.label)}</dt>
          <dd>${escapeHtml(item.value)}</dd>
        </div>
      `
    )
    .join("");
}

function renderMemberResultMeta(members) {
  elements.memberResultMeta.textContent = `현재 ${members.length}명의 회원이 표시됩니다. 닉네임이나 플레이 스타일로 빠르게 찾을 수 있습니다.`;
}

function renderMembers(members) {
  if (!members.length) {
    elements.memberGrid.innerHTML = `
      <article class="member-card" data-reveal>
        <h3>검색 결과가 없습니다.</h3>
        <p class="member-note">다른 닉네임 또는 역할 키워드로 다시 검색해 주세요.</p>
      </article>
    `;
    refreshRevealTargets(elements.memberGrid);
    return;
  }

  const maxCount = Math.max(...members.map((member) => member.count), 1);
  elements.memberGrid.innerHTML = members
    .map((member) => {
      const meter = `${Math.max((member.count / maxCount) * 100, member.count > 0 ? 24 : 8)}%`;
      const lastAttended = member.lastAttended ? formatDateShort(member.lastAttended) : "기록 없음";
      return `
        <article class="member-card" data-reveal>
          <div class="member-card-head">
            <div>
              <span class="member-role" data-role="${escapeHtml(getRoleLabel(member.role))}">${escapeHtml(member.role)}</span>
              <h3>${escapeHtml(member.nickname)}</h3>
            </div>
            <div class="tag-row">
              <span class="tag alt">${member.count}회</span>
            </div>
          </div>
          <p class="member-style">${escapeHtml(member.style)}</p>
          <p class="member-note">${escapeHtml(member.note)}</p>
          <div class="member-meta">
            <div class="member-meta-row">
              <span>최근 참석</span>
              <strong>${escapeHtml(lastAttended)}</strong>
            </div>
            <div class="member-meta-row">
              <span>활동 분류</span>
              <strong>${escapeHtml(getRoleLabel(member.role))}</strong>
            </div>
          </div>
          <div class="member-meter" style="--meter:${meter};"></div>
        </article>
      `;
    })
    .join("");

  refreshRevealTargets(elements.memberGrid);
}

function updateMemberView() {
  const visibleMembers = getVisibleMembers();
  renderMemberSummary(visibleMembers);
  renderMemberResultMeta(visibleMembers);
  renderMembers(visibleMembers);
}

function renderGuideCards() {
  elements.guideGrid.innerHTML = clubData.guideCards
    .map(
      (card, index) => `
        <article class="guide-card ${card.accent ? "accent" : ""}" data-reveal style="--reveal-delay:${Math.min(index * 60, 180)}ms;">
          <p class="card-kicker">${escapeHtml(card.kicker)}</p>
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.body)}</p>
        </article>
      `
    )
    .join("");
  refreshRevealTargets(elements.guideGrid);
}

function renderContactCards() {
  elements.contactGrid.innerHTML = clubData.contacts
    .map(
      (contact, index) => `
        <article class="contact-card" data-reveal style="--reveal-delay:${Math.min(index * 60, 180)}ms;">
          <p class="panel-label">${escapeHtml(contact.title)}</p>
          <h3>${escapeHtml(contact.email)}</h3>
          <p>${escapeHtml(contact.body)}</p>
          <div class="contact-tags" style="margin-top:0.8rem;">
            ${contact.tags.map((tag) => `<span class="contact-tag">${escapeHtml(tag)}</span>`).join("")}
          </div>
          <a href="${escapeHtml(contact.href)}">${escapeHtml(contact.title)} 메일 보내기</a>
        </article>
      `
    )
    .join("");
  refreshRevealTargets(elements.contactGrid);
}

function renderNoticeDialog() {
  const nextRound = clubData.nextRound;
  elements.noticeDialogBody.innerHTML = `
    <section class="dialog-section">
      <h4>현재 상태</h4>
      <p>${escapeHtml(nextRound.scheduleLabel)} · ${escapeHtml(nextRound.venue)}</p>
      <p>${escapeHtml(nextRound.note)}</p>
    </section>
    <section class="dialog-section">
      <h4>운영 단계</h4>
      <ul class="dialog-list">
        ${nextRound.steps.map((step) => `<li><strong>${escapeHtml(step.title)}</strong> - ${escapeHtml(step.detail)}</li>`).join("")}
      </ul>
    </section>
    <section class="dialog-section">
      <h4>참여 루틴</h4>
      <ul class="dialog-list">
        ${nextRound.participationRules
          .map((rule) => `<li><strong>${escapeHtml(rule.title)}</strong> - ${escapeHtml(rule.detail)}</li>`)
          .join("")}
      </ul>
    </section>
    <section class="dialog-section">
      <h4>의견 수집 주제</h4>
      <div class="topic-chips">
        ${nextRound.talkTopics.map((topic) => `<span class="chip">${escapeHtml(topic)}</span>`).join("")}
      </div>
    </section>
  `;
}

function renderDetailDialog(eventId) {
  const event = archiveById.get(eventId);
  if (!event) return;

  elements.detailDialogTitle.textContent = event.title;
  elements.detailDialogBody.innerHTML = `
    <div class="detail-layout">
      <div class="detail-hero">
        <p>${escapeHtml(event.summary)}</p>
        <dl class="detail-facts">
          <div class="detail-fact">
            <dt>일시</dt>
            <dd>${escapeHtml(formatDate(event.date))}</dd>
          </div>
          <div class="detail-fact">
            <dt>장소</dt>
            <dd>${escapeHtml(event.venue)}</dd>
          </div>
          <div class="detail-fact">
            <dt>주소</dt>
            <dd>${escapeHtml(event.address)}</dd>
          </div>
          <div class="detail-fact">
            <dt>참석</dt>
            <dd>${event.attendees.length}명</dd>
          </div>
        </dl>
        <section class="dialog-section">
          <h4>기록 메모</h4>
          <ul class="dialog-list">
            ${event.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
          </ul>
        </section>
        <section class="dialog-section">
          <h4>참석 닉네임</h4>
          <div class="attendee-row">
            ${event.attendees.map((nickname) => `<span class="attendee-chip">${escapeHtml(nickname)}</span>`).join("")}
          </div>
        </section>
      </div>
      <div>
        <section class="dialog-section">
          <h4>사진</h4>
          <div class="detail-gallery">
            ${event.photos
              .map(
                (photo, index) => `
                  <button
                    class="photo-tile"
                    type="button"
                    data-gallery-event="${escapeHtml(event.id)}"
                    data-gallery-index="${index}"
                    data-photo-label="${index + 1} / ${event.photos.length}"
                    aria-label="${escapeHtml(event.title)} 사진 ${index + 1} 보기"
                  >
                    <img src="${escapeHtml(photo.thumb || photo.src)}" alt="${escapeHtml(photo.caption)}" loading="lazy" />
                  </button>
                `
              )
              .join("")}
          </div>
        </section>
      </div>
    </div>
  `;
}

function openDialog(dialog) {
  if (!dialog) return;
  if (dialog.open) return;
  setMobileMenu(false);
  state.lastFocusedByDialog.set(dialog.id, document.activeElement instanceof HTMLElement ? document.activeElement : null);
  document.body.classList.add("dialog-open");
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "true");
}

function closeDialog(dialog) {
  if (!dialog) return;
  if (!dialog.open && !dialog.hasAttribute("open")) return;
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
  const hasOpenDialog = [elements.noticeDialog, elements.detailDialog, elements.lightboxDialog].some((item) => item?.open);
  document.body.classList.toggle("dialog-open", hasOpenDialog);
  const lastFocused = state.lastFocusedByDialog.get(dialog.id);
  if (lastFocused) lastFocused.focus();
}

function openLightbox(eventId, photoIndex) {
  const event = archiveById.get(eventId);
  if (!event) return;

  if (elements.detailDialog.open) closeDialog(elements.detailDialog);

  state.galleryPhotos = event.photos.map((photo) => ({
    ...photo,
    eventTitle: event.title
  }));
  renderLightbox(event.title, photoIndex);
  openDialog(elements.lightboxDialog);
}

function renderLightbox(title, photoIndex) {
  const photos = state.galleryPhotos;
  if (!photos.length) return;

  state.galleryIndex = (photoIndex + photos.length) % photos.length;
  const currentPhoto = photos[state.galleryIndex];

  elements.lightboxTitle.textContent = title;
  elements.lightboxCaption.textContent = currentPhoto.caption;
  elements.lightboxImage.src = currentPhoto.src;
  elements.lightboxImage.alt = currentPhoto.caption;

  elements.lightboxStrip.innerHTML = photos
    .map(
      (photo, index) => `
        <button
          class="lightbox-thumb ${index === state.galleryIndex ? "is-active" : ""}"
          type="button"
          data-lightbox-index="${index}"
          aria-label="${index + 1}번째 사진 보기"
        >
          <img src="${escapeHtml(photo.thumb || photo.src)}" alt="" />
        </button>
      `
    )
    .join("");
}

function setMobileMenu(open) {
  const shouldOpen = Boolean(open);
  document.body.classList.toggle("menu-open", shouldOpen);
  elements.navToggle?.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
  elements.navToggle?.setAttribute("aria-label", shouldOpen ? "메인 메뉴 닫기" : "메인 메뉴 열기");
  if (elements.mainNav) {
    elements.mainNav.setAttribute("aria-hidden", window.innerWidth <= 900 && !shouldOpen ? "true" : "false");
  }
}

function refreshRevealTargets(scope = document) {
  const targets =
    scope instanceof Element
      ? Array.from(scope.querySelectorAll("[data-reveal]"))
      : Array.from(document.querySelectorAll("[data-reveal]"));

  targets.forEach((target, index) => {
    if (!target.classList.contains("reveal-ready")) {
      target.classList.add("reveal-ready");
      if (!target.style.getPropertyValue("--reveal-delay")) {
        target.style.setProperty("--reveal-delay", `${Math.min(index * 45, 180)}ms`);
      }
    }

    if (revealObserver) revealObserver.observe(target);
    else target.classList.add("is-visible");
  });
}

function setupRevealObserver() {
  if (!("IntersectionObserver" in window)) {
    refreshRevealTargets();
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  refreshRevealTargets();
}

function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  elements.scrollProgress?.style.setProperty("--progress", progress.toFixed(4));
}

function setupScrollSpy() {
  if (!("IntersectionObserver" in window)) return;

  const sections = elements.navLinks
    .map((link) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return null;
      const section = document.querySelector(href);
      return section ? { link, section, id: href } : null;
    })
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const activeSection = sections.find((item) => item.section === entry.target);
        if (!activeSection || !entry.isIntersecting) return;
        elements.navLinks.forEach((link) => link.classList.toggle("is-active", link === activeSection.link));
      });
    },
    { rootMargin: "-35% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((item) => observer.observe(item.section));
}

function bindEvents() {
  elements.navToggle?.addEventListener("click", (event) => {
    event.preventDefault();
    setMobileMenu(!document.body.classList.contains("menu-open"));
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (document.body.classList.contains("menu-open") && elements.headerShell && !target.closest(".header-shell")) {
      setMobileMenu(false);
    }

    const navLink = target.closest(".main-nav a");
    if (navLink) {
      setMobileMenu(false);
    }

    const openTrigger = target.closest("[data-open-dialog]");
    if (openTrigger) {
      event.preventDefault();
      const dialog = document.getElementById(openTrigger.getAttribute("data-open-dialog"));
      openDialog(dialog);
      return;
    }

    const closeTrigger = target.closest("[data-close-dialog]");
    if (closeTrigger) {
      event.preventDefault();
      const dialog = document.getElementById(closeTrigger.getAttribute("data-close-dialog"));
      closeDialog(dialog);
      return;
    }

    const detailTrigger = target.closest("[data-event-detail]");
    if (detailTrigger) {
      event.preventDefault();
      const eventId = detailTrigger.getAttribute("data-event-detail");
      renderDetailDialog(eventId);
      openDialog(elements.detailDialog);
      return;
    }

    const galleryTrigger = target.closest("[data-gallery-event]");
    if (galleryTrigger) {
      event.preventDefault();
      const eventId = galleryTrigger.getAttribute("data-gallery-event");
      const index = Number(galleryTrigger.getAttribute("data-gallery-index") || 0);
      openLightbox(eventId, index);
      return;
    }

    const yearFilter = target.closest("[data-filter-year]");
    if (yearFilter) {
      state.archiveYear = yearFilter.getAttribute("data-filter-year") || "all";
      updateArchiveView();
      return;
    }

    const typeFilter = target.closest("[data-filter-type]");
    if (typeFilter) {
      state.archiveType = typeFilter.getAttribute("data-filter-type") || "all";
      updateArchiveView();
      return;
    }

    const lightboxThumb = target.closest("[data-lightbox-index]");
    if (lightboxThumb) {
      renderLightbox(elements.lightboxTitle.textContent || "행사 사진", Number(lightboxThumb.getAttribute("data-lightbox-index")));
    }
  });

  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog(dialog);
    });

    dialog.addEventListener("close", () => {
      const hasOpenDialog = [elements.noticeDialog, elements.detailDialog, elements.lightboxDialog].some((item) => item?.open);
      document.body.classList.toggle("dialog-open", hasOpenDialog);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (document.body.classList.contains("menu-open")) setMobileMenu(false);
      else if (elements.lightboxDialog.open) closeDialog(elements.lightboxDialog);
      else if (elements.detailDialog.open) closeDialog(elements.detailDialog);
      else if (elements.noticeDialog.open) closeDialog(elements.noticeDialog);
      return;
    }

    if (!elements.lightboxDialog.open || !state.galleryPhotos.length) return;
    if (event.key === "ArrowLeft") renderLightbox(elements.lightboxTitle.textContent || "행사 사진", state.galleryIndex - 1);
    if (event.key === "ArrowRight") renderLightbox(elements.lightboxTitle.textContent || "행사 사진", state.galleryIndex + 1);
  });

  elements.archiveSearch?.addEventListener("input", () => {
    state.archiveQuery = elements.archiveSearch.value;
    updateArchiveView();
  });

  elements.memberSearch?.addEventListener("input", () => {
    state.memberQuery = elements.memberSearch.value;
    updateMemberView();
  });

  elements.lightboxPrev?.addEventListener("click", () => {
    renderLightbox(elements.lightboxTitle.textContent || "행사 사진", state.galleryIndex - 1);
  });

  elements.lightboxNext?.addEventListener("click", () => {
    renderLightbox(elements.lightboxTitle.textContent || "행사 사진", state.galleryIndex + 1);
  });

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

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setMobileMenu(false);
    updateScrollProgress();
  });
}

function renderFooter() {
  const stats = getArchiveStats();
  elements.footerMeta.textContent = `활동 회원 ${clubData.members.length}명 · 보관 라운드 ${stats.eventCount}회 · 사진 ${stats.totalPhotos}장`;
}

function init() {
  renderHeadlineMetrics();
  renderHeroBoard();
  renderBoardPanel();
  renderLatestRoundPanel();
  renderNoticePanel();
  updateArchiveView();
  updateMemberView();
  renderGuideCards();
  renderContactCards();
  renderNoticeDialog();
  renderFooter();
  setupRevealObserver();
  setupScrollSpy();
  bindEvents();
  setMobileMenu(false);
  updateScrollProgress();
}

init();
