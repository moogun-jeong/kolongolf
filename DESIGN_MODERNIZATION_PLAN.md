# 디자인 현대화 제안 (Design Modernization Plan)

작성일: 2026-08-10
대상: `index.html` · `style.css` (3,800줄) · `main.js` (2,413줄)
상태: **Phase 0~3 구현 완료 (2026-08-10). 다크 모드(§3.2 후반, D-04)는 요청에 따라 제외했습니다.**

> 구현 결과와 계획 대비 변경 사항은 `TASK.md` 0장과 `PROJECT_LOG.md`에 기록했습니다.
> 아래 본문은 **구현 시점의 진단 기록**으로 남겨 둡니다. 수치는 개선 전 기준입니다.

---

## 0. 요약

현재 사이트의 **디자인 컨셉(딥그린 + 아이보리 + 골드, 헤리티지 클럽 감성)은 방향이 옳습니다.** `home_redisign.md`에서 1순위로 꼽은 Gleneagles 계열 색감을 제대로 잡았고, `@layer` 구조와 Web Components 분리도 깔끔합니다. **컨셉을 갈아엎을 이유가 없습니다.**

문제는 컨셉이 아니라 **실행 밀도**입니다. 세 가지로 압축됩니다.

| # | 진단 | 근거 |
|---|---|---|
| 1 | **디자인 시스템이 이름만 있고 실제로는 안 쓰입니다** | 토큰은 20개인데 스타일시트에 하드코딩된 `oklch()` 리터럴이 **159개(고유 127개)**. 간격 값 61종, 그림자 14종, 모서리 반경 12종 |
| 2 | **모션이 사실상 없습니다** | `@keyframes` **0개**, `cubic-bezier` **0개**. 트랜지션 16개 전부 기본 `ease` 키워드 160~180ms |
| 3 | **2023년 이후 CSS를 거의 안 씁니다** | `:has()` 0, `color-mix()` 0, `light-dark()` 0, 다크모드 0, View Transitions 0, 스크롤 기반 애니메이션 0. `container-type`은 전 섹션에 선언해두고 `@container` 규칙은 **딱 1개** |

즉 **"잘 고른 재료로 만든, 움직이지 않는 2019년식 페이지"** 입니다. 정지 스크린샷은 준수하지만 스크롤하고 터치하는 순간 최신 사이트와의 격차가 드러납니다.

제안하는 개선 방향:

- **A. 토큰 시스템 재구축** — 유동 타이포 스케일 + 4pt 간격 램프 + `color-mix()` 파생 팔레트로 127개 리터럴을 흡수
- **B. 모션 레이어 신설** — 이징 토큰, 스크롤 기반 리빌/패럴랙스, View Transitions
- **C. 레이아웃 리듬 도입** — 전 섹션 동일 1120px 중앙 정렬을 깨고 편집형 변주 추가
- **D. 다크 모드** — `light-dark()` 기반. 지금 가장 크게 비어 있는 항목

---

## 1. 현재 디자인 점검

### 1.1 유지해야 할 자산 (건드리지 말 것)

| 자산 | 위치 | 평가 |
|---|---|---|
| OKLCH 브랜드 팔레트 | `style.css:34-55` | 딥그린/아이보리/골드 조합이 골프 클럽 포지셔닝과 정확히 맞음. 색상 자체는 손댈 필요 없음 |
| `@layer` 캐스케이드 구조 | `style.css:1` | `reset, tokens, base, components, utilities` — 규율이 잡혀 있음. 여기에 `motion` 레이어만 추가하면 됨 |
| 세리프/산세리프 페어링 | Cormorant Garamond + Inter + Noto Sans KR | 헤리티지 감성에 적합. 조합은 유지, **크기 체계만** 재설계 |
| 손그림 SVG 코스 오너먼트 | `style.css:417-477` | 이 사이트만의 차별점. 템플릿 느낌을 상쇄하는 요소이므로 확대 활용 권장 |
| `word-break: keep-all` | `style.css:73` | 한국어 줄바꿈 처리로 필수. 유지 |
| `prefers-reduced-motion` 대응 | `style.css:3043-3057` | 이미 있음. 모션을 늘려도 이 방어막이 있어 안전 |

### 1.2 측정된 수치

```
font-size 선언       108개 / 고유 24종  ← 그중 44개가 12px 이하
clamp() 사용         3회 (3,800줄 중)
gap 값               고유 23종  (3,4,6,7,8,9,10,12,14,16,18,20,22,28,30,34,46,54,70px ...)
padding 값           고유 38종
box-shadow           고유 14종 (대부분 1레이어)
border-radius        고유 12종 (999px, 2px, 3, 5, 6, 8, 10, 12, 14, 16, 18px ...)
transition           16개 — 전부 `ease`
@keyframes           0개
cubic-bezier         0개
oklch() 리터럴       159회 / 고유 127종   ← 토큰은 20개뿐
@media 블록          13개
@container 블록      1개  (container-type은 모든 .site-section에 선언됨)
```

### 1.3 문제점

---

#### D-01. 타이포그래피에 스케일이 없고, 글자가 너무 작습니다 · **심각**

`font-size` 선언 108개 중 **44개가 12px 이하**(12px 25회, 11px 15회, 10px 4회)입니다. 고유 크기는 24종인데 23·26·29·30·33·34·36·38px처럼 근거 없는 값이 섞여 있습니다 — 모듈러 스케일이 아니라 그때그때 눈으로 맞춘 값입니다.

동시에 **유동 타이포가 거의 없습니다.** 3,800줄에서 `clamp()`는 3회뿐이고, 그중 폰트 크기는 1개입니다.

```css
/* style.css:509 — 히어로 제목이 고정 60px */
.hero-copy h1 {
  font-size: 60px;
  line-height: 1.1;
}
```

브레이크포인트가 760px과 1100px이므로, **761px~1100px 구간에서 60px 제목이 그대로 유지**됩니다. 태블릿 가로·작은 노트북에서 제목이 화면을 짓누릅니다.

작은 글씨 문제는 미학이 아니라 **가독성 문제**입니다. 회원 구성상 40~50대 비중이 높은 사내 동호회에서 11px 본문 인접 텍스트는 실제로 읽기 어렵습니다.

> **개선:** 유동 모듈러 스케일 도입(§3.1). 가독 텍스트 하한을 **14px**로 올리고, 라벨/키커류만 12px 허용. 10~11px은 전면 폐지.

---

#### D-02. 모션이 존재하지 않는 수준입니다 · **심각**

전체 스타일시트에 `@keyframes` **0개**, `cubic-bezier()` **0개**입니다. 트랜지션 16개가 전부 브라우저 기본 `ease`이고 대부분 160~180ms입니다.

```css
/* style.css:686 — 전 버튼 공통. 커스텀 이징 없음 */
transition: border-color 160ms ease, color 160ms ease, background 160ms ease, transform 160ms ease;
```

`ease`는 대칭에 가까운 곡선이라 "기계적"으로 느껴집니다. 최신 UI의 고급스러움은 대부분 **비대칭 이징**(빠르게 출발해 길게 감속)에서 나옵니다. 이징 토큰 4개만 도입해도 체감 품질이 크게 올라갑니다.

리빌 애니메이션도 전 요소가 동일합니다:

```css
/* style.css:2395-2400 — 모든 리빌이 동일한 18px 페이드업 */
.reveal-ready {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 520ms ease, transform 520ms ease;
}
```

`data-reveal`이 붙은 **26개 요소가 전부 똑같이** 18px 올라오며 나타납니다. 계층(제목 → 본문 → 카드)에 따른 안무가 없고, 지연도 `Math.min(index * 35, 180)`(`main.js:1186`)으로 **문서 순서 기준 최대 180ms에서 잘립니다** — 즉 6번째 이후 요소는 전부 동시에 나타납니다.

> **개선:** `motion` 레이어 신설 + 이징 토큰(§3.3), 스크롤 기반 리빌로 교체(§4.1).

---

#### D-03. 스크롤 진행바가 매 스크롤마다 강제 리플로우를 유발합니다 · **심각(성능)**

```js
// main.js:1208-1221
const update = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const value = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progress.style.setProperty("--progress", value.toFixed(4));
};
window.addEventListener("scroll", update, { passive: true });
```

`scrollHeight` 읽기는 **레이아웃을 강제로 동기 계산**시킵니다. 이걸 스크롤 이벤트마다(초당 수십~수백 회) 실행합니다. `HOMEPAGE_REVIEW.md`의 H-18로 이미 지적됐고 **아직 미해결**입니다.

이건 CSS 한 줄로 완전히 없앨 수 있는 코드입니다(§4.1) — 성능 수정과 디자인 현대화가 같은 작업으로 해결되는 드문 경우입니다.

> **개선:** `animation-timeline: scroll()` 로 대체하고 `initScrollProgress()` 전체 삭제.

---

#### D-04. 다크 모드가 전혀 없습니다 · **높음**

`prefers-color-scheme` 검색 결과 **0건**입니다. 2026년 기준으로 사용자가 가장 즉각적으로 "옛날 사이트"라고 느끼는 지점입니다. 특히 야간에 휴대폰으로 볼 때 아이보리 배경(`oklch(96% ...)`)이 그대로 최대 밝기로 뜹니다.

동호회 사이트 특성상 **저녁 라운드 후 사진 확인**이 주요 사용 시나리오인데, 정확히 그 시간대에 가장 불편합니다.

> **개선:** `light-dark()` 기반 다크 팔레트(§3.2). 토큰이 정리되면 추가 작업량은 토큰 블록 하나 수준입니다.

---

#### D-05. 색상 토큰이 시스템으로 작동하지 않습니다 · **높음**

토큰은 20개인데 스타일시트에는 **`oklch()` 리터럴이 159회, 고유 127종** 등장합니다. 즉 실제 색의 86%가 시스템 밖에 있습니다.

```css
/* 같은 골드의 투명도 변주가 곳곳에 손으로 반복됨 */
oklch(88% 0.034 86 / 0.42)   /* style.css:527 */
oklch(88% 0.034 86 / 0.28)   /* style.css:540 */
oklch(88% 0.034 86 / 0.64)   /* style.css:565 */
oklch(88% 0.034 86 / 0.54)   /* style.css:710 */
oklch(88% 0.034 86 / 0.48)   /* style.css:3065 */
```

`color-mix()`(2023년부터 전 브라우저 지원)를 쓰면 이 다섯 줄이 파생 표현 하나로 정리됩니다. 그림자 14종·간격 61종이 생긴 근본 원인도 같습니다 — **파생할 수단이 없으니 복사해서 쓴 것**입니다.

토큰 블록 자체에도 정리되지 않은 흔적이 있습니다:

```css
/* style.css:42 — 두 선언이 한 줄에 붙어 있음 */
--gold-soft: oklch(88% 0.034 86 / ...);    --ink: oklch(18% 0.035 155);
```

> **개선:** `color-mix(in oklab, ...)` 파생 팔레트(§3.2).

---

#### D-06. `font-weight: 900`이 30회 쓰이는데 해당 폰트가 로드되지 않습니다 · **높음(실제 버그)**

```html
<!-- index.html:28 — Inter는 500,600,700,800만 로드 -->
<link href="...family=Inter:wght@500;600;700;800&family=Noto+Sans+KR:wght@400;500;700;800..." />
```

```css
/* style.css — font-weight: 900 이 30회 등장 */
.section-kicker { font-weight: 900; }
```

900 굵기 페이스가 없으므로 브라우저가 800으로 대체하거나 **가짜 볼드(faux bold)를 합성**합니다. 합성 볼드는 자간·획 굵기가 뭉개져 특히 작은 대문자 키커(12px/900)에서 지저분하게 보입니다. 지금 키커가 어딘가 탁해 보이는 이유입니다.

또한 900은 그 자체로 과합니다. 프리미엄 클럽 톤에는 **600~700 + 넓은 자간**이 맞습니다.

> **개선:** 키커/라벨을 `font-weight: 650` + `letter-spacing: 0.14em`으로. 900 전량 제거.

---

#### D-07. 컨테이너 쿼리를 선언만 하고 쓰지 않습니다 · **중간**

```css
/* style.css:153-158 — 모든 섹션이 컨테이너로 등록됨 */
.site-section {
  container-type: inline-size;
}
```

그런데 `@container` 규칙은 전체에서 **1개**(`style.css:2407`)뿐이고, 대신 `@media` 블록 13개가 컴포넌트 단위 반응형을 처리합니다. 특히 `max-width: 760px` 블록이 **7개로 분산**되어 있어 한 컴포넌트의 반응형 동작을 파악하려면 파일 곳곳을 뒤져야 합니다.

인프라 비용(`container-type`은 레이아웃 격리 비용이 있음)은 이미 내고 있는데 이득은 못 받는 상태입니다.

> **개선:** 카드류(archive/member/principle)를 `@container` 기반으로 이관. 뷰포트가 아니라 **슬롯 크기**에 반응하게 만들면 §5의 비대칭 레이아웃이 가능해집니다.

---

#### D-08. 모든 섹션이 동일한 폭·동일한 리듬입니다 · **중간(체감 큼)**

9개 섹션 전부 `width: var(--section)` = `min(1120px, 100% - 48px)` 중앙 정렬이고, `principles`와 `archive`가 똑같은 3열 그리드입니다. 전면 이미지(`image-statement`) 하나를 빼면 **위에서 아래로 같은 폭의 상자가 반복**됩니다.

부품 하나하나는 잘 만들어졌는데 전체가 "템플릿"으로 읽히는 가장 큰 원인이 이것입니다. 요즘 사이트가 세련돼 보이는 건 개별 카드가 예뻐서가 아니라 **폭·정렬·밀도가 섹션마다 변주**되기 때문입니다.

> **개선:** 편집형 리듬 도입(§5) — 풀블리드 브레이크, 비대칭 오프셋, 스티키 스크롤 구간.

---

#### D-09. 깊이 표현이 얕고 일관성이 없습니다 · **중간**

그림자 14종이 대부분 단일 레이어입니다.

```css
box-shadow: 0 16px 36px oklch(18% 0.04 155 / 0.08);   /* 3회 */
box-shadow: 0 14px 34px oklch(18% 0.04 155 / 0.08);   /* 2회 — 위와 2px 차이 */
box-shadow: 0 18px 38px oklch(18% 0.04 155 / 0.12);   /* 1회 */
box-shadow: 0 18px 36px oklch(14% 0.05 155 / 0.18);   /* 1회 */
```

사실상 같은 그림자를 미세하게 다르게 6번 적어놓은 셈입니다. 그리고 실제 물체의 그림자는 **접촉 그림자(짧고 진함) + 환경 그림자(넓고 옅음)** 2겹인데, 여기엔 넓고 옅은 쪽만 있습니다. 그래서 카드가 "떠 있다"기보다 "흐릿하게 번져 있다"는 인상을 줍니다.

`GEMINI.md`가 명시한 *"Multi-layered drop shadows create a strong sense of depth"* 와 *"subtle noise texture"* 는 **둘 다 미구현**입니다.

> **개선:** 2단 그림자 토큰 3종(§3.4) + 미세 노이즈 텍스처.

---

#### D-10. 모서리 반경 언어가 서로 모순됩니다 · **중간**

```
999px  11회   ← 완전 둥근 (pill)
2px     7회   ← 거의 각진 (버튼)
3,5,6,8,10,12,14,16,18px  ← 각 1~4회
```

버튼은 2px로 "샤프한 편집 디자인"을 말하는데 카드는 10~18px로 "부드러운 모던 UI"를 말합니다. **한 화면에서 두 언어가 충돌**합니다.

브랜드 포지셔닝(프리미엄 클럽, 세리프 제목, 얇은 1px 보더)을 보면 **샤프한 쪽이 맞습니다.**

> **개선:** 3단계로 통일 — `--r-sharp: 3px`(버튼/입력), `--r-card: 6px`(카드/패널), `--r-pill: 999px`(태그/아바타). 나머지 9종 폐지.

---

#### D-11. 이미지에 크기 정보와 반응형 소스가 없습니다 · **중간(성능 + 시각)**

```
main.js 내  srcset / sizes  →  0건
main.js 내  width / height  →  1건
```

모든 카드 이미지가 로드되며 레이아웃을 밀어냅니다(CLS). 아카이브 그리드처럼 이미지 카드가 여러 개 있는 섹션에서 스크롤 중 화면이 튑니다 — 아무리 카드를 잘 디자인해도 이 튐 하나가 "완성도 낮음"으로 읽힙니다.

`HOMEPAGE_REVIEW.md` H-15로 이미 지적됐고 미해결입니다. `images/` 디렉터리에 `-thumb`/`-display` 2종이 이미 준비돼 있으므로 **`srcset` 연결만 하면 됩니다.**

> **개선:** 전 이미지에 `width`/`height` + `aspect-ratio`, 기존 thumb/display로 `srcset` 구성.

---

#### D-12. `outline: none`이 10회, 실제 포커스 링은 3종뿐입니다 · **중간(접근성)**

```
outline: none                                    10회
outline: 3px solid oklch(45% 0.105 150 / 0.16)    2회
outline: 3px solid var(--gold)                    1회
```

`:focus-visible` 규칙이 30개 있어 대부분은 대체 스타일이 있지만, `outline: none` 10곳 전부가 커버되는지는 확인이 필요합니다. 그리고 포커스 표현이 outline/box-shadow/border-color로 제각각이라 **키보드 사용자가 "지금 어디에 있는지" 학습할 수 없습니다.**

> **개선:** `--focus-ring` 토큰 1종으로 통일. `:focus-visible`에서만 노출.

---

#### D-13. `overflow-x: hidden` 임시방편 · **낮음**

```css
/* style.css:72 */
body { overflow-x: hidden; }
```

가로 넘침을 근본 해결하지 않고 잘라내는 방식입니다. 부작용으로 자식 요소의 `position: sticky`가 조용히 작동하지 않을 수 있어 §5의 스티키 레이아웃 도입 시 걸림돌이 됩니다.

실제 넘침 유발 후보를 찾아보면 음수 `inset`이 8곳 있고, 그중 뷰포트 단위를 쓰는 곳이 가장 위험합니다.

```css
/* style.css:2571-2575 — 모바일(≤760px)의 .hero-course-svg. 확정적 원인 */
.hero-course-svg {
  inset: 18px -38vw auto auto;   /* 뷰포트 폭의 38%만큼 오른쪽으로 밀어냄 */
  width: 118vw;                  /* + 화면보다 18% 넓음 */
}
```

`118vw` 요소를 `-38vw` 위치에 두었으므로 **모바일에서 가로 넘침은 설계상 확정**입니다. 지금 `overflow-x: hidden`이 이걸 가리고 있습니다. 나머지 후보는 아래 4곳입니다.

```css
style.css:427    inset: 32px max(30px, calc((100vw - 1120px) / 2)) auto auto;
style.css:1109   inset: -58px -70px auto auto;
style.css:840    inset: auto -40px -58px auto;
style.css:1335   inset: auto -34px -48px auto;
```

> **개선:** 위 5곳을 `overflow: clip`을 가진 지역 컨테이너 안으로 옮기거나 `clamp()`로 제한한 뒤, `body`의 전역 `overflow-x: hidden`을 제거.

---

## 2. 개선 컨셉

> **"Quiet Luxury, in motion"**
> 조용한 고급스러움 — 색과 형태는 지금보다 **덜** 주장하고, 움직임과 여백이 품질을 말하게 합니다.

세 가지 원칙:

1. **색은 줄이고 대비는 키운다.** 골드를 지금처럼 전면에 뿌리지 않고 강조점에만 씁니다. 골드가 20곳에 있으면 아무 데도 강조가 아닙니다.
2. **움직임은 느리고 무겁게.** 160ms 딸깍임이 아니라 400~700ms의 묵직한 감속. 프리미엄 감각은 속도가 아니라 **관성**에서 옵니다.
3. **여백에 위계를 준다.** 지금은 모든 섹션이 `clamp(64px, 8vw, 110px)`로 동일합니다. 챕터 경계는 넓게, 관련 블록은 좁게.

---

## 3. 토큰 시스템 재설계

### 3.1 유동 타이포 스케일

1.25(major third) 비율의 유동 스케일. **모든 단계가 뷰포트에 따라 연속 변화**하므로 브레이크포인트 사이에서 어색해지는 구간이 사라집니다.

```css
@layer tokens {
  :root {
    /* 320px → 1440px 구간에서 유동. 하한을 14px로 올려 가독성 확보 */
    --text-2xs: clamp(0.75rem, 0.73rem + 0.10vw, 0.8125rem);   /* 12 → 13  라벨/키커 전용 */
    --text-xs:  clamp(0.875rem, 0.85rem + 0.12vw, 0.9375rem);  /* 14 → 15  캡션 하한 */
    --text-sm:  clamp(0.9375rem, 0.90rem + 0.18vw, 1rem);      /* 15 → 16 */
    --text-base:clamp(1rem, 0.96rem + 0.22vw, 1.125rem);       /* 16 → 18  본문 */
    --text-lg:  clamp(1.125rem, 1.05rem + 0.36vw, 1.375rem);   /* 18 → 22 */
    --text-xl:  clamp(1.375rem, 1.22rem + 0.75vw, 1.75rem);    /* 22 → 28  h3 */
    --text-2xl: clamp(1.75rem, 1.45rem + 1.5vw, 2.5rem);       /* 28 → 40  h2 */
    --text-3xl: clamp(2.25rem, 1.55rem + 3.5vw, 4rem);         /* 36 → 64  h1 */

    --leading-tight: 1.12;
    --leading-snug:  1.35;
    --leading-body:  1.65;

    --tracking-kicker: 0.14em;
    --tracking-tight: -0.015em;
  }
}
```

한국어 조판 보완 — 기존 `word-break: keep-all`과 함께 씁니다.

```css
@layer base {
  h1, h2, h3 {
    text-wrap: balance;              /* 제목 줄 길이 균등 배분 */
    letter-spacing: var(--tracking-tight);
  }
  p {
    text-wrap: pretty;               /* 고아 단어 방지 (미지원 브라우저는 무시) */
  }
}
```

**적용 효과:** D-01 해소. `font-size` 선언 108개 → 토큰 8종 참조로 수렴. 히어로 제목이 761~1100px 구간에서도 자연스럽게 축소됩니다.

### 3.2 파생 팔레트 + 다크 모드

```css
@layer tokens {
  :root {
    color-scheme: light dark;

    /* 원색 — 기존 값 유지 (브랜드 자산) */
    --green-900: oklch(24% 0.062 158);
    --green-700: oklch(31% 0.076 154);
    --green-500: oklch(40% 0.088 152);
    --gold-500:  oklch(64% 0.082 72);
    --ivory-100: oklch(96% 0.025 84);
    --paper-50:  oklch(98% 0.012 88);
    --ink-900:   oklch(18% 0.035 155);

    /* 파생 — 127개 리터럴을 여기서 흡수 */
    --gold-a10: color-mix(in oklab, var(--gold-500) 10%, transparent);
    --gold-a24: color-mix(in oklab, var(--gold-500) 24%, transparent);
    --gold-a48: color-mix(in oklab, var(--gold-500) 48%, transparent);
    --line:     color-mix(in oklab, var(--ink-900) 14%, transparent);
    --line-strong: color-mix(in oklab, var(--ink-900) 26%, transparent);

    /* 의미 토큰 — 라이트/다크가 여기서 갈림 */
    --bg-page:    light-dark(var(--ivory-100), oklch(16% 0.022 158));
    --bg-surface: light-dark(var(--paper-50),  oklch(21% 0.026 156));
    --bg-raised:  light-dark(oklch(100% 0 0),  oklch(25% 0.030 155));
    --fg-primary: light-dark(var(--ink-900),   oklch(94% 0.014 92));
    --fg-muted:   light-dark(oklch(38% 0.028 150), oklch(72% 0.020 100));
    --accent:     light-dark(var(--gold-500),  oklch(74% 0.090 76));
  }
}
```

다크 모드에서 골드를 `64% → 74%`로 올리는 게 핵심입니다. 어두운 배경에서 원래 골드는 탁해 보입니다.

**적용 효과:** D-04, D-05 해소. 다크 모드가 **토큰 블록 하나**로 끝납니다(컴포넌트가 의미 토큰만 참조하므로).

### 3.3 간격 램프 + 모션 토큰

```css
@layer tokens {
  :root {
    /* 4pt 기반 7단계 — 기존 간격 61종을 흡수 */
    --sp-1: 0.25rem;  --sp-2: 0.5rem;   --sp-3: 0.75rem;  --sp-4: 1rem;
    --sp-5: 1.5rem;   --sp-6: 2rem;     --sp-7: 3rem;     --sp-8: 4.5rem;

    /* 섹션 리듬에 위계 부여 (D-08 대응) */
    --section-gap-tight: clamp(2.5rem, 4vw, 4rem);
    --section-gap-base:  clamp(4rem, 8vw, 7rem);
    --section-gap-loose: clamp(6rem, 12vw, 11rem);

    /* 이징 — 전부 비대칭 감속 곡선 */
    --ease-out:   cubic-bezier(0.22, 1, 0.36, 1);      /* 기본 진입 */
    --ease-inout: cubic-bezier(0.65, 0, 0.35, 1);      /* 상태 전환 */
    --ease-soft:  cubic-bezier(0.33, 1, 0.68, 1);      /* 호버 */
    --ease-spring:cubic-bezier(0.34, 1.56, 0.64, 1);   /* 살짝 오버슈트 */

    --dur-fast: 200ms;
    --dur-base: 400ms;
    --dur-slow: 700ms;
  }
}
```

**적용 효과:** D-02 해소 시작. 버튼 트랜지션을 `160ms ease` → `var(--dur-fast) var(--ease-soft)`로 바꾸는 것만으로 체감이 달라집니다.

### 3.4 2단 그림자 + 반경 통일

```css
@layer tokens {
  :root {
    /* 접촉 그림자 + 환경 그림자 2겹 (D-09) */
    --elev-1:
      0 1px 2px color-mix(in oklab, var(--ink-900) 8%, transparent),
      0 8px 24px color-mix(in oklab, var(--ink-900) 6%, transparent);
    --elev-2:
      0 2px 4px color-mix(in oklab, var(--ink-900) 10%, transparent),
      0 16px 40px color-mix(in oklab, var(--ink-900) 10%, transparent);
    --elev-3:
      0 4px 8px color-mix(in oklab, var(--ink-900) 12%, transparent),
      0 32px 72px color-mix(in oklab, var(--ink-900) 16%, transparent);

    /* 반경 3단계로 통일 (D-10) */
    --r-sharp: 3px;   /* 버튼, 입력 */
    --r-card:  6px;   /* 카드, 패널 */
    --r-pill:  999px; /* 태그, 아바타 */

    --focus-ring: 0 0 0 3px var(--bg-page), 0 0 0 5px var(--accent);  /* D-12 */
  }
}
```

미세 노이즈 텍스처 — `GEMINI.md`가 요구했으나 미구현 상태인 항목입니다. 외부 이미지 없이 SVG 데이터 URI로 처리합니다.

```css
@layer base {
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0.028;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
}
```

---

## 4. 최신 효과 적용안

### 4.1 스크롤 기반 애니메이션 (JS 제거 + 성능 개선)

**(a) 스크롤 진행바 — `main.js`의 `initScrollProgress()` 전체를 대체합니다.**

```css
@layer motion {
  .scroll-progress {
    transform-origin: left center;
    scale: 0 1;
    animation: progress-grow linear both;
    animation-timeline: scroll(root block);
  }
  @keyframes progress-grow { to { scale: 1 1; } }
}
```

이 4줄이 `main.js:1208-1221`(14줄) + 스크롤 리스너 1개를 없애고, **D-03의 강제 리플로우를 완전히 제거**합니다. 애니메이션이 컴포지터 스레드에서 돌아 메인 스레드를 전혀 건드리지 않습니다.

**(b) 리빌 — IntersectionObserver 없이, 계층별 안무 포함.**

```css
@layer motion {
  [data-reveal] {
    animation: reveal-in var(--dur-slow) var(--ease-out) both;
    animation-timeline: view();
    animation-range: entry 5% cover 28%;
  }
  @keyframes reveal-in {
    from { opacity: 0; transform: translateY(28px) scale(0.985); }
    to   { opacity: 1; transform: none; }
  }

  /* 계층 안무 — 제목이 먼저, 카드가 순차로 (D-02) */
  [data-reveal-stagger] > * {
    animation: reveal-in var(--dur-base) var(--ease-out) both;
    animation-timeline: view();
    animation-range: entry 10% cover 32%;
  }
  [data-reveal-stagger] > *:nth-child(2) { animation-range: entry 14% cover 36%; }
  [data-reveal-stagger] > *:nth-child(3) { animation-range: entry 18% cover 40%; }
}
```

**(c) 히어로 패럴랙스 — 사진이 카피보다 느리게 흐릅니다.**

```css
@layer motion {
  .hero-media img {
    animation: hero-drift linear both;
    animation-timeline: view(block);
    animation-range: entry 0% exit 100%;
  }
  @keyframes hero-drift {
    from { transform: translateY(-3%) scale(1.06); }
    to   { transform: translateY(3%) scale(1.06); }
  }
}
```

> **⚠️ 브라우저 지원:** 스크롤 기반 애니메이션은 Chrome/Edge/Safari에서 동작하지만 **Firefox는 기본 비활성**입니다. 따라서 **점진적 향상으로만** 적용합니다 — `@supports (animation-timeline: view())`로 감싸고, 미지원 브라우저는 기존 IntersectionObserver 경로를 유지합니다. 진행바는 미지원 시 그냥 숨깁니다(기능 손실 없음).

### 4.2 View Transitions

현재 히어로 슬라이드는 **120ms `setTimeout`으로 투명도를 껐다가 `src`를 바꾸고 다시 켜는** 방식입니다(`main.js:1257-1267`). 타이머와 실제 이미지 디코딩 시점이 맞지 않아 느린 네트워크에서는 빈 프레임이 보입니다. 아카이브 → 라이트박스도 즉시 전환입니다.

View Transitions는 이 타이밍 문제를 **브라우저가 대신 처리**해 줍니다.

```css
@layer motion {
  ::view-transition-group(*) {
    animation-duration: var(--dur-base);
    animation-timing-function: var(--ease-inout);
  }
}
```

```js
// 라이트박스 열기 — 썸네일이 확대되며 이어지는 전환
const openLightbox = (card) => {
  if (!document.startViewTransition) return renderLightbox(card);   // 폴백

  // 전환에 참여할 두 요소에만 같은 이름을 부여했다가 끝나면 해제합니다.
  const thumb = card.querySelector("img");
  thumb.style.viewTransitionName = "archive-photo";

  const transition = document.startViewTransition(() => renderLightbox(card));
  transition.finished.finally(() => { thumb.style.viewTransitionName = ""; });
};
```

`view-transition-name`은 **문서 안에서 유일해야** 하므로, 아카이브 카드 전체에 미리 부여하지 않고 전환 직전에만 붙였다 떼는 방식이 안전합니다.

카드 썸네일이 라이트박스 위치로 **자연스럽게 확대 이동**합니다. 최근 사이트가 "앱 같다"고 느껴지는 효과의 핵심이고, 구현 비용은 위 정도입니다.

### 4.3 `@starting-style` — 진입 애니메이션에서 JS 클래스 제거

```css
@layer motion {
  dialog[open], [popover]:popover-open {
    opacity: 1;
    translate: 0 0;
    transition: opacity var(--dur-base) var(--ease-out),
                translate var(--dur-base) var(--ease-out),
                overlay var(--dur-base) allow-discrete,
                display var(--dur-base) allow-discrete;
  }
  @starting-style {
    dialog[open], [popover]:popover-open { opacity: 0; translate: 0 16px; }
  }
}
```

모달 진입/퇴장 애니메이션을 위해 JS에서 클래스를 토글하던 코드가 필요 없어집니다.

### 4.4 Popover API로 모바일 메뉴 · 모달 재구성

`HOMEPAGE_REVIEW.md` **H-08(모달에 포커스 트랩 없음, 배경 비활성화 안 됨)** 이 미해결 상태입니다. Popover API와 `<dialog showModal()>`은 **포커스 트랩·배경 불활성(inert)·ESC 닫기·상단 레이어를 브라우저가 기본 제공**합니다.

```html
<button popovertarget="mobileNav" aria-label="메뉴 열기">…</button>
<nav id="mobileNav" popover="auto">…</nav>
```

**디자인 개선과 접근성 결함 해소가 같은 작업으로 처리되는 항목입니다.**

### 4.5 컨테이너 쿼리 실사용 + `:has()`

```css
/* 카드가 뷰포트가 아니라 자기 슬롯 크기에 반응 (D-07) */
@container (min-width: 30rem) {
  .archive-card { grid-template-columns: 12rem 1fr; }
}

/* 사진 없는 카드는 자동으로 텍스트 레이아웃 — JS 분기 불필요 */
.archive-card:not(:has(img)) { --card-pad: var(--sp-6); }

/* 검색 결과 없을 때 안내 노출 — HOMEPAGE_REVIEW H-14 해소 */
.member-grid:not(:has(.member-card:not(.is-hidden))) + .member-empty { display: block; }
```

### 4.6 정제된 글래스모피즘

`backdrop-filter`가 이미 5곳에 있습니다. 이걸 **시스템화**합니다 — 단, 헤더처럼 텍스트가 얹히는 곳은 대비 확보를 위해 반드시 불투명 폴백을 둡니다.

```css
@layer components {
  .glass {
    background: color-mix(in oklab, var(--bg-surface) 78%, transparent);
    border: 1px solid color-mix(in oklab, var(--fg-primary) 10%, transparent);
  }
  @supports (backdrop-filter: blur(1px)) {
    .glass {
      background: color-mix(in oklab, var(--bg-surface) 52%, transparent);
      backdrop-filter: blur(20px) saturate(1.4);
    }
  }
}
```

---

## 5. 레이아웃 리듬 (D-08)

지금의 "동일 폭 상자 9개 수직 반복"을 아래처럼 변주합니다. **HTML 구조 변경은 최소**로 하고 주로 CSS 그리드로 처리합니다.

```
현재                          제안
─────────────────────         ─────────────────────
[  헤더        ]              [  헤더        ]
[  히어로 1120 ]              [  히어로 풀블리드 + 패럴랙스 ]
[  인트로 1120 ]              [    인트로 (좁게 720, 여백↑)  ]   ← 호흡
[  원칙  1120 3열]            [  원칙 — 비대칭 오프셋 3열    ]   ← 계단식
[  이미지 풀블리드]           [  이미지 스티키 + 텍스트 스크롤 ]  ← 앵커
[  일정  1120 ]               [  일정 1120                   ]
[  회원  1120 ]               [  회원 — 컨테이너 쿼리 벤토    ]
[  기록  1120 3열]            [  기록 풀블리드 + 가로 스냅     ]   ← 대비
[  방명록 1120 ]              [    방명록 (좁게 720)          ]
[  가입  1120 ]               [  가입 풀블리드 딥그린         ]
```

핵심 도구는 그리드 명명 라인 하나입니다 — 모든 섹션을 감싸면 `full`/`wide`/`text` 폭을 자식이 골라 쓸 수 있습니다.

```css
@layer base {
  main {
    display: grid;
    grid-template-columns:
      [full-start] minmax(var(--sp-5), 1fr)
      [wide-start] minmax(0, 1120px)
      [text-start] minmax(0, 720px) [text-end]
      minmax(0, 1120px) [wide-end]
      minmax(var(--sp-5), 1fr) [full-end];
  }
  main > * { grid-column: wide; }          /* 기본 */
  .is-full { grid-column: full; }          /* 히어로 · 기록 · 가입 */
  .is-text { grid-column: text; }          /* 인트로 · 방명록 */
}
```

스티키 이미지 구간(§5의 "앵커"):

```css
@layer components {
  .image-statement {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-7);
  }
  .image-statement img {
    position: sticky;
    top: calc(var(--header-height) + var(--sp-5));
    aspect-ratio: 4 / 5;
    object-fit: cover;
    border-radius: var(--r-card);
  }
}
```

> ⚠️ 스티키를 쓰려면 **D-13(`body { overflow-x: hidden }`)을 먼저 제거**해야 합니다. 순서가 중요합니다.

---

## 6. 실행 로드맵

각 단계는 **독립적으로 배포 가능**하며, 앞 단계가 뒤 단계의 전제입니다.

### Phase 0 — 기반 정리 (반나절) · 시각적 변화 거의 없음

| 작업 | 해소 | 파일 |
|---|---|---|
| 토큰 블록 재작성 (§3.1~3.4) | D-01, D-05, D-09, D-10, D-12 | `style.css:32-56` |
| `font-weight: 900` → `650/700` 일괄 치환 (30곳) | **D-06 버그** | `style.css` 전역 |
| `@layer` 선언에 `motion` 추가 | — | `style.css:1` |
| 이미지 `width`/`height`/`srcset` 부여 | D-11 | `main.js` |

> 이 단계만으로도 **폰트 합성 볼드 버그와 CLS가 사라집니다.** 리스크가 가장 낮고 이득이 즉시 나오는 구간입니다.

### Phase 1 — 타이포 · 색 이관 (1일) · 체감 변화 시작

- 108개 `font-size` 선언을 토큰 8종으로 이관, 10~11px 전량 폐지
- 127개 `oklch()` 리터럴을 의미 토큰 + `color-mix()`로 흡수
- 61종 간격을 `--sp-*` 8단계로 정리
- `text-wrap: balance / pretty` 적용
- **다크 모드 활성화** (토큰 이관이 끝나면 거의 공짜로 따라옴) — D-04

### Phase 2 — 모션 (1~2일) · 가장 큰 체감 개선

- 트랜지션 16개를 이징 토큰으로 교체
- 스크롤 기반 리빌 도입, `@supports`로 감싸고 IntersectionObserver는 폴백으로 유지
- **`initScrollProgress()` 삭제** → D-03 성능 결함 해소
- 히어로 패럴랙스 + 계층 안무
- View Transitions (히어로 슬라이드 · 아카이브 라이트박스)

### Phase 3 — 구조 (2~3일) · 리스크 가장 높음

- `body { overflow-x: hidden }` 제거 + 넘침 유발 요소 개별 수정 (D-13)
- `main` 명명 그리드 도입, 섹션별 폭 변주 (D-08)
- 스티키 이미지 구간
- 카드류를 `@container`로 이관, `max-width:760px` 블록 7개 통합 (D-07)
- Popover API / `<dialog>` 전환 → **H-08 포커스 트랩 결함 동시 해소**

**총 예상: 4.5~6.5일**

---

## 7. 브라우저 지원 및 리스크

| 기능 | 지원 상태 | 대응 |
|---|---|---|
| `color-mix()` | 전 브라우저 (2023~) | 무조건 사용 가능 |
| 컨테이너 쿼리 | 전 브라우저 (2023~) | 무조건 사용 가능 |
| `:has()` | 전 브라우저 (2023~) | 무조건 사용 가능 |
| `light-dark()` | 전 브라우저 (2024~) | 무조건 사용 가능 |
| `@starting-style` | 전 브라우저 (2024~) | 무조건 사용 가능 |
| Popover API | 전 브라우저 (2024~) | 무조건 사용 가능 |
| `text-wrap: balance` | 전 브라우저 | 사용 가능 |
| `text-wrap: pretty` | Chrome · Safari | 점진적 향상 (미지원 시 무시됨, 무해) |
| **스크롤 기반 애니메이션** | **Chrome · Edge · Safari / Firefox 기본 비활성** | **`@supports` 필수 + IntersectionObserver 폴백 유지** |
| **View Transitions** | **Chrome · Edge · Safari** | **`document.startViewTransition` 존재 확인 후 호출** |
| CSS 앵커 포지셔닝 | Chrome 계열 위주 | 이번 범위에서 **제외** |

**주요 리스크 3가지:**

1. **Phase 3의 `overflow-x` 제거** — D-13에 정리한 5곳(특히 `style.css:2572`의 `-38vw`)을 먼저 처리해야 합니다. 이 단계는 반드시 실기기에서 가로 스크롤이 생기지 않는지 확인한 뒤 배포해야 합니다.
2. **모션 과잉** — 패럴랙스와 리빌을 동시에 넣으면 산만해질 수 있습니다. **패럴랙스는 히어로와 image-statement 2곳으로만 제한**하는 것을 권합니다.
3. **Firefox에서의 차이** — 스크롤 기반 애니메이션 미동작 시 리빌이 사라지므로, 폴백에서 요소가 **보이는 상태로 남는지** 반드시 확인해야 합니다(사라지면 콘텐츠 유실).

---

## 8. 채택하지 않는 트렌드와 이유

| 트렌드 | 제외 이유 |
|---|---|
| **Three.js / WebGL 3D 히어로** | `AGENTS.md`에 언급되어 있으나 이 사이트에 맞지 않습니다. 주인공은 **회원들의 실제 사진**이어야 합니다. 3D 배경은 사진과 경쟁하고, 모바일 배터리·초기 로딩을 해칩니다 |
| 뉴브루탈리즘 · 두꺼운 검정 테두리 | 프리미엄 클럽 포지셔닝과 정반대 |
| 뉴모피즘 | 대비가 낮아 접근성이 나쁘고 이미 유행이 지났습니다 |
| AI 생성 추상 그라디언트 배경 | 실제 라운드 사진이라는 더 좋은 자산이 있습니다 |
| 무한 스크롤 · 스크롤 하이재킹 | 21명 규모 동호회 사이트에서 정보 접근만 느려집니다 |
| 커서 추적 커스텀 커서 | 모바일 비중이 높고, 접근성 문제만 늘립니다 |
| 다크 모드 **강제** | 사진 중심 사이트라 라이트가 기본이어야 합니다. `prefers-color-scheme` **존중**만 합니다 |

---

## 9. 다음 단계 제안

Phase 0은 **시각적 변화가 거의 없으면서 실제 버그(D-06 폰트, D-11 CLS)를 고치는** 구간이라 먼저 진행하기에 안전합니다.

승인해 주시면 다음 순서로 진행하겠습니다.

1. `TASK.md`에 현재 작업으로 등록 (`AGENTS.md` §3 절차)
2. Phase 0 구현 후 로컬(`npm start`)에서 확인
3. `PROJECT_LOG.md`에 결정 근거 기록
4. Phase 1 이후는 각 단계마다 확인받고 진행

**결정이 필요한 사항:**

- **Phase 3(레이아웃 구조 변경)까지 갈지, Phase 2(모션)에서 멈출지** — Phase 2까지만 해도 체감 개선의 대부분을 얻습니다. Phase 3은 이득도 크지만 회귀 위험도 가장 큽니다.
- **다크 모드 도입 여부** — 도입 시 이후 모든 색상 작업에서 2가지 모드를 함께 확인해야 합니다.

---

*본 문서는 `HOMEPAGE_REVIEW.md`(기능·접근성·성능 진단)와 상호 보완 관계입니다. H-08(포커스 트랩), H-14(검색 결과 없음), H-15(이미지 크기), H-18(강제 리플로우)은 본 계획을 실행하면 함께 해소됩니다.*
