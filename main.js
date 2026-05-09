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
  ["stag", "사슴", 82],
  ["fox", "여우", 42],
  ["bear", "곰", 72],
  ["otter", "수달", 180],
  ["owl", "부엉이", 108],
  ["tiger", "호랑이", 58],
  ["horse", "말", 96],
  ["hawk", "매", 34],
  ["dolphin", "돌고래", 214],
  ["lynx", "스라소니", 318],
  ["crane", "두루미", 24],
  ["panther", "표범", 150],
  ["cheetah", "치타", 88],
  ["eagle", "독수리", 64],
  ["heron", "왜가리", 196],
  ["bison", "들소", 46],
  ["seal", "물개", 226],
  ["swan", "백조", 126]
];

const memberAnimalSprite = `
  <svg class="member-animal-sprite" aria-hidden="true" focusable="false">
    <defs>
      <symbol id="animal-stag" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <path d="M18 16c-4-6-3-10 1-12M20 16c-9-1-10-8-8-12M46 16c4-6 3-10-1-12M44 16c9-1 10-8 8-12" fill="none" stroke="var(--animal-line)" stroke-width="2.4" stroke-linecap="round" />
        <path d="M19 22l-7-6 2 12M45 22l7-6-2 12" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2" stroke-linejoin="round" />
        <path d="M20 30c0-10 24-10 24 0v8c0 8-5 14-12 14S20 46 20 38z" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" />
        <path d="M28 34h.01M36 34h.01" stroke="var(--animal-line)" stroke-width="3.2" stroke-linecap="round" />
        <path d="M29 42c2 2 4 2 6 0" fill="none" stroke="var(--animal-line)" stroke-width="2" stroke-linecap="round" />
      </symbol>
      <symbol id="animal-fox" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <path d="M16 15l12 9h8l12-9-4 24c-1 8-6 13-12 13s-11-5-12-13z" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" stroke-linejoin="round" />
        <path d="M24 33l8 17 8-17" fill="var(--animal-soft)" stroke="var(--animal-line)" stroke-width="2" stroke-linejoin="round" />
        <path d="M26 31h.01M38 31h.01" stroke="var(--animal-line)" stroke-width="3.2" stroke-linecap="round" />
        <path d="M31 40h2" stroke="var(--animal-line)" stroke-width="2.4" stroke-linecap="round" />
      </symbol>
      <symbol id="animal-bear" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <circle cx="20" cy="21" r="8" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.2" />
        <circle cx="44" cy="21" r="8" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.2" />
        <circle cx="32" cy="35" r="18" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" />
        <ellipse cx="32" cy="42" rx="9" ry="7" fill="var(--animal-soft)" stroke="var(--animal-line)" stroke-width="2" />
        <path d="M26 33h.01M38 33h.01M30 41h4M28 46c3 2 5 2 8 0" stroke="var(--animal-line)" stroke-width="2.6" stroke-linecap="round" />
      </symbol>
      <symbol id="animal-otter" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <path d="M19 32c0-10 6-17 13-17s13 7 13 17v7c0 8-6 14-13 14s-13-6-13-14z" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" />
        <ellipse cx="32" cy="40" rx="10" ry="8" fill="var(--animal-soft)" stroke="var(--animal-line)" stroke-width="2" />
        <path d="M25 33h.01M39 33h.01M31 39h2M18 39l8 2M18 45l8-1M46 39l-8 2M46 45l-8-1" stroke="var(--animal-line)" stroke-width="2.2" stroke-linecap="round" />
      </symbol>
      <symbol id="animal-owl" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <path d="M17 19l8 3 7-7 7 7 8-3v17c0 10-6 17-15 17s-15-7-15-17z" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" stroke-linejoin="round" />
        <circle cx="26" cy="34" r="7" fill="var(--animal-soft)" stroke="var(--animal-line)" stroke-width="2" />
        <circle cx="38" cy="34" r="7" fill="var(--animal-soft)" stroke="var(--animal-line)" stroke-width="2" />
        <path d="M26 34h.01M38 34h.01M30 42l2 3 2-3" stroke="var(--animal-line)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
      </symbol>
      <symbol id="animal-tiger" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <path d="M20 23l-5-6 1 12M44 23l5-6-1 12" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2" stroke-linejoin="round" />
        <path d="M18 34c0-12 8-19 14-19s14 7 14 19c0 11-6 18-14 18s-14-7-14-18z" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" />
        <path d="M32 18v9M24 24l5 4M40 24l-5 4M21 33l7 1M43 33l-7 1" fill="none" stroke="var(--animal-line)" stroke-width="2" stroke-linecap="round" />
        <path d="M26 36h.01M38 36h.01M30 44c2 2 4 2 6 0" stroke="var(--animal-line)" stroke-width="2.6" stroke-linecap="round" />
      </symbol>
      <symbol id="animal-horse" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <path d="M40 13c-10 1-18 7-19 17l-2 17h19c7 0 11-5 11-12V22c0-6-3-9-9-9z" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" stroke-linejoin="round" />
        <path d="M31 17c-4 5-5 11-5 22M43 23h.01M31 38c5 2 8 1 11-1" fill="none" stroke="var(--animal-line)" stroke-width="2.2" stroke-linecap="round" />
        <path d="M20 30c6-7 13-9 20-10" fill="none" stroke="var(--animal-soft)" stroke-width="5" stroke-linecap="round" />
      </symbol>
      <symbol id="animal-hawk" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <path d="M17 31c8-13 22-15 33-8-3 1-6 4-7 8 5 0 8 3 10 6-10 2-18 0-23-5-3 7-8 12-15 15 2-6 2-11 2-16z" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" stroke-linejoin="round" />
        <path d="M39 25l10 2-7 4M34 28h.01M22 38c6-1 12-4 17-9" fill="none" stroke="var(--animal-line)" stroke-width="2.2" stroke-linecap="round" />
      </symbol>
      <symbol id="animal-dolphin" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <path d="M14 37c9-15 25-22 39-13-5 0-8 2-10 6 5 1 8 4 10 8-13 5-25 2-33-5l-8 8z" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" stroke-linejoin="round" />
        <path d="M28 28l-3-9 10 7M41 31h.01" stroke="var(--animal-line)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      </symbol>
      <symbol id="animal-lynx" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <path d="M20 22l-4-10 9 8M44 22l4-10-9 8" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2" stroke-linejoin="round" />
        <path d="M18 34c0-11 7-18 14-18s14 7 14 18c0 10-6 17-14 17s-14-7-14-17z" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" />
        <path d="M24 36h.01M40 36h.01M31 43h2M17 19l-4-5M47 19l4-5M24 46c5 3 11 3 16 0" stroke="var(--animal-line)" stroke-width="2.4" stroke-linecap="round" />
      </symbol>
      <symbol id="animal-crane" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <path d="M37 15c-7 4-10 12-9 23 1 8-3 12-9 13h24c-5-3-7-8-6-16 1-6 5-8 12-9l-10-4z" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" stroke-linejoin="round" />
        <path d="M41 21l13 2-12 4M36 23h.01M27 51v6M37 51v6" stroke="var(--animal-line)" stroke-width="2.2" stroke-linecap="round" />
      </symbol>
      <symbol id="animal-panther" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <path d="M18 22l8-7 3 8h6l3-8 8 7-2 17c-1 8-6 13-12 13s-11-5-12-13z" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" stroke-linejoin="round" />
        <path d="M25 34l4 1M39 34l-4 1M30 43c2 2 4 2 6 0M22 39l7 1M42 40l7-1" fill="none" stroke="var(--animal-line)" stroke-width="2.2" stroke-linecap="round" />
      </symbol>
      <symbol id="animal-cheetah" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <path d="M19 31c0-10 6-17 13-17s13 7 13 17v6c0 9-6 15-13 15s-13-6-13-15z" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" />
        <path d="M23 23l-4-6M41 23l4-6M27 32h.01M37 32h.01M27 24h.01M38 24h.01M24 40h.01M40 40h.01M31 43c2 2 4 2 6 0" stroke="var(--animal-line)" stroke-width="2.4" stroke-linecap="round" />
      </symbol>
      <symbol id="animal-eagle" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <path d="M17 34c8-13 18-19 31-14-5 2-8 6-9 11 5 1 8 3 11 7-10 4-19 2-26-4-1 5-4 9-8 12 0-4 0-8 1-12z" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" stroke-linejoin="round" />
        <path d="M37 25l15 2-12 6M33 29h.01M25 35c4-1 8-3 11-7" fill="none" stroke="var(--animal-line)" stroke-width="2.2" stroke-linecap="round" />
      </symbol>
      <symbol id="animal-heron" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <path d="M41 16c-9 2-13 9-11 20 1 7-4 12-12 15h24c-4-3-6-8-4-15 2-6 7-8 14-10l-10-4z" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" stroke-linejoin="round" />
        <path d="M45 22l11 3-12 3M38 23h.01M25 51v6M35 51v6" stroke="var(--animal-line)" stroke-width="2.2" stroke-linecap="round" />
      </symbol>
      <symbol id="animal-bison" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <path d="M18 29c-5-7-3-13 4-15M46 29c5-7 3-13-4-15" fill="none" stroke="var(--animal-line)" stroke-width="2.8" stroke-linecap="round" />
        <path d="M18 34c0-10 7-17 14-17s14 7 14 17c0 10-6 17-14 17s-14-7-14-17z" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" />
        <path d="M20 25c5-5 19-6 24 0" fill="none" stroke="var(--animal-soft)" stroke-width="6" stroke-linecap="round" />
        <path d="M26 36h.01M38 36h.01M29 44c2 2 4 2 6 0" stroke="var(--animal-line)" stroke-width="2.5" stroke-linecap="round" />
      </symbol>
      <symbol id="animal-seal" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <path d="M18 37c0-11 7-18 15-18 9 0 16 8 15 19-1 8-7 14-15 14S18 46 18 37z" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" />
        <path d="M27 35h.01M39 35h.01M32 39h.01M18 43l10-2M18 48l10-3M46 41l10 2M46 45l10 3" stroke="var(--animal-line)" stroke-width="2.2" stroke-linecap="round" />
        <path d="M28 45c3 2 5 2 8 0" fill="none" stroke="var(--animal-line)" stroke-width="2" stroke-linecap="round" />
      </symbol>
      <symbol id="animal-swan" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="var(--animal-bg)" />
        <path d="M38 14c-9 2-13 9-10 18 2 5 0 9-7 13 9 5 22 5 30-3-7 1-12-1-14-6-2-4 1-8 8-10z" fill="var(--animal-fill)" stroke="var(--animal-line)" stroke-width="2.4" stroke-linejoin="round" />
        <path d="M41 21l12 3-11 4M38 22h.01M22 45c8 3 18 2 28-3" stroke="var(--animal-line)" stroke-width="2.2" stroke-linecap="round" />
      </symbol>
    </defs>
  </svg>
`;

const getMemberAnimal = (index) => {
  const [id, label, hue] = memberAnimals[index % memberAnimals.length];
  return { id, label, hue };
};

const renderMemberAnimal = (animal, name) => `
  <svg class="member-animal" viewBox="0 0 64 64" role="img" aria-label="${name} 회원 ${animal.label} 캐릭터" focusable="false" style="--animal-hue: ${animal.hue};">
    <use href="#animal-${animal.id}"></use>
  </svg>
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
  eyebrow: "Next Round",
  title: "2분기 말 스크린 행사 예정",
  meta: "세부 일정 준비 중 · 스크린 라운드",
  body: "일정이 잡히는 대로 회장/총무 안내를 통해 함께 나눌 예정입니다."
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

const getMessageApiBase = () =>
  document.querySelector('meta[name="message-api-base"]')?.getAttribute("content")?.trim() || "/api";

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
              <span><strong>Next Round</strong>2분기 말 스크린 행사</span>
              <span><strong>Latest Record</strong>2026.04 베이스타즈CC</span>
              <span><strong>Members</strong>18명</span>
            </div>
            <div class="button-row">
              <a class="solid-button" href="#schedule">월례회 일정 보기</a>
              <a class="line-button" href="#archive">지난 라운드 보기</a>
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
            <h2 id="scheduleTitle">Next Round Board</h2>
          </div>
          <p>다음 모임은 2분기 말 스크린 라운드로 준비 중입니다.</p>
        </div>

        <div class="schedule-board" data-reveal>
          <article class="next-event">
            ${svgOrnaments.scheduleMap}
            <div class="event-date-lockup" aria-hidden="true">
              <span>Q2</span>
              <strong>Late</strong>
              <small>2026</small>
            </div>
            <div class="event-content">
              <div class="event-topline">
                <p class="event-state">준비 중</p>
                <span>Screen Round</span>
              </div>
              <h3>2026년 2분기 말 스크린 행사</h3>
              <p>이번 모임도 편하게 만나 한 라운드 즐기는 자리로 준비 중입니다. 세부 일정은 회장/총무 안내로 함께 나눌 예정입니다.</p>
            </div>
          </article>

          <div class="event-detail-panel" aria-label="다음 일정 상세 정보">
            <dl>
              <div>
                <dt>일시</dt>
                <dd>2분기 말 예정</dd>
              </div>
              <div>
                <dt>장소</dt>
                <dd>추후 안내</dd>
              </div>
              <div>
                <dt>방식</dt>
                <dd>스크린 라운드</dd>
              </div>
              <div>
                <dt>상태</dt>
                <dd>세부 일정 준비 중</dd>
              </div>
            </dl>
            <div class="button-row">
              <button class="solid-button" type="button" data-open-modal="rsvpModal">일정 안내</button>
              <a class="line-button" href="#archive">4월 행사 보기</a>
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
            <h3>4월 베이스타즈CC 필드 행사</h3>
            <p>라운딩부터 이동수 팀장님의 홀인원, 공동 1위 시상, 중식 모임까지 함께한 자리였습니다.</p>
          </article>
          <article data-reveal>
            <span>02</span>
            <h3>2분기 말 스크린 행사 예정</h3>
            <p>다음 만남은 스크린 라운드로 준비 중입니다. 가볍게 모여 다시 한 번 즐길 예정입니다.</p>
          </article>
          <article data-reveal>
            <span>03</span>
            <h3>함께 맞추는 다음 약속</h3>
            <p>일시와 장소가 정해지면 회장/총무 안내를 통해 회원들과 함께 나눌 예정입니다.</p>
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
    const staffMembers = indexedMembers.filter((member) => member.role !== "정회원");
    const regularMembers = indexedMembers.filter((member) => member.role === "정회원");

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
        ${memberAnimalSprite}
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
              <p class="section-kicker">Next Screen Event</p>
              <h3 id="rsvpTitle">2분기 말 스크린 행사 안내</h3>
            </div>
            <button class="line-button small" type="button" data-close-modal>닫기</button>
          </div>
          <div class="modal-body">
            <p>일시: 2026년 2분기 말 예정</p>
            <p>장소: 추후 안내</p>
            <p>방식: 스크린 라운드</p>
            <p>자세한 일정은 회장/총무 안내를 통해 회원들과 함께 나눌 예정입니다.</p>
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
            <p>장소: 추후 안내</p>
            <p>주소: 장소가 정해지면 함께 나눌 예정</p>
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
            <span>7일간 숨기기</span>
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
            <a href="#features">동호회</a>
            <a href="#schedule">일정</a>
            <a href="#members">회원</a>
            <a href="#archive">기록</a>
            <a href="#guestbook">방명록</a>
            <button type="button" data-open-modal="joinModal">가입 문의</button>
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
        <a href="#schedule"><strong>다음 모임</strong><span>일시와 준비사항</span></a>
        <a href="#archive"><strong>지난 사진</strong><span>라운드 기록 보기</span></a>
        <a href="#guestbook"><strong>한마디</strong><span>방명록 남기기</span></a>
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
        <p class="section-kicker">Member checklist</p>
        <h3>이번 모임 전에 이것만 확인하세요</h3>
        <ul>
          <li><strong>일정</strong><span>2분기 말 스크린 행사 예정</span></li>
          <li><strong>준비</strong><span>참석 여부, 개인 장비, 이동 시간을 미리 체크</span></li>
          <li><strong>기록</strong><span>라운드 후 사진과 후기는 아카이브 댓글에 남기기</span></li>
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
          <p class="section-kicker">Round memories</p>
          <h3>사진만 넘기지 말고, 그날의 한 장면도 남겨주세요.</h3>
        </div>
        <a class="line-button small" href="#archive">라운드 기록 보기</a>
      </aside>`
    );
  }

  const decorateArchiveCards = () => {
    document.querySelectorAll("[data-archive-index]").forEach((trigger) => {
      const index = Number(trigger.getAttribute("data-archive-index"));
      const archive = Array.isArray(archives) ? archives[index] : null;
      const card = trigger.closest("article, .archive-card, .featured-round, li, div");
      if (!archive || !card || card.querySelector(".archive-card-actions")) return;
      card.insertAdjacentHTML(
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

  const membersSection = document.getElementById("members");
  if (membersSection && !membersSection.querySelector(".member-pulse-card")) {
    membersSection.insertAdjacentHTML(
      "afterbegin",
      `<aside class="member-pulse-card" data-reveal>
        <p class="section-kicker">Member mood</p>
        <h3>이번 달도 함께 칠 사람들의 이름이 먼저 보이게.</h3>
        <p>명단은 관리용 목록이 아니라, 다음 라운드에서 다시 만날 얼굴을 확인하는 공간으로 다듬었습니다.</p>
      </aside>`
    );
  }

  document.querySelectorAll("img").forEach((image) => {
    const syncRatio = () => {
      if (!image.naturalWidth || !image.naturalHeight) return;
      image.classList.toggle("is-portrait-photo", image.naturalHeight > image.naturalWidth * 1.08);
    };
    if (image.complete) syncRatio();
    image.addEventListener("load", syncRatio, { once: true });
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
  initMessages();
  initMemberExperienceEnhancements();
  initBottomNotice();
};

initPage();

