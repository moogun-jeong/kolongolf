# 마이그레이션 및 홈페이지 최종 개선 실행안

- 작성일: 2026-08-10 (UTC)
- 기준 소스: 현재 작업 트리의 `index.html`, `main.js`, `style.css`, `functions/`, `migrations/`, Replit/Cloudflare 설정
- 통합 자료: [`HOMEPAGE_REVIEW.md`](./HOMEPAGE_REVIEW.md), [`REPLIT_MIGRATION_AUDIT.md`](./REPLIT_MIGRATION_AUDIT.md)
- 문서 역할: 두 진단을 검증·보정한 **단일 구현 기준**. 작업 우선순위와 완료 판정은 이 문서를 따른다.

---

## 1. 최종 결론

현재 홈페이지는 전면 리디자인보다 **운영 경계, 데이터 재현성, 콘텐츠 신뢰도, 접근성**을 먼저 바로잡아야 한다. 디자인의 딥그린·아이보리·골드 톤과 Premium & Tactile 감성은 유지하고, 아래 운영 구조로 통일한다.

```text
Replit          주 개발 환경, local D1/R2만 사용하는 전체 스택 미리보기
GitHub          소스 저장소, PR, CI, 릴리스 관문
Cloudflare      단일 운영 프런트엔드 + Pages Functions + D1 + private R2
GitHub Pages    운영 중단. 전환기에만 Cloudflare 대표 URL 안내 페이지 제공
Firebase Studio 과거 설정은 비배포 레거시 자료로 격리
```

핵심 원칙은 다음과 같다.

1. 저장소 루트는 어떤 환경에서도 서비스하지 않고, `dist/`에 명시적으로 허용한 파일만 배포한다.
2. 프런트엔드와 API를 동일 출처로 두어 로컬/운영 API URL 추측 로직과 와일드카드 CORS를 없앤다.
3. D1은 `migrations/`만을 단일 진실 공급원으로 삼고, 운영 DB를 조사·백업하기 전에는 보정 migration을 적용하지 않는다.
4. 사진 binary는 private R2, 텍스트와 media metadata는 D1에 보관한다.
5. 공개 쓰기는 Turnstile·Origin 검증·속도 제한을 적용하고, 관리 기능은 Cloudflare Access 뒤로 분리한다.
6. 화면은 Vanilla JS ES Modules와 Custom Elements를 유지하되, 핵심 본문은 빌드 시 정적 HTML로 프리렌더하고 JS는 상호작용을 향상한다.
7. 일정·회원·참가자·아카이브를 안정적 ID로 연결해, 이름과 행사 정보를 문자열로 반복 입력하지 않는다.

---

## 2. 교차 검증 결과

### 2.1 재확인한 사실

| 영역 | 검증 결과 | 최종 판정 |
| --- | --- | --- |
| 공개 경계 | `wrangler.toml` 출력 디렉터리가 `.`이고, `firebase-debug.log`가 아직 Git 추적 중이다. 2026-08-10 읽기 전용 재검사에서 Cloudflare/GitHub Pages의 로그와 `wrangler.toml`이 HTTP 200을 반환했다. | 즉시 처리할 Release Blocker |
| `robots.txt` | Cloudflare에서 파일 대신 `index.html`이 HTTP 200 `text/html`로 반환되고, GitHub Pages에서는 404이다. | SEO/배포 산출물 오류 확정 |
| Replit 실행 | `.replit` → `npm start` → `scripts/serve.js`이며 API를 띄우지 않는다. 5000 포트는 `getMessageApiBase()`의 local 조건이 아니므로 운영 API를 선택한다. | 즉시 처리할 데이터 안전 문제 |
| 미리보기 서버 | 로컬 재현에서 `/.git/config`, `/.replit`, `AGENTS.md`, migration SQL이 200이었고 malformed URL `/%E0%A4%A`로 프로세스가 `URIError`를 내고 종료됐다. | `serve.js` 안전화보다 제거가 최적 |
| D1 schema | 빈 local D1에 `0001`, `0002`를 적용한 후 현 API의 `status='visible'` INSERT를 실행하면 CHECK constraint로 실패했다. | migration chain 복구 필수 |
| 운영 DB | 운영 GET은 200이지만 이 환경에서 원격 schema와 migration journal은 확인하지 못했다. | 원격 preflight 전 `0003` 적용 금지 |
| 개발 의존성 | 설치 버전은 Wrangler 4.100.0, 2026-08-10 npm registry 최신은 4.120.0이다. `npm audit` 결과는 high 5, low 1이다. | lockfile 포함 업데이트 필수 |
| 공개 API | 두 Function이 `Access-Control-Allow-Origin: *`를 반환한다. 메시지 Turnstile은 secret이 없으면 건너뛰고, 회원 업로드는 Turnstile 검증 자체가 없다. | fail-closed bot 방어와 same-origin 정책 필수 |
| 관리 기능 | 푸터에 공개 버튼이 생성되고, 단일 Bearer token을 `sessionStorage`에 보관한다. 실패 제한은 없다. | UI 숨김이 아닌 인증 경계 필수 |
| R2 필요성 | 업로드당 Base64 문자열 최대 1,200,000자를 D1에 저장하고, 조회는 게시물별 이미지 쿼리를 실행한다. | private R2 + D1 metadata로 이전 |
| 일정/신뢰 | 2026-08-10 기준 일정 영역은 2026-07-04 완료 행사를 다음 모임처럼 안내한다. `하선재`/`허선재` 표기가 공존한다. | 다음 일정 상태와 실명 확인이 콘텐츠 관문 |
| 내용 중복 | 7월 행사 정보가 여러 템플릿에 수작업 복사되어 있다. 회원 수도 `21명`으로 하드코딩되어 있다. | 단일 데이터 모델로 전환 |
| JS 의존 | raw `index.html`의 본문은 빈 Custom Element로만 구성되고 `<noscript>`가 없다. `initPage()`는 개별 오류 격리 없이 13개 init을 순차 실행한다. | 프리렌더 + 개별 초기화 격리 |
| 접근성 | 모달 focus trap/배경 `inert`/안정적 focus return이 없고, 라이트박스 화살표 키가 댓글 입력 중에도 사진을 전환한다. 히어로 자동 재생에 정지 제어가 없다. | 자동 검사 점수와 무관하게 실사용 오류 확정 |
| 탐색/UX | anchor click을 JS가 가로채 URL hash·뒤로 가기·딥링크를 깨뜨린다. 회원 검색에 결과 없음/건수 안내가 없다. | 불필요한 scroll JS 제거, 검색 상태 보강 |
| 성능 | `main.js` 2,258줄, `style.css` 3,763줄, DOM 905개의 기존 측정치가 남아 있다. 아카이브 댓글 수만 알기 위해 8개 API를 호출한다. | API batch, 초기 DOM 축소, 모듈화 |
| media | 템플릿의 `<img>` 9개 중 회원 emoji 1개만 크기가 있고 `srcset`은 0개이다. 7월 display 이미지 합계는 약 2.78MB이다. | 반응형 파생본·고정 크기·manifest 필수 |
| 외부 의존 | Google Fonts 4 family 설정과 jsDelivr Twemoji 21개 URL에 의존한다. | 폰트/emoji self-host 원칙 |
| 개인정보 | 회원 실명·회사 이메일·행사 사진과 IP/UA hash 보존 정책이 문서화되지 않았다. | 공개 최소화·동의·보존/삭제 정책 필수 |

운영 URL에는 읽기 요청만 사용했으며 원격 데이터 쓰기, 삭제, 설정 변경은 수행하지 않았다.

### 2.2 기존 리뷰에서 보정한 내용

| 기존 제안/표현 | 검증 후 최종 판단 |
| --- | --- |
| `HOMEPAGE_REVIEW` 요약의 P1 12개 | H-06~H-22는 17개다. 최종안은 기존 개수 집계를 우선순위 근거로 쓰지 않는다. |
| H-03의 “공유 미리보기가 빈다” | OG title/description/image는 이미 있어 링크 카드 자체가 반드시 비지는 않다. 다만 raw HTML 본문이 빈 것은 JS 실패 회복성과 SEO의 명확한 약점이므로 프리렌더는 유지한다. |
| H-04의 `#admin` 해시 게이트 | 버튼 발견 가능성만 낮출 뿐 보안 경계가 아니다. 관리 페이지와 API를 `/admin/`, `/api/admin/*`로 분리하고 Cloudflare Access로 보호한다. |
| H-09의 캡션 `aria-live="polite"` 상시 적용 | 자동 재생 중 live region은 스크린리더를 지속적으로 방해할 수 있다. autoplay 중은 `off`, 일시정지/사용자 조작 중은 `polite`로 전환한다. |
| H-11의 “노출 11→3” | 화면 노출 횟수는 강제 규칙이 아니다. 핵심 해결책은 수작업 복사를 0으로 만드는 단일 데이터 모델이며, 동일 정보 노출은 각 화면의 명확한 역할이 있을 때만 허용한다. |
| H-12의 “CTA 5개” | JS 향상 후 히어로 버튼 3개 + 빠른 이동 3개로 실제는 6개이고, 3개가 `#archive`로 향한다. 향상 패널을 제거하고 CTA 2개만 남긴다. |
| H-16의 Noto Serif/Cormorant 역할 중복 | 현재 fallback chain에서 영문·한글 glyph 역할이 다를 수 있으므로 단순 중복으로 보지 않는다. 최종안은 한글을 포함하는 sans/display 2 family만 self-host하고 실제 전송량으로 선택한다. |
| H-20의 미정 날짜 Event JSON-LD | `2026-09-XX`는 유효한 날짜가 아니다. 확정된 `startDate`가 없으면 Event schema를 생성하지 않고 SportsClub 정보만 출력한다. |
| H-21의 이메일 문자 마스킹 | 스팸 수집 억제와 개인정보 최소화 수단으로 불충분하다. 공개 이메일을 제거하고 사내 메신저 안내 또는 bot 검증 연락 폼으로 대체한다. |
| Audit의 `0003_messages_schema_v2.sql` 즉시 추가 | 운영 DB가 이미 수동 보정되었을 수 있다. 원격 schema/journal/export 확인 후 구 schema와 보정 schema 모두에서 연습한 migration만 적용한다. |
| Audit의 Lighthouse 수치 | 2026-08-09의 로컬 실험 baseline으로는 유효하지만 운영 SLO나 항상 재현되는 절대값은 아니다. 같은 CI 환경에서 3회 중앙값으로 새 baseline을 잡는다. |

### 2.3 운영자 확인이 필요한 사실

아래 항목은 코드로 정답을 추론하지 않는다.

1. **`하선재`/`허선재`**: 동일인 오타인지, 서로 다른 회원/외부 참가자인지 확인한다.
2. **회원 공개 범위**: 공개 사이트에서 실명·회사 이메일·사진을 노출해도 되는지 회원 동의를 확인한다.
3. **다음 행사**: 확정된 날짜·장소가 있는지 확인한다. 없으면 가상 날짜를 만들지 않고 `다음 모임 준비 중`을 노출한다.
4. **대표 도메인**: custom domain이 없는 동안은 `https://kolongolf.pages.dev/`를 canonical default로 사용한다.
5. **관리자 목록**: Cloudflare Access에 허용할 계정/이메일 그룹을 확정한다.

2번이 확정되지 않으면 최종 기본값은 **닉네임 우선, 실명 비노출, 이메일 비노출**이다. `robots noindex`는 접근 제어가 아니므로 개인정보 보호 대책으로 사용하지 않는다.

### 2.4 기존 이슈 추적 매트릭스

| 출처 이슈 | 최종 작업 위치 |
| --- | --- |
| Audit P0-1, P0-2, P0-3 / H-05 | Phase 0: `dist` 공개 경계, Replit local full stack, root server 제거 |
| Audit P1-1 | Phase 1: 원격 preflight, D1 forward migration, runtime DDL/중복 local schema 제거 |
| Audit P1-4 | Phase 1 + Phase 6: Wrangler pin, lockfile, npm audit CI |
| Audit P1-2 / H-04, H-22 | Phase 2: Turnstile, same-origin, rate limit, Access admin |
| Audit P1-8 / H-21 | Phase 2: 공개 정보 최소화, 동의·보존·삭제 정책 |
| Audit P1-3 / H-22 | Phase 5: private R2, D1 media metadata, dual migration |
| Audit P1-5 / H-15, H-16, H-17, H-18, H-19 | Phase 3 + Phase 5 + Phase 6: 초기 DOM, batch/lazy API, media/font/emoji, 성능 budget |
| Audit P1-6 / H-06, H-07, H-08, H-09, H-10 | Phase 4: native dialog, focus, carousel, skip link, language/live region |
| Audit P1-7 / H-20 | Phase 0 + Phase 5 + Phase 6: Cloudflare canonical, GitHub Pages 전환, robots/sitemap/JSON-LD |
| Audit P2-1 / H-23, H-24, H-26, H-27, H-31 | Phase 3: ES Modules, 프리렌더, 컴포넌트 소유권, 공통 유틸, 초기화 격리, footer 순서 |
| H-25, H-30 | Phase 3: 사후 DOM 주입 제거로 reveal 순서 해결, CSS 회귀 후 중복/사용하지 않는 규칙 제거 |
| H-28, H-29 | Phase 3: animal/member count 데이터 무결성 테스트, 파생 건수 |
| Audit P2-3 / H-01, H-02, H-11, H-12, H-14 | Phase 3: 미래/과거 일정 분리, 회원 ID, 단일 event 데이터, CTA/검색/더 보기 |
| H-03, H-13 | Phase 3: 프리렌더/JS 격리, native anchor/hash 복구 |
| Audit P2-2 | Phase 6: unit/API/E2E/visual/Lighthouse/secret scan CI |
| Audit P2-4 | Phase 0 + Phase 6: 레거시/참고 자산 격리, README/운영 문서 통일 |

---

## 3. 목표 아키텍처

### 3.1 저장소 구조

```text
workspace/
├── src/
│   ├── index.html                 # meta/shell, 프리렌더 주입 지점
│   ├── admin/index.html           # Access 보호 관리 페이지
│   ├── js/
│   │   ├── app.js                   # 초기화 orchestrator
│   │   ├── data/{site,members,events,archives}.js
│   │   ├── templates/*.js           # Node/브라우저 공용 pure renderer
│   │   ├── components/*.js          # customElements.define
│   │   ├── services/*.js            # same-origin API client
│   │   └── ui/{dialog,carousel,reveal,search}.js
│   └── styles/
│       ├── index.css
│       ├── reset.css / tokens.css / base.css
│       ├── components/*.css
│       └── utilities.css
├── public/
│   ├── images/                    # 최적화된 산출물만
│   ├── fonts/                     # self-host woff2
│   ├── icons/member-animals.svg   # 한 번 요청하는 sprite
│   ├── robots.txt / sitemap.xml
│   └── _headers / _routes.json
├── functions/
│   ├── api/messages.js            # public GET/POST
│   ├── api/messages/counts.js     # batch count
│   ├── api/archives.js            # public GET/POST
│   ├── api/media/[id].js          # 게시 상태 확인 후 private R2 전송
│   └── api/admin/*.js             # Access 보호 관리 API
├── migrations/                         # D1 schema의 유일한 정의
├── scripts/{build,check-dist,migrate-media}.mjs
├── tests/{unit,api,e2e}/
├── docs/assets/                        # 디자인 참고 자산, 비배포
└── dist/                               # build output, Git 미추적
```

`style.css`을 나누어도 cascade 순서는 `index.css`의 단일 선언으로 고정한다.

```css
@layer reset, tokens, base, components, utilities;
```

빌드 스크립트는 `src/` 템플릿과 데이터를 사용해 핵심 홈 마크업을 `dist/index.html`에 굽는다. 브라우저의 Custom Element는 이 마크업을 다시 복사하지 않고 상호작용만 연결한다. JS가 실패해도 히어, 동호회 소개, 다음 일정 상태, 최신 아카이브, 가입 안내, 푸터는 남아야 한다.

### 3.2 데이터 흐름

```text
정적 회원/행사 데이터 ──→ build-time prerender ──→ dist HTML
                           └─→ Custom Elements ──→ 검색·캐러셀·모달 향상

공개 글/업로드 ──→ Turnstile + Origin + rate limit ──→ D1 metadata
                                                       └─→ private R2 media

관리 페이지/API ──→ Cloudflare Access ──→ 승인·숨김·삭제 + audit log
```

### 3.3 정적 데이터 모델

회원은 이름 대신 안정적 ID로 참조한다.

```js
{
  id: "member-ha-seonjae",
  name: "운영자 확인 후 입력",
  handle: "장금이에이스", // 없으면 null
  role: "member",
  note: "정교한 퍼터",
  publicName: "장금이에이스",
  animalId: "flamingo"
}
```

행사 상태는 유효한 ISO 시각으로 파생한다. 날짜가 없는 일정에 `2026-09-XX`와 같은 가짜 값을 넣지 않는다.

```js
{
  id: "event-2026-07-seoknohyup",
  title: "제8회 석노협 스크린골프대회",
  startsAt: "2026-07-04T08:00:00+09:00",
  endsAt: "2026-07-04T13:00:00+09:00",
  venue: { name: "골프존파크 삼산한국골프점" },
  participantMemberIds: [],
  guestParticipants: [],
  rules: [],
  archiveId: "archive-2026-07-seoknohyup"
}
```

- `upcoming`: `endsAt >= now`
- `past`: `endsAt < now`
- `cancelled`/`postponed`: 명시적 override
- 확정 일정이 없음: event를 위조하지 않고 `site.nextEventPlaceholder`를 렌더
- 참가자 ID가 회원 목록에 없으면 build/test 실패. 외부 참가자는 `guestParticipants`에 명시

---

## 4. 단계별 구현 계획

예상 기간은 1명 기준 실작업 범위이며 Cloudflare 권한 승인, 운영자 확인, DNS 전파 시간은 제외한다. 각 단계는 별도 PR과 배포 관문으로 끝낸다.

### Phase 0. 공개 경계와 Replit 안전화 (0.5~1일, Release Blocker)

#### 구현

1. `scripts/build.mjs`를 추가해 `src/`/공개 `public/`의 allowlist만 `dist/`로 복사한다.
2. `dist/`를 지우고 새로 만드는 것은 build 산출물 내부에만 한정하고, source 디렉터리를 재귀 삭제하지 않는다.
3. `package.json`을 다음 의미로 정리한다.
   - `build`: 프리렌더 + allowlist copy
   - `dev`: local migrations → build → `wrangler pages dev dist`
   - `start`: `npm run dev`
   - `check:dist`: 비공개 파일·dotfile·secret pattern 없음 검사
4. `.replit` Run을 `npm start`로 유지하되 `start`의 의미를 Wrangler local full stack으로 바꾸고 5000 포트에 bind한다.
5. `scripts/serve.js`는 제거한다. 단순 정적 서버가 필요해도 `dist/`만 서비스하는 검증된 도구를 사용한다.
6. `getMessageApiBase()`, hostname/port 감지, `message-api-base` meta를 제거하고 클라이언트는 항상 `/api`를 사용한다.
7. `wrangler.toml` output을 `dist`로 바꾸고 `dist/`를 Git에서 제외한다.
8. `firebase-debug.log`를 현재 Git tree에서 제거하고 `*.log`, `.dev.vars*`, `.env*`, `backups/`, `dist/`를 ignore한다.
9. `home1.png`, `home2.png`, `image.png`, `mobile1.png`, `notice.png`는 `docs/assets/`로 옮기고, MOV와 미사용 `waacky.png`, 1-byte `kolongolf`은 소스 보존 필요성을 확인한 후 배포 allowlist에서 제외한다. 이 단계에서 Git history를 즉시 재작성하지는 않는다.
10. Cloudflare Pages의 build command를 `npm ci && npm run build`, output을 `dist/`로 변경한다.
11. GitHub Pages는 중단하거나, 전환기에 `dist-redirect/`의 최소 안내 페이지만 배포한 뒤 종료한다. 저장소 루트를 다시 배포하지 않는다.

#### 완료 기준

- Cloudflare와 남아 있는 GitHub Pages URL에서 `firebase-debug.log`, `.git/config`, `.idx/mcp.json`, `wrangler.toml`, migration SQL, `package-lock.json`이 모두 404다.
- `robots.txt`는 200 `text/plain`, `sitemap.xml`은 200 XML이다.
- Replit Run의 `GET /api/messages`가 local D1을 보고, 브라우저 network에 `kolongolf.pages.dev/api` 요청이 0개다.
- 로컬 쓰기 테스트 후 운영 GET 데이터가 변하지 않는다.
- malformed URL이 400 또는 404를 반환하고 서버는 살아 있다.
- `npm run build && npm run check:dist`가 통과한다.

#### 롤백

- 이전 안전한 `dist` artifact를 재배포한다.
- 저장소 루트 배포로는 롤백하지 않는다.
- 로그에 실제 자격 증명이 발견되면 history 정리보다 먼저 즉시 폐기·교체한다. 과거 커밋에서 개인정보를 제거해야 하면 별도 백업과 협업자 공지 후에만 history rewrite를 수행한다.

### Phase 1. D1 재현성·의존성 복구 (1~2일, Release Blocker)

#### 1-1. 원격 DB preflight

운영 권한을 받은 후 다음을 **읽기/백업 순서**로 수행한다.

```bash
npx wrangler d1 migrations list kolongolf-messages --remote
npx wrangler d1 export kolongolf-messages --remote --output backups/d1-before-schema-v2.sql
npx wrangler d1 execute kolongolf-messages --remote --command "SELECT id, name, applied_at FROM d1_migrations ORDER BY applied_at;"
npx wrangler d1 execute kolongolf-messages --remote --command "PRAGMA table_info(messages);"
npx wrangler d1 execute kolongolf-messages --remote --command "SELECT sql FROM sqlite_schema WHERE type='table' AND name='messages';"
npx wrangler d1 execute kolongolf-messages --remote --command "SELECT status, typeof(id), typeof(created_at), COUNT(*) AS count FROM messages GROUP BY status, typeof(id), typeof(created_at);"
```

- `backups/` 파일은 암호화된 운영 백업 위치에 이관하고 Git에 올리지 않는다.
- 운영 schema가 local schema와 같아도 과거 migration을 수정하지 않는다. 새 forward migration으로 체인을 통일한다.

#### 1-2. migration 설계

1. `0001`, `0002`는 이미 적용된 이력일 수 있으므로 변경하지 않는다.
2. `0003_messages_schema_v2.sql`은 임시 테이블 생성 → 데이터 변환 복사 → 인덱스 재생성 → 이름 교체 순으로 작성한다.
3. 구 schema의 `published`는 `visible`로, `pending`은 운영 정책에 따라 `hidden`으로 변환한다.
4. integer timestamp가 초/밀리초인지 원격 preflight로 확인해 UTC TEXT로 정규화한다.
5. 구 TEXT id가 외부 참조되는지 검사한다. 현 코드상 메시지 id는 관리 작업 외 참조가 없지만 원격 데이터 검증 전에 재번호화를 가정하지 않는다.
6. `sql/local-schema.sql`은 삭제하거나 migration에서 생성되는 참고 snapshot으로만 남긴다.
7. `functions/api/archives.js` runtime `ensureTables()`를 제거해 schema 변경이 migration을 우회하지 못하게 한다.

#### 1-3. Wrangler 및 package

- Wrangler를 구현 시점의 검증된 버전으로 정확히 pin하고 lockfile을 갱신한다. 2026-08-10 기준 후보는 `4.120.0`이다.
- `package.json` type을 `module`로 통일하고 Node 스크립트도 ESM으로 작성한다.
- `npm audit --audit-level=high`를 CI 관문으로 추가한다. 자동 `npm audit fix --force`는 사용하지 않는다.

#### 완료 기준

- 완전히 빈 임시 D1에 `migrations/` 전체를 적용한 후 messages/archives GET·POST·PATCH·DELETE가 통과한다.
- 구 `0001` schema fixture와 현 local schema fixture 모두에서 `0003` 연습이 통과하고 데이터 건수·상태·시각이 예상과 같다.
- 운영 적용 직전 export가 있고 복구 연습이 완료됐다.
- `npm audit` high/critical이 0이다.

#### 롤백

D1 schema는 이전 migration을 역실행하기보다 운영 쓰기를 잠시 중지하고 export로 복구한 뒤 forward-fix한다. 복구 절차와 예상 중단 시간을 배포 메모에 명시한다.

### Phase 2. API·관리·개인정보 안전화 (2~3일)

#### 공개 API

1. 대표 프런트엔드와 API를 Cloudflare 동일 origin에 두고 CORS 헤더를 기본 제거한다.
2. POST/PATCH/DELETE는 `Origin === new URL(request.url).origin`을 검증해 Replit preview/custom domain에서도 현재 요청의 same-origin을 판정한다. cross-origin preview가 정말 필요한 경우에만 명시적 allowlist와 `Vary: Origin`을 사용한다.
3. 메시지와 아카이브 업로드 둘 다 Turnstile token을 검증한다.
4. production에서 site key/secret/검증 호출 중 하나라도 없으면 쓰기를 503으로 닫는 fail-closed 정책을 사용한다.
5. local/CI는 Cloudflare 공식 test key 또는 `APP_ENV=local`에만 허용된 명시적 test adapter를 사용한다. production bypass 플래그는 만들지 않는다.
6. 콘텐츠 row에 IP/UA hash를 무기한 보존하지 않고 별도 `rate_limits`에 최소 식별자와 `expires_at`만 두어 유효 창이 지나면 제거한다. UA hash는 실제 방어에 쓰지 않으면 수집하지 않는다.
7. `MESSAGE_SALT`는 필수 secret으로 두고 기본값 `kolongolf`를 제거한다.
8. 입력 크기, MIME, magic bytes, 이미지 크기, 총 요청 크기를 서버에서 다시 검증한다.

#### 관리 경계

1. 푸터 `관리자` 버튼과 public bundle의 관리 패널 마크업/로직을 제거한다.
2. `src/admin/` 별도 entry와 `/api/admin/*`를 만들고 Cloudflare Access application을 두 경로에 적용한다.
3. 공유 `ADMIN_TOKEN`과 `sessionStorage` 보관을 제거한다. Access 적용이 불가능한 임시 기간에만 단기 token + 인증 실패 제한 + 상수 시간 비교를 대체책으로 쓴다.
4. 관리 변경은 `admin_audit_log`에 action, target, result, Access identity의 최소 식별자, timestamp를 90일 보존한다. token이나 문서 본문은 log에 넣지 않는다.

#### 개인정보 기본값

- 공개 회원 카드: 닉네임 우선, 동의된 경우에만 실명 보조 표시
- 가입 문의: 회사 이메일 평문 제거. 사내 메신저 역할/이름 안내 또는 Turnstile 연락 폼
- `privacy.html`: 수집 항목, 목적, 보존 기간, 삭제 요청 경로, 외부 서비스 명시
- 권장 보존: rate-limit 식별자 24시간 이내, 미승인 upload 30일, 숨김 콘텐츠 30일 후 삭제, admin audit 90일. 법/사내 정책이 다르면 그 정책을 우선한다.

#### 안전 헤더

`public/_headers`에 CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors` 정책을 추가한다. CSP를 `unsafe-inline`로 쉽게 완화하지 않도록 다음을 함께 수정한다.

- animal hue의 inline `style` → 명시적 class/data attribute CSS
- lightbox thumbnail `background-image` → 실제 `<img>`
- JSON-LD inline script → build에서 CSP hash 생성
- 외부 script/frame/connect → Turnstile 공식 origin만 허용

#### 완료 기준

- 허용되지 않은 Origin의 POST/PATCH/DELETE는 403이다.
- Turnstile token 없음/재사용/실패/설정 누락 테스트가 모두 예상 응답을 낸다.
- `/admin/`, `/api/admin/*`는 Access 미인증 상태에서 원본 내용을 반환하지 않는다.
- public JS, HTML, storage에 관리 secret이 없다.
- 정책에 맞는 자동/기획 정리 테스트가 통과한다.
- CSP report-only 모드에서 정상 사용 시 위반 0건을 확인한 후 enforce로 전환한다.

### Phase 3. 콘텐츠 모델·정보 구조·모듈화 (3~5일)

#### 콘텐츠 신뢰도

1. `members`, `events`, `archives`, `site` 데이터를 별도 ES Module로 분리한다.
2. `하선재`/`허선재` 확인 결과를 반영한다.
   - 동일인: event에 member ID만 참조
   - 다른 인물: 회원은 member ID, 허선재는 `guestParticipants`에 명시
3. 일정 영역은 가장 가까운 확정 미래 event만 보여준다.
4. 확정 일정이 없으면 다음을 표시한다.
   - 제목: `다음 모임 준비 중`
   - 본문: `일정은 확정되는 대로 이 자리에 안내합니다.`
   - action: 가입 문의 또는 최신 아카이브로 이동
5. 완료 행사는 아카이브에서만 상세 기록을 보여주고, 일정 섹션에서 미래형 문구를 사용하지 않는다.
6. 하단 공지는 확정 미래 event가 있을 때만 일정 공지로 사용한다. 미래 event가 없으면 팝업 자체를 렌더하지 않는다.

#### 화면 구조

1. 히어의 상호작용은 `다음 모임 보기`, `지난 라운드 보기` 2개만 남기고 사후 주입 `member-quick-panel`을 제거한다.
2. `initMemberExperienceEnhancements()`가 히어·일정·아카이브에 다시 HTML을 삽입하는 구조를 제거하고 각 Custom Element 템플릿이 자신의 마크업을 소유한다.
3. 푸터를 `body.append()`로 생성하지 않고 source HTML의 논리적 순서에 둔다.
4. `initSmoothScroll()`을 삭제하고 native anchor + CSS `scroll-behavior` + `scroll-margin`을 사용한다.
5. 회원 `handle` 이 `null`이면 이름/닉네임을 두 번 렌더하지 않는다.
6. 회원 수는 `members.length`, 사진 수는 media 배열, event 상태는 시각에서 파생한다.
7. 회원 검색은 명시적 search index를 사용하고 `N명 결과`/`표시할 회원이 없습니다`를 `role="status"`로 안내한다.
8. 모바일 초기 표시는 회원 8명, 아카이브 3건으로 시작하고 `더 보기`로 확장한다. 검색 시에는 전체 데이터를 대상으로 한다.

#### 프리렌더와 초기화

1. data → pure template renderer → build-time HTML의 단일 경로를 만든다.
2. Custom Element는 `customElements.define`를 계속 사용하고, 이미 프리렌더된 light DOM을 보존한 채 상호작용을 업그레이드한다.
3. `<noscript>`에는 JS가 필요한 댓글/업로드 기능만 사용할 수 없다는 안내를 둔다. 핵심 콘텐츠 대체를 `<noscript>` 하나에 맡기지 않는다.
4. `app.js`는 초기화 함수를 개별 `try/catch`로 격리하고, 실패한 기능명만 콘솔에 남긴다. 단, 테스트/CI에서는 그 오류를 실패로 처리한다.
5. `escapeText`, `formatDate`, API client, modal state의 중복 구현을 공통 모듈로 통합한다.
6. 사용되지 않는 CSS와 중복 `.archive-card-comment` 규칙을 스크린샷 회귀 테스트 후 제거한다.

#### 완료 기준

- JS를 차단해도 raw HTML에 하나의 H1, 동호회 소개, 다음 일정 상태, 최신 아카이브, 가입 안내, 푸터가 보인다.
- 이벤트 필드를 한 곳에서 바꾸면 일정, 모달, 아카이브의 관련 표시가 함께 바뀐다.
- 존재하지 않는 member ID, 중복 ID, 잘못된 ISO date, 중복 animal mapping이 build 실패를 만든다.
- 확정 미래 일정이 없을 때 과거 행사가 다음 일정으로 노출되지 않는다.
- anchor 클릭 시 URL hash와 뒤로 가기가 정상 동작한다.

### Phase 4. 접근성·상호작용 완성 (2~3일)

#### modal/lightbox

1. `kolon-dialog` Custom Element 내에 native `<dialog>`를 사용하고 `showModal()`/`close()`를 단일 controller로 관리한다.
2. 공지, 가입, 장소, 라이트박스에 같은 controller를 사용한다. 관리 페이지 대화상자도 같은 규칙을 따른다.
3. 열기 trigger 저장, 초기 focus, Tab/Shift+Tab 범위, Escape, backdrop close, 닫기 후 trigger return을 테스트한다.
4. 라이트박스의 ArrowLeft/ArrowRight는 `input`, `textarea`, `select`, contenteditable에 focus가 있을 때 무시한다.
5. 초기 `<img src="">`를 제거하고 사진을 열 때 `src`를 만든다.

#### carousel

1. 캐러셀에 `role="region"`, `aria-roledescription="carousel"`, 명확한 label을 제공한다.
2. 슬라이드 제어 중 첫 번째로 `일시정지/재생` 버튼을 제공한다.
3. `prefers-reduced-motion`, 키보드 focus, hover, `document.hidden`에서 autoplay를 정지한다. 키보드 focus로 멈췄 상태는 사용자가 재생하기 전에 임의로 다시 시작하지 않는다.
4. autoplay 중 캡션 live mode는 `off`, 사용자 조작/정지 상태는 `polite`로 전환한다.

#### 문서 탐색

- `본문으로 건너뛰기` 링크와 focus 가능한 `main#main-content`를 추가한다.
- 정적 하단 공지의 `aria-live`를 제거하고 `<aside>` + label로 마크업한다.
- `Screen Event Board`, `Club Members`, `Round Comments` 등에 `lang="en"`을 추가하거나 순수 장식이면 보조기술에서 숨긴다.
- 모바일 메뉴는 Escape, 외부 클릭, 항목 선택 후 닫히고 trigger로 focus가 돌아온다.

#### 완료 기준

- 키보드만으로 메뉴, 히어, 회원 검색, 모든 모달, 라이트박스, 댓글 폼, 더 보기를 조작할 수 있다.
- 열린 dialog 밖으로 Tab이 나가지 않고, 닫으면 열었던 요소로 focus가 돌아온다.
- 댓글 입력 중 화살표 키는 텍스트 cursor만 이동한다.
- 캐러셀을 사용자가 멈출 수 있고 저동작 환경에서 자동 재생하지 않는다.
- axe 자동 검사 critical/serious 0건 + 수동 키보드 checklist 통과를 둘 다 만족한다.

### Phase 5. R2·성능·SEO 최적화 (3~5일)

#### R2 단계적 이전

1. private R2 bucket을 만들고 `ARCHIVE_MEDIA` binding을 local/preview/production에 분리한다.
2. `0004_archive_media_metadata.sql`에 `object_key`, `mime_type`, `byte_size`, `width`, `height`, `sha256`, `variant`, migration status를 추가한다. 기존 `image_data_url`은 이전 중에만 nullable fallback으로 보존한다.
3. 새 upload는 브라우저에서 Blob으로 압축한 후 multipart로 전송하고 Function이 R2에 저장한다. D1/R2 중간 실패 시 생성한 object와 pending row를 정리한다.
4. `migrate-media.mjs`는 Data URL decode → R2 put → SHA-256/byte 검증 → D1 metadata update 순서로 작업한다.
5. 전환기에 `ARCHIVE_STORAGE_MODE=d1|dual|r2`를 사용해 dual-read하고, 전체 검증 후 Data URL을 null 처리한다. 이 플래그는 media 이전에만 쓰고 완료 후 제거한다.
6. public media는 `/api/media/:id`가 D1의 post/image `visible` 상태를 확인한 후 R2 object를 캐시 헤더와 함께 전송한다. pending media는 Access 보호 admin 경로에서만 본다.
7. 삭제는 object key 목록 확인 → R2 삭제 → D1 metadata 삭제 순서로 실행하고 실패 항목을 retry 상태로 남긴다.

#### 이미지/폰트

1. 정적 사진은 최소 480/960/1800 단계의 WebP + JPEG fallback을 생성하고 필요한 경우 실측 후 AVIF를 추가한다.
2. build 시 media manifest에 URL, width, height, bytes, alt를 생성하고 모든 `<img>`/`<picture>`에 `width`, `height`, `srcset`, `sizes`를 출력한다.
3. LCP 히어 첫 이미지만 preload/fetchpriority high를 사용하고 나머지는 lazy-load한다.
4. 폰트는 한글을 포함하는 sans 1 family + display 1 family로 축소하고 WOFF2와 license를 self-host한다. 정적 subset이 방명록의 임의 한글 glyph를 깨뜨리지 않도록 full Korean/`unicode-range` 전략을 실제 network 측정으로 선택한다.
5. CSS의 실사용 weight와 요청 weight를 맞춘다. 현재처럼 900을 다수 사용하면서 800까지만 요청하여 합성하지 않는다.
6. 회원 animal SVG를 현재 사용하는 21종만 local sprite로 만들고 출처/license 파일을 배포물에 포함한다.

#### API/DOM/scroll

1. `GET /api/messages/counts?type=archive_comment`를 추가해 archive ID별 `COUNT(*) GROUP BY archive_id`를 한 번에 반환한다.
2. 댓글 수는 archive section이 viewport에 가까워질 때 로드하고 실패 시 오류 chip 8개 대신 count UI를 숨긴다.
3. archive post/image 조회는 post 1회 + 해당 post ID image 1회 또는 join 1회로 바꾸어 N+1을 제거한다.
4. 방명록·회원 업로드도 해당 섹션이 근접할 때 로드한다. 초기 viewport의 동적 API 요청은 0이 목표다.
5. header/progress scroll 업데이트를 하나의 `requestAnimationFrame` loop로 묶고 scroll height는 resize/DOM 변경 시에만 재측정한다.

#### SEO/공유

- canonical, `og:url`, `og:image`, `og:image:width/height`, README, sitemap을 Cloudflare 대표 URL로 통일한다.
- `SportsClub` JSON-LD를 추가하고 확정 미래 event가 있을 때만 `Event`를 추가한다.
- `robots.txt`는 사이트맵 URL을 안내한다. 회원 동의 문제는 robots 설정이 아닌 표시 정책/접근 제어로 해결한다.

#### 완료 기준

- D1 API JSON에 Data URL/binary가 없고 회원 사진 수가 늘어도 D1 응답 크기가 이미지 byte에 비례하지 않는다.
- pending/hidden R2 object를 public media URL로 읽을 수 없다.
- 정적 사진 참조·파생본·치수·alt 누락이 0건이다.
- 전체 아카이브 댓글 count 요청이 8회에서 1회로 줄어든다.
- Google Fonts/jsDelivr 요청이 0개이고 Turnstile 외 필수 제3자 요청이 없다.
- canonical, robots, sitemap, JSON-LD validator가 통과한다.

### Phase 6. 자동 검증·CI·배포 승격 (2~3일)

#### npm scripts

```text
npm run build             프리렌더 + 정적 산출물 생성
npm run check             문법·데이터·자산·dist allowlist 통합 검사
npm run test:unit         데이터/model/template 테스트
npm run test:api          빈 local D1 migration + API CRUD/보안 테스트
npm run test:e2e          Playwright Chromium/Firefox/WebKit smoke + keyboard
npm run test:visual       390/768/1440 핵심 화면 snapshot
npm run lighthouse       고정된 환경 3회 측정 및 budget 검사
```

#### CI 관문

1. `npm ci`
2. exact-version/락파일 검증
3. `npm audit --audit-level=high`
4. `npm run check`
5. 빈 임시 D1에 migration 전체 적용
6. public/admin API integration test
7. Playwright + axe + visual smoke
8. Lighthouse budget
9. gitleaks 또는 동등한 secret scan
10. Cloudflare preview 배포 후 smoke
11. main 승인 후 production deploy

#### 필수 E2E 시나리오

- 390×844, 768×1024, 1440×900에서 horizontal overflow 0
- 콘솔 error, page error, 예상하지 않은 4xx/5xx 0
- JS 활성/차단 둘 다 핵심 콘텐츠 표시
- `#members`, `#archive` 직접 접속·뒤로 가기
- 회원 검색 0건/N건/초기화
- 캐러셀 정지, reduced motion
- 모달 focus trap/return, 라이트박스 댓글 화살표 입력
- guestbook/archive Turnstile 성공·실패·속도 제한
- 미인증 admin 차단, 인증 admin 승인/숨김/삭제
- pending/visible/hidden media 공개 범위
- 다음 일정 있음/없음/cancelled 상태

#### 성능 budget

같은 CI runner에서 3회 중앙값으로 판정한다.

| 항목 | 1차 합격 기준 |
| --- | ---: |
| Lighthouse Performance | 85 이상 |
| Accessibility / Best Practices / SEO | 각 100 목표, regression 0 |
| LCP | 2.5초 이하 |
| CLS | 0.10 이하 |
| TBT | 200ms 이하 |
| 초기 전송량 | 800KiB 이하 |
| 초기 request | 25개 이하 |
| 초기 viewport API | 0개 |
| 전체 홈 API | 섹션 지연 로드 포함 3개 이하 |
| DOM | 650 elements 이하 목표 |

수치 목표를 맞추기 위해 콘텐츠를 삭제하지 않는다. 표시 시점, media 파생본, 중복 DOM, 요청 구조를 먼저 개선한다.

---

## 5. 파일별 변경 맵

| 현재 파일/영역 | 최종 작업 |
| --- | --- |
| `.replit` | Run을 port 5000 Wrangler local full stack으로 연결 |
| `package.json`, lockfile | ESM, build/check/test/dev scripts, Wrangler 안전 버전 pin |
| `wrangler.toml` | `pages_build_output_dir = "dist"`, D1/R2/env binding 분리 |
| `scripts/serve.js` | 제거 |
| `scripts/optimize-images.sh` | 반응형 derivative + manifest + WebP 생성으로 확장 |
| `index.html` | `src/index.html`로 이동, canonical/OG/JSON-LD/skip link/prerender shell 적용 |
| `main.js` | `src/js/` ES Modules로 분해; data, template, component, service, UI 경계 분리 |
| `style.css` | layer 순서를 유지한 `src/styles/` 분해; 중복/사용하지 않는 규칙 제거 |
| `functions/api/messages.js` | public GET/POST만 유지, Turnstile/Origin/rate-limit, count route 분리 |
| `functions/api/archives.js` | public GET/POST만 유지, R2 multipart, N+1 제거, runtime DDL 제거 |
| `functions/api/admin/*` | Access 보호 PATCH/DELETE/승인 분리 |
| `functions/api/media/[id].js` | D1 visibility check 후 private R2 object 응답 |
| `migrations/` | 운영 preflight 후 0003 schema v2, rate-limit/audit, R2 metadata migration 추가 |
| `sql/local-schema.sql` | 단일 schema 정의에서 제거 |
| `_routes.json` | `dist/` 정적 파일로 배포, API/media route만 Function에 포함 |
| `firebase-debug.log` | Git 현재 tree/배포에서 제거, secret/PII 후속 판정 |
| `.idx/*`, `GEMINI.md` | `legacy/firebase-studio/` 또는 docs로 격리, `dist` 제외 |
| 루트 참고 PNG/MOV | `docs/assets/`/archive source storage로 이관, `dist` 제외 |
| `README.md` | Replit local full stack, migration, env, Cloudflare deploy, recovery 기준으로 전면 갱신 |
| `TASK.md`, `blueprint.md`, `PROJECT_LOG.md` | phase/PR 완료 시 실제 결과와 판단 기록 |
| `.github/workflows/` | CI, preview smoke, production deploy, secret scan |

---

## 6. 환경 설정과 secret

| 이름 | 환경 | 용도/정책 |
| --- | --- | --- |
| `DB` | local/preview/prod 개별 | D1 binding |
| `ARCHIVE_MEDIA` | local/preview/prod 개별 | private R2 binding |
| `APP_ENV` | 명시 | `local`, `preview`, `production` |
| `SITE_URL` | public build var | canonical/OG/sitemap 생성. 변조 요청 Origin은 실제 request URL과 비교 |
| `TURNSTILE_SITE_KEY` | public build var | 환경별 site key |
| `TURNSTILE_SECRET_KEY` | secret | 서버 검증, production 필수 |
| `MESSAGE_SALT` | secret | rate-limit 식별자 hash, 기본값 금지 |
| Access audience/team 설정 | secret/config | admin identity 검증이 필요할 때 사용 |

- 실제 값은 `.dev.vars`, Replit Secrets, Cloudflare environment에만 두고 Git에 추적하지 않는다.
- `.dev.vars.example`에는 의미와 placeholder만 둔다.
- preview와 production이 같은 D1/R2를 공유하지 않는다.
- 정적 build에 secret을 주입하지 않는다. Turnstile site key만 public 값으로 주입한다.

---

## 7. 작업 의존성과 PR 단위

```text
PR-01 공개 dist + Replit local full stack
  └─→ PR-02 D1 preflight + schema chain + Wrangler update
        ├─→ PR-03 public API/Turnstile/Origin/rate-limit
        ├─→ PR-04 admin split + Cloudflare Access
        └─→ PR-05 data model + prerender + ES Modules
              ├─→ PR-06 content/UX + dialog/carousel accessibility
              └─→ PR-07 responsive media/fonts/emoji + SEO

PR-03 + PR-05 ──→ PR-08 R2 dual migration + media delivery
PR-04 + PR-06 + PR-07 + PR-08 ──→ PR-09 CI budgets + canonical cutover + cleanup
```

- PR-01과 PR-02는 다른 기능 작업보다 먼저 merge/배포한다.
- PR-03/04는 API 경계를, PR-05/06은 프런트엔드 구조를 변경하므로 각각 독립 롤백 가능한 artifact를 남긴다.
- PR-08은 D1 Data URL을 즉시 삭제하지 않고 dual-read 검증 기간을 거친다.
- 콘텐츠 운영자 확인이 늦어져도 PR-01~04의 인프라/보안 작업은 진행할 수 있다. 단, PR-05의 이름 데이터 확정은 보류한다.

---

## 8. 전체 Definition of Done

아래를 모두 만족해야 이 개선 작업을 완료로 판정한다.

### 운영/배포

- [ ] 대표 운영 도메인이 Cloudflare 하나로 통일됨
- [ ] 저장소/개발/로그/DB 파일 공개 URL 모두 404
- [ ] Replit Run이 local D1/R2만 사용
- [ ] preview/prod DB·R2·secret 분리
- [ ] 이전 production artifact와 D1 export로 복구 연습 완료

### 데이터/보안

- [ ] 빈 DB가 migrations만으로 재현됨
- [ ] 공개 쓰기 Turnstile·Origin·rate-limit 통과
- [ ] admin page/API Access 보호, public bundle에 admin secret/logic 없음
- [ ] 사진 binary R2 저장, D1은 metadata만 보유
- [ ] 개인정보 동의·보존·삭제 절차 문서화

### 콘텐츠/UX

- [ ] 회원/참가자 이름 운영자 확인 완료, 단일 ID 참조
- [ ] 일정은 미래 event 또는 `준비 중` 상태만 표시
- [ ] 히어 CTA 2개, hash/뒤로 가기/딥링크 정상
- [ ] JS 실패/차단 시에도 핵심 본문 표시
- [ ] 회원 검색·더 보기·아카이브 발견 가능성 통과

### 접근성/성능

- [ ] 모든 dialog focus 범위/return, 라이트박스 입력 키, carousel 정지 통과
- [ ] 수동 키보드 checklist + axe critical/serious 0
- [ ] 390/768/1440 화면 가로 overflow/시각 회귀 없음
- [ ] 모든 이미지 치수/srcset/alt 검증
- [ ] Phase 6의 Lighthouse/network/DOM budget 통과
- [ ] 콘솔 error, page error, 예상 외 요청 실패 0

### 문서/유지보수

- [ ] `README.md`의 로컬 개발, DB/R2, env, 배포, 복구 절차가 실제와 일치
- [ ] `TASK.md`, `blueprint.md`, `PROJECT_LOG.md`가 최종 구조와 배포 결과를 반영
- [ ] CI 통과 없이 production으로 승격할 수 없음
- [ ] 기존 두 리뷰 문서의 이슈 ID가 PR/커밋에 추적 가능하게 연결됨

---

## 9. 첫 작업 착수 순서

다음 작업 회차에서는 아래 순서로 바로 시작한다.

1. `feature/safe-dist-replit` 작업 범위에서 `dist` allowlist build와 `check:dist`를 먼저 구현
2. Replit Run을 Wrangler port 5000 + local migrations에 연결
3. 로컬 network에서 운영 API 요청 0을 확인
4. Cloudflare preview에서 비공개 URL 404와 API smoke를 확인
5. 안전한 production `dist` 배포로 현재 로그 노출을 차단
6. 그 다음 PR에서만 원격 D1 preflight/export을 수행하고 schema v2를 작성

즉, **첫 구현 목표는 UI 변경이 아니라 “허용한 파일만 배포되고 Replit이 절대 운영 데이터를 쓰지 않는 상태”를 만드는 것**이다.
