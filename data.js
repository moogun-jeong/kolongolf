// 홈페이지 내용 데이터입니다. 회원·스코어(핸디)·지난 기록·대표 사진·다음 일정은 이 파일만 고치면 됩니다.
// 화면 코드는 main.js에 있고, 이 파일은 `npm run build` 전에 scripts/check.js가 형식을 검사합니다.
//
// 사진 추가 순서
//   1. 원본을 images/archive-<연도>-<월>-<번호>.jpg 로 넣고 `npm run images` 실행
//      (-display 1800px, -card 900px, -thumb 400px 파생본 생성)
//   2. 아래 archives의 images에 -display 경로를 적습니다.

export const members = [
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

// ─────────────────────────────────────────────────────────────────────────────
// 스코어 기록 (시즌 리더보드와 회원 핸디가 여기서 자동 계산됩니다)
//
// ▶ 새 라운드를 넣는 법 — GitHub에서 data.js 연필(✏️) 버튼 → 아래 rounds 맨 위에 한 덩어리 추가 → Commit
//   {
//     id: "2026-11-bomun",          // 영문·숫자·하이픈으로 된 고유 이름(겹치지 않게)
//     type: "필드",                  // "필드" 또는 "스크린" — 핸디·순위는 둘을 따로 계산합니다
//     date: "2026-11-01",           // 모르면 "" (비워 두기)
//     course: "경주 보문CC",          // 모르면 ""
//     archiveId: "",                // 사진 기록과 연결할 때만 archives의 id, 아니면 ""
//     scores: { 김정훈: 10, 서무환: 18 },   // 회원 실명: 스코어카드 SCORE(파 대비 타수, 예: +10 → 10)
//     guests: { 홍길동: 30 }          // 초대손님(핸디·순위 계산 제외, 라운드 기록에만 표시). 없으면 {}
//   },
//
// ▶ 규칙
//   - rounds는 최신 라운드가 맨 위입니다. 핸디는 이 순서로 "최근"을 판단합니다.
//   - 핸디 = 같은 종류(필드/스크린) 최근 3라운드 SCORE 평균(소수 첫째 자리). 기록이 없으면 빈칸.
//   - 이름 오타, 숫자가 아닌 스코어, 잘못된 날짜가 있으면 배포 전 자동 점검에서 멈추고 이유를 알려줍니다.
// ─────────────────────────────────────────────────────────────────────────────
export const handicapRule = { recentRounds: 3 };

export const rounds = [
  {
    id: "2026-08-mauna-ocean",
    type: "필드",
    date: "2026-08-15",
    course: "마우나오션CC",
    archiveId: "2026-08-mauna-ocean",
    scores: { 김정훈: 8, 김태연: 17, 윤석현: 18, 이동수: 19, 김효준: 25, 서무환: 25, 김경수: 30, 정무근: 32, 김무건: 33, 서승규: 35, 정성원: 37 },
    guests: { 전형준: 28 }
  }
];

export const archives = [
  {
    id: "2026-08-mauna-ocean",
    date: "2026.08.15",
    label: "필드 행사",
    title: "2026년 8월 마우나오션 필드 행사",
    location: "마우나오션CC",
    people: "12명 참가 (초대손님 1명 포함)",
    summary: "광복절에 마우나오션CC에서 필드 라운드를 함께했습니다. 조별로 티오프해 18홀을 돌고, 라운드 뒤에는 다 함께 모여 시상과 식사 자리를 가졌습니다.",
    highlights: ["마우나오션CC", "18홀 필드", "12명 참가"],
    details: [
      "일시: 2026년 8월 15일(토)",
      "장소: 마우나오션CC",
      "참가: 김정훈, 김태연, 윤석현, 이동수, 김효준, 서무환, 김경수, 정무근, 김무건, 서승규, 정성원, 전형준(초대손님)",
      "단체 스코어카드 상위: 1위 김정훈(+8), 2위 김태연(+17), 3위 윤석현(+18)"
    ],
    images: [
      "images/archive-2026-08-1-display.jpg",
      "images/archive-2026-08-2-display.jpg",
      "images/archive-2026-08-3-display.jpg"
    ]
  },
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
      "참가: 코오롱인더스트리 A팀(301호) 김효준, 서무환, 정무근, 하선재 / B팀(302호) 김경수, 박동성, 윤석현, 천기준",
      "경기 설정: 투어모드/G투어 난이도, 블루 티, 컨시드 1.5m, 멀리건 없음"
    ],
    images: [
      "images/archive-2026-07-11-display.jpg",
      "images/archive-2026-07-1-display.jpg",
      "images/archive-2026-07-2-display.jpg",
      "images/archive-2026-07-3-display.jpg",
      "images/archive-2026-07-4-display.jpg",
      "images/archive-2026-07-5-display.jpg",
      "images/archive-2026-07-6-display.jpg",
      "images/archive-2026-07-7-display.jpg",
      "images/archive-2026-07-8-display.jpg",
      "images/archive-2026-07-9-display.jpg",
      "images/archive-2026-07-10-display.jpg"
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
      "images/archive-2026-06-1-display.jpg",
      "images/archive-2026-06-notice-display.png"
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
      "images/archive-2026-04-2-display.jpg",
      "images/archive-2026-04-3-display.jpg",
      "images/archive-2026-04-1-display.jpg"
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

// 메인 대표 사진: 4명 이상 함께 나온 단체 사진이 방문할 때마다 무작위 순서로 섞여 6초마다 돌아갑니다.
// archiveId로 아래 지난 기록과 연결되어, 사진을 누르면 그 기록의 갤러리에서 원본 전체 크기로 열립니다.
// 날짜와 설명은 연결된 기록에서 자동으로 가져옵니다(caption을 적으면 그 문구를 대신 씁니다).
export const heroSlides = [
  { image: "images/archive-2026-08-3-display.jpg", archiveId: "2026-08-mauna-ocean", caption: "8월 마우나오션 라운드 뒤 단체 사진" },
  { image: "images/archive-2026-08-1-display.jpg", archiveId: "2026-08-mauna-ocean", caption: "8월 마우나오션 티잉 그라운드" },
  { image: "images/archive-2026-08-2-display.jpg", archiveId: "2026-08-mauna-ocean", caption: "8월 마우나오션 필드 라운드" },
  { image: "images/archive-2026-07-11-display.jpg", archiveId: "2026-07-seoknohyup", caption: "7월 석노협 대회 뒤 시상·식사 자리" },
  { image: "images/archive-2026-03-1-display.jpg", archiveId: "2026-03-regular", caption: "3월 정기전 단체 사진" },
  { image: "images/archive-2025-12-display.jpg", archiveId: "2025-12-year-end", caption: "2025 송년 라운드" },
  { image: "images/archive-2025-09-display.jpg", archiveId: "2025-09-regular", caption: "2025년 9월 정기전" },
  { image: "images/archive-2025-02-display.jpg", archiveId: "2025-02-regular", caption: "2025년 2월 정기전" }
];

// 사진을 작은 칸(메인·카드)에 채울 때 인물이 잘리지 않도록 잡는 중심점입니다.
//   x, y  : 인물이 모인 곳의 위치(%) — 0은 왼쪽/위, 100은 오른쪽/아래
//   zoom  : 확대 배율(1 = 그대로). 하늘이 넓은 사진처럼 인물이 작게 나온 경우에만 키웁니다.
// 여기에 없는 사진은 가운데(세로 사진은 위쪽 40%)를 기준으로 채웁니다. 크게 보기(라이트박스)는 항상 원본 전체를 보여줍니다.
export const photoFocus = {
  "images/archive-2026-08-3-display.jpg": { x: 50, y: 70 },
  "images/archive-2026-08-1-display.jpg": { x: 48, y: 50 },
  "images/archive-2026-08-2-display.jpg": { x: 48, y: 76, zoom: 2.2 },
  "images/archive-2026-07-11-display.jpg": { x: 50, y: 36 },
  "images/archive-2026-06-1-display.jpg": { x: 55, y: 50 },
  "images/archive-2026-04-2-display.jpg": { x: 50, y: 60 },
  "images/archive-2026-03-1-display.jpg": { x: 50, y: 50 },
  "images/archive-2025-12-display.jpg": { x: 50, y: 62 },
  "images/archive-2025-09-display.jpg": { x: 50, y: 70 },
  "images/archive-2025-05-display.jpg": { x: 50, y: 64 },
  "images/archive-2025-02-display.jpg": { x: 45, y: 60 }
};

// 확정된 "미래" 일정만 넣습니다. 지난 행사는 여기에 두지 않습니다.
// 비어 있으면 일정 영역은 "다음 모임 준비 중"으로 안내하고 하단 일정 공지는 표시하지 않습니다.
//
// 예시:
// {
//   id: "2026-09-screen",
//   date: "2026-09-05",
//   dateLockup: { month: "SEP", day: "05", year: "2026" },
//   eyebrow: "Regular Round",
//   state: "참가 신청 중",
//   title: "9월 정기 스크린 라운드",
//   summary: "9월 정기 라운드 일정입니다.",
//   body: "골프존파크에서 진행하는 정기 스크린 라운드입니다.",
//   location: "골프존파크 삼산한국골프점",  // 캘린더에 들어갈 장소
//   startTime: "08:00",                       // 선택. 없으면 캘린더에 '하루 종일' 일정으로 들어갑니다
//   durationHours: 5,                         // 선택. startTime이 있을 때 일정 길이(기본 5시간)
//   details: [["일시", "2026.09.05(토) 08:00"], ["장소", "골프존파크 삼산한국골프점"]]
// }
export const upcomingEvents = [
  {
    id: "2026-11-bomun",
    date: "2026-11-01",
    dateLockup: { month: "NOV", day: "01", year: "2026" },
    eyebrow: "Field Round",
    state: "예정",
    title: "11월 경주 보문CC 필드 라운드",
    body: "11월 1일 경주 보문CC에서 필드 라운드를 함께합니다. 티오프 시간과 조 편성은 정해지면 이곳에 안내할게요.",
    location: "경주 보문CC",
    details: [["일시", "2026.11.01(일)"], ["장소", "경주 보문CC"]]
  }
];
