# **PROJECT_LOG.md - 작업 로그 및 변경 기록**

에이전트(Gemini)가 수행한 모든 작업 내용과 기술적 결정을 타임라인 순으로 기록합니다.

---

### **[2026-08-10] 운영 배포 전 콘텐츠·도구체인 최종 정리**

#### **회원 이름 표기 통일**
*   회원명부와 6월 행사 기록에서 일관되게 사용 중인 `하선재`를 기준으로 7월 대회 상세, 일정 패널, 공지 모달의 `허선재` 3곳을 `하선재`로 통일.
*   현재 `main.js`와 빌드 결과에서 `허선재`가 더 이상 남지 않고 `하선재`가 회원명부·행사 기록 전체에 동일하게 표시되는지 확인.

#### **도구체인 보안 업데이트**
*   Wrangler를 4.100.0에서 4.120.0으로 갱신하고 `package.json`과 lockfile을 동기화.
*   `npm audit`의 기존 high 5건/low 1건을 0건으로 해소하고 `npm outdated` 결과도 비어 있음을 확인.

#### **브라우저 검증 중 발견한 결함 보정**
*   닫힌 라이트박스의 `<img src="">`가 현재 문서를 이미지로 다시 요청하던 문제를 발견해 초기 `src` 속성을 제거. 라이트박스를 열 때 기존 코드가 실제 이미지 경로를 설정하는 동작은 유지.

#### **검증**
*   `main.js`, 빌드·개발·미리보기 스크립트, 공용 보안 모듈, Pages Functions 구문 검사와 `git diff --check` 통과.
*   `npm run build`: 루트 allowlist 9개 파일과 이미지 48장 복사 성공.
*   Wrangler 4.120.0 local full-stack에서 홈페이지·정적 파일·메시지 GET 200, 비공개 파일 404, 불허 Origin 메시지 POST 403, 공개 사진 업로드 POST 403 확인.
*   Playwright Chromium 데스크톱 1440×900·모바일 390×844 검증: 회원 카드 21개, 아카이브 카드 7개, 콘솔/page/request 오류 0, 가로 overflow 0, 깨진 로드 이미지 0, 모바일 메뉴 동작 확인.
*   Cloudflare Pages 원격 설정과 Turnstile 발급은 현재 실행 환경에 Cloudflare 인증이 없어 별도 운영 단계로 유지.

---

### **[2026-08-10] GitHub Pages `dist/` 전용 배포 적용 및 최종 배포 점검**

#### **배포 전 검증**
*   `node scripts/build.js` 재실행: 루트 allowlist 9개 파일 + 이미지 48장 복사 성공.
*   `main.js`, `scripts/build.js`, `scripts/dev.js`, `scripts/serve.js`, `lib/api-security.mjs`, `functions/api/*.js` 총 7개 파일 구문 검사 통과.
*   `npm run preview:static` 로컬 검증: `/`, `/style.css`, `/robots.txt`, `/sitemap.xml` 200 / `wrangler.toml`, `package.json`, `PROJECT_LOG.md`, `.git/config`, `firebase-debug.log` 404 / 존재하지 않는 경로 404(index fallback 아님) / `/%E0%A4%A` 400 후 서버 정상 유지.

#### **workflow 푸시 차단 해소**
*   `.github/workflows/pages.yml` 푸시가 `refusing to allow an OAuth App to create or update workflow ... without workflow scope`로 거부됨. Replit 관리 OAuth 토큰에 `workflow` scope가 없고 SSH key도 없어 기존 자격증명으로는 우회 불가.
*   `gh auth login --hostname github.com --git-protocol https --web --scopes workflow` device flow로 재인증(scope: `gist`, `read:org`, `repo`, `workflow`) 후 `gh auth setup-git`으로 git 자격증명을 전환해 `15f613c..0dd09ee` 푸시 성공.
*   `gh`가 토큰을 작업 트리 내부 `.config/gh/hosts.yml`에 평문 저장하므로 저장소 `.gitignore`에 `.config/`를 추가(시스템 ignore에만 의존하지 않도록).

#### **배포 결과**
*   저장소 Settings > Pages > Source를 GitHub Actions로 변경한 뒤 workflow run `31363627933`의 build(14s)/deploy(10s) 모두 성공.
*   `moogun-jeong.github.io/kolongolf` 재검사: 공개 대상 6종 200, `wrangler.toml`·`package.json`·`PROJECT_LOG.md`·`AGENTS.md`·`blueprint.md`·`lib/api-security.mjs`·`migrations/0001_messages.sql`·`home1.png`·`images/waacky.png` 전부 404로 전환.
*   `dist/images` 48장 전량 200 응답, `index.html`/`main.js`/`style.css` 참조 이미지 중 dist 누락 0건.
*   Actions annotation으로 `actions/checkout@v4`, `setup-node@v4`, `configure-pages@v5`, `upload-artifact@v4`의 Node.js 20 deprecation 경고 발생(강제 Node 24 실행으로 동작에는 영향 없음).

#### **남은 노출 (미해결)**
*   `kolongolf.pages.dev`는 build command/output directory가 아직 예전 설정이라 `/wrangler.toml`, `/PROJECT_LOG.md`가 계속 200. 실행 환경에 Cloudflare 자격증명이 없고 `wrangler login`은 OAuth 콜백이 컨테이너 내부 `localhost:8976`으로 돌아와 브라우저에서 도달 불가하므로 이 세션에서 처리 불가.
*   **이어서 할 작업 런북을 `TASK.md` 1장(1-A/1-B)에 기록**: 대시보드 절차, Cloudflare API를 쓰는 대안 절차, 완료 판정 curl, `/api/messages` 404 시 롤백 기준, `MESSAGE_SALT`/`ADMIN_TOKEN` 생성 명령, Turnstile sitekey·secret 이원 처리, 셸 초기화 후 `gh`/`wrangler` 인증 복구 방법 포함.

---

### **[2026-08-10] 우선 개선 계획 P0/P1 구현**

#### **P0-1 공개 배포 범위 제한**
*   `scripts/build.js`를 추가해 allowlist 파일만 `dist/`로 복사(`index.html`, `404.html`, `main.js`, `style.css`, `_routes.json`, `_headers`, `robots.txt`, `sitemap.xml`, `.nojekyll`).
*   이미지는 `index.html`/`main.js`/`style.css`의 실제 참조를 훑어 `-display`와 짝 `-thumb`까지 자동 수집. 참조되지 않는 `images/waacky.png`, `images/20260704 MOV.mov`는 배포에서 제외(48/50개 복사).
*   `wrangler.toml`의 `pages_build_output_dir`을 `.`에서 `dist`로 변경하고, `.github/workflows/pages.yml`로 GitHub Pages도 `dist/`만 올리도록 전환.
*   `firebase-debug.log`를 Git tree에서 제거하고 `.gitignore`에 `dist/` 추가.
*   `404.html`을 추가해 allowlist 밖 요청이 index.html fallback(200)이 아니라 404로 응답하도록 수정.
*   local 검증: `/wrangler.toml`, `/migrations/0001_messages.sql`, `/PRIORITY_IMPROVEMENT_PLAN.md`, `/package.json`, `/firebase-debug.log`, `/AGENTS.md`, `/lib/api-security.mjs`, `/.git/config` 모두 404. `/robots.txt` `text/plain`, `/sitemap.xml` `application/xml` 확인.

#### **P0-2 Replit local과 운영 데이터 분리**
*   `scripts/dev.js`를 추가하고 Replit Run(`npm start`)을 `wrangler pages dev`(정적 + `/api` + 로컬 D1) 실행으로 전환. 첫 실행 시 로컬 전용 `.dev.vars` 생성과 로컬 D1 스키마 초기화를 자동 수행.
*   `getMessageApiBase()`를 "정적 전용 호스트(`*.github.io`)에서만 운영 API 주소, 그 외에는 같은 출처 `/api`"로 변경. Replit 화면에서 `kolongolf.pages.dev/api` 요청이 발생하지 않음.
*   API에 연결되지 않은 화면에서는 방명록·댓글 입력을 비활성화하고 사유를 표시(`setWriteAvailability`).
*   `scripts/serve.js`는 `dist/`만 서빙하는 정적 미리보기(`npm run preview:static`)로 축소하고, malformed percent-encoding URL에 400을 반환하도록 수정. `/%`, `/%E0%A4%A` 요청 후에도 서버가 계속 응답하는 것을 확인.

#### **P0-3 댓글 쓰기 안전화**
*   `lib/api-security.mjs`를 추가해 두 API가 공유하는 보안 헬퍼를 정리(Pages Functions 밖에 두어 라우트로 노출되지 않음).
*   Turnstile fail-closed: secret이 없으면 운영에서 POST를 503으로 거부. 토큰 누락은 400, siteverify 실패·재사용은 400.
*   `MESSAGE_SALT` 기본값 제거. 미설정 시 운영 쓰기 거부.
*   POST/PATCH/DELETE에 Origin 검증 추가(기본 허용: `kolongolf.pages.dev`, `moogun-jeong.github.io`, 요청 자기 출처. `ALLOWED_ORIGINS`로 재정의 가능).
*   관리자 토큰은 16자 이상 요구, 상수 시간 비교, IP 기준 10분 5회 실패 시 429. D1 스키마 변경 없이 isolate 메모리로 제한.
*   local 검증: Origin 없음/불허 POST 403, 허용 Origin POST 201, 1분 5건 초과 429, 관리자 오인증 5회 후 429.
*   `ALLOW_INSECURE_WRITES`는 로컬 `.dev.vars` 전용 스위치로만 사용(운영 환경 변수에 넣지 않음).

#### **P1-1 지난 일정 문구 정리**
*   `main.js`에 `upcomingEvents`(확정 미래 일정)와 `latestRecordEvent`(지난 기록)를 분리하고 `getNextEvent()`가 오늘 이후 일정만 반환하도록 구현.
*   확정 일정이 없으면 일정 영역은 `다음 모임 준비 중` / `일정은 확정되는 대로 이 자리에 안내합니다.`를 표시하고, 상세 패널은 `지난 행사 기록`으로 라벨링.
*   하단 일정 공지(`kolon-bottom-notice`)는 확정 미래 일정이 있을 때만 렌더링.
*   소개 CTA와 회원 빠른 이동 문구도 확정 일정 유무에 따라 바뀌도록 수정. 7월 행사 아카이브와 사진은 그대로 유지.

#### **P1-2 회원 공개 사진 업로드 비활성화**
*   화면은 `publicArchiveUploadEnabled = false`, 서버는 `ENABLE_ARCHIVE_UPLOADS` 미설정 시 POST 403.
*   기존 공개 데이터는 삭제하지 않고 읽기 전용 목록으로 유지하며, 남은 기록이 없으면 해당 영역 자체를 숨김. 관리자 승인 관리 화면은 유지.

#### **부가 조치**
*   `_headers`에 CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` 추가. `frame-ancestors`는 Replit 미리보기 iframe이 막히지 않도록 Replit 도메인을 허용.
*   `index.html`에 canonical 링크 추가, 정적 자산 캐시 버전을 `20260810-1`로 갱신.

#### **남은 운영 조치(코드로 처리 불가)**
*   Cloudflare Pages 환경 변수에 Turnstile secret, `MESSAGE_SALT`, 16자 이상 `ADMIN_TOKEN` 설정 및 `index.html`의 sitekey 입력. 설정 전까지 공개 글쓰기는 fail-closed로 막힘.
*   Cloudflare Pages build output directory를 `dist`, GitHub Pages Source를 GitHub Actions로 변경.
*   D1 migration chain 복구는 다음 DB 변경 직전 작업으로 유지(이번 범위에서 D1 스키마 변경 없음).

---

### **[2026-08-10] 홈페이지 우선 개선 계획으로 범위 축소**

#### **운영 판단**
*   현재 홈페이지와 공개 조회 API가 동작하고, 관리자가 문구·회원·일정·사진을 직접 갱신하는 소규모 운영 방식임을 기준으로 전면 아키텍처 전환을 보류.
*   `FINAL_IMPROVEMENT_PLAN.md`는 장기 참고안으로 유지하고, 즉시 실행 기준은 `PRIORITY_IMPROVEMENT_PLAN.md`로 분리.

#### **우선 범위**
*   `dist/` allowlist를 통한 공개 배포 경계, Replit local/운영 API·D1 분리, 댓글 Turnstile fail-closed와 속도 제한, 지난 일정 문구 정리를 우선 작업으로 선정.
*   공개 회원 사진 업로드를 사용하지 않으면 UI/POST를 비활성화해 현재 단계의 R2 이전을 생략하도록 결정.
*   D1 migration 불일치는 단순 콘텐츠 수정의 선행 조건에서 제외하고, 다음 DB 변경 전 운영 schema 확인·백업·forward migration 순서로 처리하도록 정리.

#### **변경 범위**
*   이번 작업은 계획 문서와 프로젝트 기록 갱신만 수행했으며 홈페이지 코드, 운영 D1, Cloudflare/GitHub 설정은 변경하지 않음.

---

### **[2026-08-10] 마이그레이션 및 홈페이지 최종 개선안 수립**

#### **교차 검증**
*   `HOMEPAGE_REVIEW.md`와 `REPLIT_MIGRATION_AUDIT.md`의 근거를 현재 `main.js`, `index.html`, API Functions, D1 migrations, Replit/Cloudflare 설정, 자산 현황과 다시 대조.
*   `scripts/serve.js`의 저장소/.git 파일 200 응답과 malformed percent URL `URIError` 종료를 local에서 재현.
*   빈 임시 D1에 `0001_messages.sql`, `0002_archive_uploads.sql`을 적용한 후 현 API와 같은 `status='visible'` INSERT가 CHECK constraint로 실패하는 것을 재확인.
*   2026-08-10 읽기 전용 운영 재검사에서 Cloudflare/GitHub Pages의 `firebase-debug.log`, `wrangler.toml` 노출을 확인하고, Cloudflare `robots.txt`가 HTML fallback을 반환하는 상태를 확인.
*   Wrangler 4.100.0 설치, npm registry 4.120.0 최신, `npm audit` high 5/low 1을 재확인.

#### **리뷰 보정**
*   `#admin` 해시는 보안 경계가 아니므로 Cloudflare Access 뒤의 별도 admin page/API로 교체하도록 정리.
*   운영 D1의 실제 schema/journal/export를 확인하기 전에 보정 migration을 적용하지 않도록 preflight와 복구 연습을 선행 관문으로 설정.
*   자동 carousel의 `aria-live`, 미정 Event JSON-LD, 이메일 문자 마스킹, 행사 노출 횟수 같은 과장·불완전한 처방을 보정.
*   `하선재`/`허선재`, 회원 공개 동의, 다음 행사, 관리자 Access 목록은 코드 추론이 아닌 운영자 확인 관문으로 분리.

#### **최종 실행 계획**
*   `FINAL_IMPROVEMENT_PLAN.md`에 Replit 개발 + GitHub CI + Cloudflare 단일 운영 + D1/R2 목표 구조를 확정.
*   공개 `dist` 경계, D1 migration, API/admin/개인정보, 데이터 모델/프리렌더, 접근성, R2/성능/SEO, CI 관문을 7개 phase와 9개 PR 의존성으로 분해.
*   각 phase에 파일별 변경, 환경 변수, 롤백, 수동/E2E 검증, Lighthouse/network/DOM budget, 전체 Definition of Done을 명시.
*   이번 작업은 문서 통합·검증 범위로 한정하고 운영 코드, D1/R2, 원격 설정은 변경하지 않음.

---

### **[2026-08-09] Firebase Studio → Replit 마이그레이션 종합 진단**

#### **주요 확인 사항**
*   **현재 구조 학습**:
    *   Vanilla JS Custom Elements 13개, OKLCH/CSS layer 기반 디자인, 정적 회원·아카이브 데이터, Cloudflare Pages Functions/D1 기반 방명록·댓글·회원 업로드·관리자 기능을 전체 점검.
    *   Replit Run, Wrangler local full-stack, Cloudflare Pages, GitHub Pages의 화면/API 연결 차이를 비교.
*   **공개 경계 문제 발견**:
    *   저장소 루트 배포로 Cloudflare Pages와 GitHub Pages에서 `firebase-debug.log`, `wrangler.toml`, migration SQL 등 개발 파일이 HTTP 200으로 공개되는 상태를 확인.
    *   Replit `scripts/serve.js`도 저장소 전체 파일을 제공하고, malformed percent-encoded URL에 `URIError`로 종료되는 문제를 재현.
*   **환경/데이터 불일치 발견**:
    *   Replit 기본 Run(`npm start`, 5000)이 local API가 아닌 운영 `kolongolf.pages.dev/api`에 연결되는 것을 Chromium 네트워크로 확인.
    *   `migrations/0001_messages.sql`과 `sql/local-schema.sql`의 id/status/timestamp schema 불일치를 확인하고, 0001만 적용한 임시 D1에서 현재 API INSERT의 CHECK constraint 실패를 재현.
*   **품질 진단**:
    *   Chromium 138에서 1440px/390px 렌더, 콘솔·요청·가로 overflow를 확인. 렌더 오류는 없었으나 모달 초기 포커스와 Tab 이동이 배경에 남는 접근성 문제를 재현.
    *   모바일 Lighthouse 실험에서 Performance 58, Accessibility 100, Best Practices 100, SEO 92, FCP 7.9s, LCP 8.3s, TBT 0ms, CLS 0.028 측정.
    *   Google Fonts 렌더 차단, 초기 API 10회, DOM 905개, 모바일 전체 길이 약 17,640px를 주요 체감 개선 지점으로 선정.
    *   `npm audit`에서 Wrangler 하위 개발 의존성 5 high/1 low를 확인하고 4.100.0 → 4.120.0 업데이트 필요성을 기록.

#### **문서화**
*   상세 근거, P0/P1/P2 우선순위, 권장 목표 구조, 단계별 완료 기준을 `REPLIT_MIGRATION_AUDIT.md`에 작성.
*   `README.md`에 진단 문서 링크를 추가하고 `blueprint.md`에 현재 진단 및 개선 계획을 반영.

#### **기술적 판단**
*   **권장 운영 형태**: Replit은 주 개발 환경, GitHub는 소스/CI, Cloudflare Pages는 단일 운영 배포로 두고, D1은 텍스트 데이터, R2는 회원 업로드 사진을 담당하는 구성이 현재 자산을 가장 안전하게 활용함.
*   **우선순위**: UI 전면 변경보다 공개 산출물 `dist/` 격리, Replit local/운영 데이터 분리, D1 migration chain 복구를 먼저 수행해야 함.
*   **변경 범위 제한**: 이번 요청은 상세 학습·진단·제안이므로 운영 코드와 원격 데이터는 수정하지 않고 문서만 갱신함.

---

### **[2026-08-09] Replit 실행 환경 복구 및 아카이브 이미지 최적화**

#### **주요 변경 사항**
*   **실행 환경 복구**:
    *   `.replit`에 `run = "npm start"`를 추가. 기존에는 실행 명령이 없어 Run 버튼이 동작하지 않았음.
    *   `modules`를 `nodejs-20`에서 `nodejs-22`로 승격. `wrangler` 4.100은 Node 22 이상을 요구하며 Node 20에서 `npm run dev`가 즉시 실패했음.
    *   `package.json`의 `engines.node`를 `>=22`로 맞추고 `start`, `images` 스크립트를 추가.
*   **미리보기 서버 교체**:
    *   `preview` 스크립트가 쓰던 `python3 -m http.server`를 의존성 없는 `scripts/serve.js`로 교체. Firebase Studio의 `.idx/dev.nix`에는 `pkgs.python3`가 있었지만 Replit `modules`에는 없어 실행 불가 상태였음.
    *   캐시 버전 쿼리(`?v=`) 처리, MIME 매핑, 경로 탈출 차단, 404 처리를 포함.
*   **이미지 파생본 체계 도입**:
    *   `scripts/optimize-images.sh` 추가. 긴 변 1800px `-display`와 400px `-thumb` 두 종류를 생성하며, 축소만 수행(`>`)하고 공지 캡처(PNG)는 글자 뭉개짐을 피해 팔레트 양자화 PNG로 유지.
    *   2026-04/06/07 세트가 원본을 그대로 참조하던 것을 모두 `-display` 경로로 교체.
    *   `thumbSource()`를 추가해 라이트박스 썸네일이 원본 대신 `-thumb`를 사용하도록 변경. 기존에는 68x48 썸네일이 `background-image`로 4~5MB 원본을 그대로 내려받았음.
    *   `index.html`의 `og:image`와 히어로 `preload`도 `-display` 경로로 교체.
*   **자산 정리**:
    *   파생본으로 대체된 원본 28개 삭제. `images/` 80MB → 7.7MB.
    *   대체본이 없는 `20260704 MOV.mov`와 `waacky.png`는 보존.
*   **캐시 갱신**:
    *   `index.html`의 `style.css`, `main.js` 쿼리 버전을 `20260809-1`로 갱신.

#### **검증**
*   `node --check main.js`, `node --check scripts/serve.js`, `bash -n scripts/optimize-images.sh` 통과.
*   `main.js`/`index.html`이 참조하는 이미지 전체와, 각 `-display`에 대응하는 `-thumb` 파생본 존재를 정적 검사로 확인(누락 0건).
*   `npm start`로 5000 포트 기동 후 `/`, `main.js?v=20260809-1`, `style.css?v=20260809-1`, `-display`/`-thumb` 이미지 응답 200 확인.
*   없는 경로 404, `../` 및 `%2e%2e/` 경로 탈출 시도 404 차단 확인.
*   전송량 실측: 7월 갤러리 라이트박스 30,462KB → 479KB, 첫 화면 이미지 1,085KB → 129KB.

#### **기술적 결정 이유**
*   **파생본 경로 유도**: 이미지 데이터를 객체 배열로 바꾸면 라이트박스·카드·사진 수 계산까지 손대야 하므로, `-display` → `-thumb` 문자열 치환 헬퍼 하나로 변경 범위를 좁힘.
*   **원본 삭제**: 삭제해도 git 이력에 남아 복구 가능하고, 브라우저 전송량은 참조 경로 변경으로 이미 해결되므로 작업 디렉터리와 배포 용량만 정리.
*   **Replit 배포 설정 미추가**: 이미 GitHub Pages와 Cloudflare Pages로 이원화된 상태라 세 번째 배포 대상을 늘리지 않고, Replit은 개발 환경으로만 사용.

---

### **[2026-08-09] 현재 작업 디렉터리 자산 커밋 및 GitHub main 반영 준비**

#### **주요 변경 사항**
*   현재 작업 디렉터리에 남아 있던 `AGENTS.md`, 디자인 참고 PNG 5개, `images/20260704 MOV.mov`를 함께 커밋 대상으로 확정.
*   이전 7월 아카이브 작업에서 MOV를 제외했던 범위는 이번 전체 반영 요청에 따라 변경.

#### **기술적 결정 이유**
*   현재까지의 작업물을 누락 없이 보존하고 GitHub `main`에서 동일한 작업 상태를 확인할 수 있도록 미추적 자산을 모두 포함.

---

### **[2026-07-06] 아카이브 다중 사진 표시 강화**

#### **주요 변경 사항**
*   **사진 수 시각화**:
    *   아카이브 대표 이미지 위에 항상 보이는 사진 수 배지와 갤러리 안내 패널을 추가.
    *   여러 장이 있는 기록은 `11장 갤러리`, `터치해서 모두 보기`처럼 터치 전에도 사진 묶음임을 알 수 있게 구성.
*   **카드 상호작용 정리**:
    *   기존 hover 전용 `사진 보기` 라벨은 유지하되, 새 배지와 겹치지 않도록 전용 클래스 기반 스타일로 분리.
    *   모바일에서도 사진 수와 터치 유도 문구가 보이도록 배지 크기와 안내 패널 간격을 조정.
*   **캐시 갱신**:
    *   `index.html`의 `style.css`와 `main.js` 쿼리 버전을 `20260706-3`으로 갱신.

#### **검증**
*   `node --check main.js` 통과.
*   `git diff --check` 통과.
*   정적 검색으로 `photo-count-badge`, `photo-gallery-cue`, `photo-stack-icon`, `20260706-3` 반영을 확인.
*   로컬 서버에서 `/`, `main.js?v=20260706-3`, `style.css?v=20260706-3`, `images/archive-2026-07-11.jpeg` 응답을 확인.
*   Chromium headless 모바일 스크린샷 검증은 현재 환경의 DBus 및 한글 폰트 렌더링 오류(`platform_font_skia`, `render_text_harfbuzz`)로 타임아웃되어 완료하지 못함. 이전 기록과 같은 환경 이슈로 판단하고 정적 구조 검증과 로컬 서버 응답으로 보완.

#### **기술적 결정 이유**
*   **발견 가능성 우선**: 작은 하단 칩만으로는 여러 장의 사진이 있다는 정보가 약하므로, 사진 자체 위에 항상 보이는 수량 배지와 안내 문구를 배치.
*   **기존 동작 유지**: 라이트박스와 댓글 동작은 그대로 두고 카드 렌더링과 CSS만 보강해 변경 범위를 좁힘.

---

### **[2026-07-06] 7/4 아카이브 대표 사진 변경**

#### **주요 변경 사항**
*   **대표 사진 변경**:
    *   2026년 7월 4일 제8회 석노협 스크린골프대회 아카이브의 대표 사진을 `images/archive-2026-07-11.jpeg`로 변경.
    *   기존 11장 갤러리 구성은 유지하고, 아카이브 카드와 라이트박스 첫 화면에 보이는 이미지 순서만 조정.
*   **캐시 갱신**:
    *   `index.html`의 `style.css`와 `main.js` 쿼리 버전을 `20260706-2`로 갱신.

#### **검증**
*   `node --check main.js` 통과.
*   `git diff --check` 통과.
*   정적 검증으로 7월 대회 아카이브의 첫 번째 이미지가 `images/archive-2026-07-11.jpeg`이고, 7월 갤러리 이미지 11장이 유지되는 것을 확인.
*   로컬 서버에서 `/`, `main.js?v=20260706-2`, `style.css?v=20260706-2`, `images/archive-2026-07-11.jpeg` 응답을 확인.

#### **기술적 결정 이유**
*   **데이터 순서만 변경**: 아카이브 대표 사진은 `images[0]`을 사용하는 기존 구조를 따르므로, 컴포넌트 로직 변경 없이 배열 순서만 조정해 변경 범위를 최소화.

---

### **[2026-07-06] 7/4 석노협 스크린골프대회 사진 아카이브 추가**

#### **주요 변경 사항**
*   **7월 대회 아카이브 추가**:
    *   2026년 7월 4일 골프존파크 삼산한국골프점에서 열린 제8회 석노협 스크린골프대회 기록을 아카이브 최상단 Featured Round로 추가.
    *   기존 일정 데이터의 일시, 장소, 주관, 경기 방식, A/B팀 참가 정보, 투비전 NX·용원 GC 백로·무학 경기 조건을 상세 기록으로 정리.
*   **사진 갤러리 정리**:
    *   업로드된 JPEG/JPG 사진 11장을 `images/archive-2026-07-*` 규칙으로 정리하고 라이트박스 갤러리에 연결.
    *   `images/20260704 MOV.mov` 파일은 요청대로 참조하거나 스테이징하지 않고 추후 개선 범위로 보존.
*   **완료 기록 톤 조정 및 캐시 갱신**:
    *   7월 대회 문구를 `참가 예정`에서 `참가 완료`와 사진 기록 안내 중심으로 정리.
    *   하단 공지는 새 아카이브 사진 보기 흐름으로 변경.
    *   `index.html`의 `style.css`와 `main.js` 쿼리 버전을 `20260706-1`로 갱신.

#### **검증**
*   `node --check main.js` 통과.
*   `git diff --check` 통과.
*   정적 검증 스크립트로 7월 아카이브 이미지 11장 참조, 실제 파일 존재, 기존 `20260704 (...)` 파일명 미참조, `MOV` 미참조를 확인.
*   로컬 서버(`python3 -m http.server 4173 --bind 127.0.0.1`)에서 `/`, `/index.html`, `main.js?v=20260706-1`, `style.css?v=20260706-1`, 7월 아카이브 이미지 11장 모두 `200` 응답 확인.
*   정적 렌더링 구조 검증으로 `제8회 석노협 스크린골프대회`, `참가 완료`, `New Archive`, `20260706-1`, 아카이브 이미지 11장 데이터가 반영된 것을 확인.
*   Chromium headless DOM/스크린샷 검증은 현재 환경의 DBus 및 한글 폰트 렌더링 오류(`platform_font_skia`, `render_text_harfbuzz`)와 코어 덤프로 완료하지 못함. 이전 기록과 같은 환경 이슈로 판단하고 정적 검색, 자산 존재, 로컬 서버 응답, 렌더링 데이터 구조 검증으로 보완.

#### **기술적 결정 이유**
*   **대표 사진 선정**: 카드 썸네일에는 가로 구도와 경기 맥락이 안정적인 타석 사진을 먼저 배치하고, 대회 시작 화면, 경기 진행, 대기, 시상·식사 장면 순으로 갤러리 흐름을 구성.
*   **동영상 분리**: 업로드된 `MOV`는 추후 개선 요청 범위이므로 코드 참조와 커밋 대상에서 제외해 이번 배포의 변경 범위를 사진 아카이브로 제한.
*   **완료 기록 톤**: 2026년 7월 4일 대회는 현재 날짜 기준 완료된 행사이므로, 일정/공지 문구를 예정 안내가 아닌 기록 안내로 조정해 방문자 혼선을 줄임.

---

### **[2026-07-02] 신입회원 3명 회원명부 추가**

#### **주요 변경 사항**
*   **신입회원 추가**:
    *   서승규, 안상욱, 박동성 회원을 `신입회원`으로 회원명부에 추가.
    *   별도 닉네임이 없으므로 카드의 닉네임 위치에는 각각 이름을 그대로 표시.
    *   이름 옆 특징 문구로 서승규 `침착한 코스 리딩`, 안상욱 `강한 임팩트`, 박동성 `클러치 퍼팅`을 추가.
*   **동물 SVG 중복 방지**:
    *   기존 18종 동물 SVG에 늑대(`1f43a`), 상어(`1f988`), 코뿔소(`1f98f`)를 추가해 21명 전원이 다른 동물 이미지를 사용하도록 조정.
    *   새 동물 3종은 Twemoji SVG 15.0.0 자산으로 연결하고 기존 접근성 라벨 구조를 유지.
*   **회원명부 분류 및 캐시 갱신**:
    *   회장/총무만 운영진 그리드에 배치하고, 신입회원은 정회원과 같은 회원 그리드에 표시되도록 분류 로직을 정리.
    *   히어로 회원 수를 21명으로 갱신하고 `index.html`의 `style.css`와 `main.js` 쿼리 버전을 `20260702-2`로 갱신.

#### **검증**
*   `node --check main.js` 통과.
*   `git diff --check` 통과.
*   로컬 서버(`python3 -m http.server 4173 --bind 127.0.0.1`)에서 `/`, `main.js?v=20260702-2`, `style.css?v=20260702-2` 모두 `200` 응답 확인.
*   정적 검증 스크립트로 회원 21명, 동물 ID 21개, 이모티콘 코드 21개가 모두 고유하고 신입회원 3명의 이름/닉네임 표시가 존재함을 확인.
*   새 Twemoji SVG 자산 3개(`1f43a.svg`, `1f988.svg`, `1f98f.svg`) 모두 `200` 응답 확인.
*   `jsdom` 런타임 검증으로 신입회원 3명이 회원 그리드에 표시되고, 닉네임 위치 이름 표시, 특징 문구, `신입회원` 역할, 동물 매핑(`wolf`, `shark`, `rhino`), 히어로 회원 수 `21명`이 모두 반영된 것을 확인.

#### **기술적 결정 이유**
*   **신입회원 역할 유지**: 새 회원을 `정회원`으로 흡수하지 않고 `신입회원` 배지를 보여주되, 운영진 영역에 섞이지 않도록 회장/총무만 운영진으로 분류함.
*   **기존 이미지 체계 유지**: 새 파일을 만들지 않고 기존 Twemoji SVG CDN 체계를 확장해 이미지 품질과 렌더링 방식을 일관되게 유지함.

---

### **[2026-07-02] 제8회 석노협 스크린골프대회 참가 안내 업데이트**

#### **주요 변경 사항**
*   **7월 대회 일정 반영**:
    *   2026년 7월 4일(토) 08:00 골프존파크 삼산한국골프점에서 열리는 제8회 석노협 의장배 스크린골프대회 참가 안내를 일정 보드에 반영.
    *   메인 일정은 일시, 장소, 회사별 4인 1팀 방식, 투비전 NX, 용원 GC 백로·무학, 코오롱인더스트리 A/B팀 선수 명단 중심으로 간결하게 구성.
*   **공지/하단 안내 갱신**:
    *   공지 모달에 A팀(301호), B팀(302호), 주요 경기 설정, 퍼팅 가이드/방향키 제한 등 핵심 조건을 정리.
    *   위치 모달과 하단 공지를 7월 대회 기준으로 교체.
    *   히어로 메타와 CTA를 `Next Event`, `대회 일정 보기` 흐름으로 조정.
*   **캐시 및 문서 갱신**:
    *   `index.html`의 `style.css`와 `main.js` 쿼리 버전을 `20260702-1`로 갱신.
    *   `TASK.md`와 `blueprint.md`에 이번 변경 범위와 현재 상태를 기록.

#### **검증**
*   `node --check main.js` 통과.
*   `git diff --check` 통과.
*   로컬 서버(`python3 -m http.server 4173 --bind 127.0.0.1`)에서 `/`, `main.js?v=20260702-1`, `style.css?v=20260702-1` 모두 `200` 응답 확인.
*   정적 검색으로 7월 대회명, 일시, 장소, A/B팀 선수 명단, 캐시 버전 `20260702-1` 반영 확인.
*   기존 6월 행사 문구는 `archives`의 지난 행사 기록에만 남고, 일정/공지 CTA의 오래된 6월 안내 문구는 제거된 것을 확인.
*   `jsdom` 런타임 검증으로 일정 보드, 하단 공지, 공지 모달에 새 대회 문구가 생성되고 필수 문자열 누락이 없음을 확인. `jsdom`은 `oklch()` 등 최신 CSS 일부를 파싱하지 못해 CSS 파서 경고가 있었으나 JS 렌더링 검증에는 영향 없음.
*   Chromium/Playwright headless 시각 검증은 현재 환경의 DBus 및 한글 폰트 렌더링 오류(`platform_font_skia`, `render_text_harfbuzz`)로 페이지 크래시 또는 타임아웃되어 완료하지 못함. 이전 기록과 같은 환경 이슈로 판단하고 정적 검색, 로컬 서버 응답, `jsdom` 런타임 검증으로 보완.

#### **기술적 결정 이유**
*   **핵심 정보 우선**: 홈페이지 첫 화면과 일정 보드는 방문자가 바로 알아야 하는 일시, 장소, 방식, 참가 선수만 남기고, 세부 경기 설정은 공지 모달로 분리해 화면 밀도를 낮춤.
*   **지난 행사 기록 유지**: 6월 스크린 행사는 아카이브의 완료 기록으로 남겨 동호회 활동 흐름을 보존하고, 현재 일정/공지 영역만 7월 대회 중심으로 전환함.

---

### **[2026-06-29] 6월 행사 사진 노출 범위 조정**

#### **주요 변경 사항**
*   **메인 대표 사진 복구**:
    *   히어로 슬라이드에서 `images/archive-2026-06-1.jpeg`를 제거하고 기존 4월 베이스타즈CC 대표 사진 순서로 복구.
    *   히어로 사진 위 기록 카드도 4월 행사 기준인 `Hole-in-one`, `STARS 8번 홀 · 이동수 팀장`으로 되돌림.
*   **배경/공유 이미지 복구**:
    *   풀폭 활동 배너 이미지를 `images/archive-2026-04-1.png`와 4월 필드 행사 문구로 복구.
    *   Open Graph 대표 이미지와 hero preload 이미지를 `images/archive-2026-04-2.png`로 복구.
    *   `index.html`의 `style.css`와 `main.js` 쿼리 버전을 `20260629-1`로 갱신.
*   **6월 행사 사진 유지 범위 정리**:
    *   6월 행사 사진과 공지 이미지는 `archives`의 2026년 6월 23일 행사 갤러리에서만 참조되도록 유지.

#### **검증**
*   `node --check main.js` 통과.
*   `git diff --check` 통과.
*   새 대표 이미지와 행사 이미지 자산 존재 확인: `images/archive-2026-04-1.png`, `images/archive-2026-04-2.png`, `images/archive-2026-06-1.jpeg`, `images/archive-2026-06-notice.png`.
*   `index.html`, `main.js`, `style.css` 정적 검색으로 6월 행사 사진 경로가 `archives`의 2026년 6월 23일 행사 갤러리 배열에만 남아 있는지 확인.
*   로컬 서버(`python3 -m http.server 4173`)에서 `/`, `/index.html`, `main.js?v=20260629-1`, `style.css?v=20260629-1`, 복구된 4월 이미지 2종, 6월 행사 이미지 2종 모두 `200` 응답 확인.
*   Chromium headless DOM/스크린샷 검증은 현재 환경의 한글 폰트 렌더링 오류(`render_text_harfbuzz`)로 종료 코드 `133` 또는 타임아웃이 발생해 완료하지 못함. 이전 기록과 같은 환경 이슈로 판단하고 정적 검색, 자산 존재, 로컬 서버 응답으로 보완.

#### **기술적 결정 이유**
*   **대표 이미지와 행사 기록 분리**: 6월 사진은 해당 행사 기록에만 보이도록 두고, 홈페이지 첫 화면과 공유 미리보기는 기존 동호회 대표 이미지 흐름을 유지하는 편이 요청 의도에 맞음.
*   **자산 삭제 없음**: 6월 사진 파일은 행사 갤러리에서 계속 필요하므로 삭제하지 않고 참조 위치만 조정함.

---

### **[2026-06-26] 2026년 6월 스크린 행사 업데이트**

#### **주요 변경 사항**
*   **6월 스크린 행사 일정 반영**:
    *   `2026년 6월.png` 공지 기준으로 2026년 6월 23일(화) 17:00 골프존파크 두왕테크노점 행사를 일정 보드, 공지 모달, 위치 모달, 하단 공지에 반영.
    *   동강시스타CC, 18홀 스트로크, G투어모드/블루, 그린 스피드 약간 빠름, 컨시드 1.5m, 멀리건 없음 등 주요 경기 조건을 상세 기록으로 정리.
    *   참석자 6명(서무환, 정무근, 김영주, 김효준, 김경수, 하선재)을 일정 상세와 아카이브에 표시.
*   **아카이브 및 대표 이미지 갱신**:
    *   `IMG_1816.jpeg`를 `images/archive-2026-06-1.jpeg`로 추가해 최신 아카이브와 히어로 대표 사진에 연결.
    *   공지 원본 이미지를 `images/archive-2026-06-notice.png`로 보관하고 6월 아카이브 라이트박스 갤러리에 포함.
    *   4월 베이스타즈CC 기록은 최신 다음 카드로 유지하면서 6월 스크린 행사를 Featured Round로 배치.
*   **회원명부 수정 및 캐시 갱신**:
    *   오상택 회원 닉네임을 `오프로672`로 수정.
    *   `index.html`의 `style.css`와 `main.js` 쿼리 버전을 `20260626-1`로 갱신하고 공유 대표 이미지를 6월 행사 사진으로 변경.

#### **검증**
*   `node --check main.js` 통과.
*   `git diff --check` 통과.
*   새 자산 `images/archive-2026-06-1.jpeg`, `images/archive-2026-06-notice.png` 존재 확인.
*   정적 검색으로 6월 행사명, 참석자 명단, `오프로672`, `20260626-1`, 새 이미지 경로 반영 확인.
*   `main.js`와 `index.html`에서 기존 `2분기 말`, `2026년 2분기`, `세부 일정 준비 중` 문구가 제거된 것을 확인.
*   로컬 서버(`python3 -m http.server 4173`)에서 `index.html`, `main.js?v=20260626-1`, `style.css?v=20260626-1`, 6월 행사 사진/공지 이미지 모두 `200` 응답 확인.
*   Chromium headless DOM/스크린샷 검증은 현재 환경의 DBus 및 한글 폰트 렌더링 오류(`platform_font_skia`, `render_text_harfbuzz`)로 DOM 출력 없이 타임아웃되어 완료하지 못함. 기존 기록과 같은 환경 이슈로 판단하고 정적/자산/서버 응답 검증으로 보완.

#### **기술적 결정 이유**
*   **최신 행사 우선 배치**: 6월 행사는 현재 가장 최근 행사이므로 아카이브 첫 번째 Featured Round와 히어로 대표 사진으로 배치해 방문자가 바로 확인하도록 함.
*   **공지 원본 보관**: 일정 텍스트만 옮기면 원본 공지 확인이 어려우므로 공지 이미지를 라이트박스 갤러리에 함께 두어 세부 조건을 재확인할 수 있게 함.
*   **기존 구조 유지**: Web Components와 데이터 배열 기반 구조를 그대로 유지하고 데이터/문구/자산만 갱신해 변경 범위를 좁힘.

---

### **[2026-05-22] 회원명부 동물 이모티콘 고화질 개선**

#### **주요 변경 사항**
*   **회원명부 캐릭터 교체**:
    *   기존 회원별 inline SVG 스프라이트 캐릭터를 제거하고, 18명 각각에 다른 컬러 동물 이모티콘 이미지를 배치.
    *   `@twemoji/svg@15.0.0` SVG 자산을 사용해 운영체제별 네이티브 이모지 차이와 기존 SVG 식별성 문제를 줄임.
    *   사슴, 여우, 곰, 수달, 부엉이, 호랑이, 말, 독수리, 돌고래, 표범, 백조, 판다, 원숭이, 코끼리, 사자, 고슴도치, 펭귄, 플라밍고 18종을 고유하게 매핑.
*   **명부 카드 시각 보강**:
    *   이모티콘 전용 광택 배지와 OKLCH 기반 개별 배경색을 추가해 카드 안에서 동물 형태가 더 크게 보이도록 조정.
    *   운영진 카드 대비 스타일과 모바일 크기 보정을 함께 적용.
    *   기존 `role="img"`와 회원명/동물명 포함 `aria-label`을 유지.
*   **캐시 갱신**:
    *   `index.html`의 `style.css`와 `main.js` 쿼리 버전을 `20260522-1`로 갱신.

#### **검증**
*   `node --check main.js` 통과.
*   `git diff --check` 통과.
*   로컬 서버(`python3 -m http.server 4173`)에서 `main.js?v=20260522-1`, `style.css?v=20260522-1` 모두 `200` 응답 확인.
*   동물 이모티콘 SVG 자산 18개가 모두 `200` 응답하는 것을 확인.
*   정적 검증 스크립트로 동물 ID 18개, 이모티콘 코드 18개가 모두 고유함을 확인.
*   Chromium headless DOM/스크린샷 검증은 현재 환경의 원격 폰트 및 한글 glyph 렌더링 오류(`remote_font_face_source`, `render_text_harfbuzz`)로 타임아웃되어 완료하지 못함. 기존 검증 로그와 같은 환경 이슈로 판단하고, DOM/자산/정적 검증으로 보완.
*   원격 최신 변경 위에 리베이스 후 커밋 `af17eff`를 GitHub `main` 브랜치에 SSH 푸시 완료.
*   `https://kolongolf.pages.dev/`, `https://moogun-jeong.github.io/kolongolf/`에서 `20260522-1` 캐시 버전과 `@twemoji/svg@15.0.0` 회원 이모티콘 렌더링 코드 반영 확인.

#### **기술적 결정 이유**
*   **SVG 이미지 이모티콘 선택**: 네이티브 이모지는 OS와 폰트에 따라 모양이 달라지고 headless 환경에서는 렌더링이 불안정할 수 있어, 동일한 고화질 SVG 이모티콘 이미지로 통일.
*   **기존 구조 유지**: Web Components 기반 명부 렌더링과 검색 기능은 유지하고, 캐릭터 렌더링 함수와 CSS 배지만 교체해 변경 범위를 좁힘.
*   **접근성 보존**: 시각 자산은 `aria-hidden` 처리하고, 의미는 컨테이너의 `aria-label`에 회원명과 동물명을 담아 전달.

---

### **[2026-05-10] 방명록 및 아카이브 댓글 기능 추가**

#### **주요 변경 사항**
*   **회원 참여 기능 추가**:
    *   `Archive`와 `Join Us` 사이에 방명록 섹션을 추가해 방문자가 이름과 한마디를 남길 수 있도록 구성.
    *   아카이브 사진 라이트박스 안에 라운드별 댓글 영역을 추가해 각 행사에 대한 댓글을 확인하고 작성할 수 있도록 개선.
*   **Cloudflare Pages Functions 백엔드 추가**:
    *   `/api/messages` API를 추가해 방명록과 아카이브 댓글을 같은 엔드포인트에서 조회/작성하도록 구현.
    *   Cloudflare D1용 `messages` 테이블 마이그레이션을 추가하고, `DB` binding을 사용하는 구조로 설계.
    *   작성 제한, IP/User-Agent 해시 저장, 선택적 Turnstile 서버 검증을 넣어 기본적인 스팸 방어를 준비.
*   **배포 설정 보강**:
    *   `_routes.json`으로 `/api/*`만 Functions가 처리하도록 제한.
    *   `wrangler.toml`과 README의 Cloudflare 설정 안내를 추가.
    *   GitHub Pages 화면에서도 Cloudflare Functions API를 호출할 수 있도록 `message-api-base`를 `https://kolongolf.pages.dev/api`로 지정.
    *   캐시 버전을 `20260510-3`으로 갱신.

#### **검증**
*   `node --check main.js` 통과.
*   `node --check functions/api/messages.js` 통과.
*   `git diff --check` 통과.
*   GitHub `main` 브랜치 푸시 후 정적 배포 갱신 확인.

#### **기술적 결정 이유**
*   **D1 선택**: 댓글은 아카이브별 조회와 최신순 정렬이 필요하므로 KV보다 SQL 기반 D1이 관리와 확장에 적합함.
*   **라이트박스 댓글 배치**: 아카이브 카드마다 댓글 폼을 노출하면 화면이 복잡해지므로, 사진을 열었을 때 해당 라운드 댓글을 함께 보도록 구성.

---

### **[2026-05-10] 회원 관점 홈페이지 문구 개선**

#### **주요 변경 사항**
*   **운영자 중심 표현 정리**:
    *   `페이지에서 확인`, `홈페이지 일정`, `운영 흐름`, `정리합니다`처럼 사이트 기능 설명에 가까운 문장을 줄임.
    *   히어로, 소개, 원칙 카드, 일정 섹션, 모달 문구를 회원이 읽는 자연스러운 동호회 톤으로 수정.
*   **다음 모임 안내 톤 조정**:
    *   확정 전 일정은 행정 공지처럼 보이지 않도록 `준비 중`, `함께 나눌 예정` 중심으로 표현.
    *   아카이브 설명은 카드 구조 설명 대신 함께했던 라운드의 분위기를 보여주는 문장으로 변경.
*   **캐시 갱신**:
    *   `index.html`의 `style.css`와 `main.js` 쿼리 버전을 `20260510-2`로 갱신.

#### **검증**
*   `node --check main.js` 통과.
*   `git diff --check` 통과.
*   GitHub `main` 브랜치 푸시 후 GitHub Pages 공개 URL에서 새 캐시 버전 확인.

#### **기술적 결정 이유**
*   **회원 관점 우선**: 방문자는 운영자가 무엇을 정리했는지보다 어떤 모임인지, 다음 만남이 어떤 분위기인지 알고 싶어 하므로 경험 중심 문장으로 바꿈.

---

### **[2026-05-10] 홈페이지 체감 품질 개선**

#### **주요 변경 사항**
*   **첫 화면 정체성 강화**:
    *   히어로 제목을 `코오롱 스크린 골프 동호회`로 바꿔 방문자가 첫 화면에서 사이트 성격을 바로 이해하도록 조정.
    *   메뉴와 푸터 내비게이션을 한국어 중심으로 정리해 일정, 회원, 기록 탐색성을 높임.
*   **이미지 로딩 개선**:
    *   대용량 원본 사진은 유지하면서, 웹 화면 표시용 `*-display.jpg` 이미지를 추가.
    *   2026년 3월 행사와 2025년 주요 아카이브 사진을 1800px 기준으로 줄여 히어로/아카이브 로딩 부담을 낮춤.
*   **모바일 사용성 및 공유 품질 개선**:
    *   하단 일정 공지가 모바일에서 화면을 덜 가리도록 컴팩트한 배치로 조정.
    *   Open Graph, Twitter card, theme color, hero preload, 캐시 버전 `20260510-1`을 반영.
    *   `README.md`를 실제 프로젝트 설명으로 정리.

#### **검증**
*   `node --check main.js` 통과.
*   `git diff --check` 통과.
*   `main` 브랜치 푸시 후 GitHub Pages 배포 대상 파일 갱신.

#### **기술적 결정 이유**
*   **원본 보존형 최적화**: 원본 사진을 삭제하거나 덮어쓰지 않고 표시용 파일만 추가해 향후 재편집 가능성을 남김.
*   **브랜드 우선 히어로**: 감성 문구보다 동호회명을 먼저 보여주는 것이 신규 방문자의 이해와 공유 미리보기 품질에 유리함.

---

### **[2026-05-07] SVG 비주얼 보강 및 회원 동물 캐릭터 개선**

#### **주요 변경 사항**
*   **홈 전역 SVG 장식 보강**:
    *   히어로, 소개, 일정 보드, 아카이브, 가입 CTA 구간에 inline SVG 코스 라인·그린·플래그 장식을 추가.
    *   실사 사진을 대체하지 않고 배경 질감과 정보 위계를 보완하는 낮은 대비 그래픽으로 배치.
    *   원칙 카드의 CSS 도형 아이콘을 라운드·스코어카드·사진 기록을 표현하는 SVG 아이콘으로 교체.
*   **회원명부 캐릭터 개선**:
    *   기존 골프 소품형 회원 마크를 18명 각각의 개별 동물 캐릭터 SVG 스프라이트로 교체.
    *   회원 이름 옆에 캐릭터가 붙도록 카드 내부 레이아웃을 조정하고, 각 캐릭터에 회원명 포함 `aria-label`을 부여.
    *   OKLCH 기반 hue 변수를 사용해 캐릭터별 색감을 다르게 주면서 프리미엄 클럽 톤과 어울리게 조정.
*   **캐시 갱신**:
    *   `index.html`의 `style.css`와 `main.js` 쿼리 버전을 `20260507-1`로 갱신.

#### **검증**
*   `node --check main.js` 통과.
*   `git diff --check` 통과.
*   로컬 서버(`python3 -m http.server 4173`)에서 `index.html`, `main.js?v=20260507-1`, `style.css?v=20260507-1` 모두 `200` 응답 확인.
*   Chromium `--dump-dom`으로 `hero-course-svg`, `intro-course-svg`, `schedule-course-svg`, `archive-course-svg`, `join-flag-svg`, `member-animal`, `animal-stag`, `20260507-1` 렌더링 확인.
*   데스크톱 스크린샷 `/tmp/kolongolf-svg-desktop.png` 생성. 현재 headless Chromium 환경의 한글/원격 폰트 렌더링 오류로 모바일 스크린샷은 완료하지 못해 DOM 확인과 반응형 CSS 점검으로 보완.

#### **기술적 결정 이유**
*   **inline SVG 선택**: 정적 홈페이지 구조를 유지하면서 파일 요청 수를 늘리지 않고, 캐시 버전 갱신만으로 빠르게 배포할 수 있음.
*   **장식과 정보의 분리**: 코스 라인 SVG는 `aria-hidden`으로 처리하고, 회원 캐릭터만 의미 있는 `role="img"`와 라벨을 부여해 접근성을 유지.
*   **사진 보완형 그래픽**: 실사 이미지가 이미 행사 신뢰도를 주고 있으므로, 새 SVG는 사진을 가리지 않는 보조 장식과 회원명부의 개성 강화에 집중.

---

### **[2026-05-06] 프리미엄 골프 클럽형 홈페이지 전면 개선**

#### **주요 변경 사항**
*   **프리미엄 디자인 시스템 적용**:
    *   `style.css`를 딥그린·아이보리·골드 중심의 OKLCH 토큰으로 재정리.
    *   헤더, 버튼, 배지, 섹션 키커, 하단 공지까지 같은 클럽 톤으로 통일.
    *   배경 코스 라인, 얇은 골드 라인, 사진 오버레이, 카드 호버 등 절제된 질감 요소를 추가.
*   **홈 주요 섹션 재구성**:
    *   히어로 카피를 `함께 걷는 페어웨이, 함께 만드는 라운딩의 품격`으로 교체하고, 사진 영역·메타 스트립·코스 카드의 위계를 강화.
    *   일정 섹션을 `Next Round Board` 형태로 바꿔 상태, 장소, 방식, 참가 안내가 한눈에 읽히도록 구성.
    *   회원명부는 `Club Staff`와 일반 회원 그리드로 분리하고, 골프 도메인형 마크와 역할 배지로 정돈.
    *   최신 아카이브를 `Featured Round` 큰 카드로 분리해 2026년 4월 베이스타즈CC 기록과 수상 배지가 먼저 돋보이도록 개선.
*   **상호작용 및 접근성 보강**:
    *   현재 섹션을 감지해 데스크톱 내비게이션에 `aria-current="page"`를 적용.
    *   히어로 이미지 전환을 페이드 기반으로 조정하고, `prefers-reduced-motion`에서는 전환 부담을 줄임.
    *   모바일 헤더, 검색, 모달, 하단 공지는 기존 Web Components 구조를 유지하며 새 디자인에 맞게 재스타일링.
*   **캐시 갱신**:
    *   `index.html`의 `style.css`와 `main.js` 쿼리 버전을 `20260506-1`로 갱신.
    *   favicon을 새 딥그린·골드 플래그 심볼로 교체.

#### **검증**
*   `node --check main.js` 통과.
*   `git diff --check` 통과.
*   로컬 서버(`python3 -m http.server 4173`)에서 `index.html`, `style.css?v=20260506-1`, `main.js?v=20260506-1` 모두 `200` 응답 확인.
*   Chromium `--dump-dom`으로 `Kolon Golf Society`, 새 히어로 문구, `Next Round Board`, `Club Members`, `featured-round`, `bottom-notice`, `20260506-1` 렌더링 확인.
*   데스크톱 스크린샷 `/tmp/kolongolf-premium-desktop.png` 생성. 현재 headless Chromium 환경의 한글 폰트 렌더링 오류로 모바일 스크린샷은 완료하지 못해 DOM 확인과 반응형 CSS 점검으로 보완.
*   커밋 `bf97ef4`를 GitHub `main` 브랜치에 SSH로 푸시 완료.
*   Cloudflare Pages 체크 `Cloudflare Pages` 성공 및 preview URL `https://1df18509.kolongolf.pages.dev/` 배포 확인.
*   `https://kolongolf.pages.dev/`, `https://moogun-jeong.github.io/kolongolf/`에서 `20260506-1` 캐시 버전과 새 `main.js`/`style.css` 렌더링 확인.

#### **기술적 결정 이유**
*   **구조 유지형 전면 개선**: Web Components 기반 구조는 안정적이므로 섹션 계약은 유지하고 데이터, 마크업 위계, 스타일 시스템을 크게 개선하는 방식이 배포 위험이 낮음.
*   **클럽형 무드 강화**: 기존 밝은 서비스형 인상에서 벗어나되, 40~60대 회원의 읽기 편의와 운영 안정성을 위해 과한 3D보다 사진, 색감, 선, 배지, 부드러운 전환 중심으로 설계.
*   **최신 기록 우선순위**: 홀인원과 공동 1위 기록이 있는 2026년 4월 필드 행사는 일반 카드와 같은 위계로 두기보다 대표 기록으로 분리하는 편이 방문자 이해에 적합함.

---

### **[2026-05-06] 홈 디자인 진단 및 개선 설계 문서화**

#### **주요 변경 사항**
*   **현재 홈 구조 진단**:
    *   `index.html`, `main.js`, `style.css` 기준으로 Web Components 섹션 구성, 히어로 슬라이더, 일정 공지, 회원 검색, 아카이브 라이트박스 구조를 검토.
    *   현재 화면이 밝은 서비스형 구조로는 안정적이지만, `home_redisign.md`의 프리미엄 동호회형 감성은 색감과 시각 계층에서 더 보강할 여지가 있음을 정리.
*   **개선 설계 문서화**:
    *   `home_redisign.md`에 2026-05-06 기준 디자인 진단 및 개선 설계 섹션 추가.
    *   헤더, 히어로, 소개/운영 원칙, 이미지 스테이트먼트, 일정, 회원명부, 아카이브, CTA/푸터의 구간별 개선 방향을 문서화.
    *   딥그린·아이보리·골드 중심 색상 시스템, 절제된 모션 원칙, Phase 1~3 구현 우선순위와 완료 기준을 정리.

#### **검증**
*   로컬 서버(`python3 -m http.server 4173`)에서 홈페이지 DOM 렌더링 확인.
*   Chromium `--dump-dom`으로 히어로, 일정, 회원명부, 아카이브, 하단 공지, 푸터 렌더링 확인.
*   데스크톱 스크린샷 `/tmp/kolongolf-desktop-review.png` 생성. 현재 headless Chromium 환경은 한글 폰트 렌더링 오류가 있어 텍스트 시각 검증은 DOM 확인으로 보완.
*   이번 작업은 문서화 범위이므로 홈페이지 런타임 코드 변경은 수행하지 않음.

#### **기술적 결정 이유**
*   **구조 유지형 고도화**: 현재 홈은 이미 Web Components와 `@layer` 기반 스타일 시스템을 갖추고 있어, 전면 재작성보다 색상 토큰·히어로·일정·아카이브 위계를 단계적으로 고도화하는 편이 변경 위험이 낮음.
*   **효과 절제**: 동호회 사용자의 읽기 편의와 운영 안정성을 위해 강한 3D/패럴랙스보다 CSS 기반 질감, 사진 전환, 카드 호버, 스크롤 리빌 중심으로 설계.

---

### **[2026-04-30] 방문자용 행사 소개 문구 전반 개선**

#### **주요 변경 사항**
*   **행사 문구 전반 점검**:
    *   일정, 아카이브, 이미지 배너, 모달, 라이트박스 문구에서 내부 작업 내역처럼 보이는 표현을 정리.
    *   `반영했습니다`, `업데이트합니다`, `기록 완료`, `보관했습니다`류 표현을 방문자가 읽기 쉬운 행사 소개 문장으로 수정.
*   **4월 행사 소개 톤 정리**:
    *   베이스타즈CC 라운딩, 이동수 팀장 홀인원, 전체 1위 시상, 중식 모임이 자연스럽게 이어지도록 일정 카드와 아카이브 문구를 조정.
*   **캐시 갱신**:
    *   `main.js` 변경 반영을 위해 `index.html`의 스크립트 쿼리 버전을 `20260430-4`로 갱신.

#### **검증**
*   `node --check main.js` 통과.
*   `git diff --check` 통과.
*   `main.js` 본문에서 `반영했습니다`, `업데이트합니다`, `기록 완료`, `보관했습니다`, `남겼습니다` 표현이 남아 있지 않음을 확인.
*   로컬 서버에서 `index.html`, `main.js?v=20260430-4`, `style.css?v=20260430-1` `200` 응답 확인.
*   Chromium `--dump-dom`으로 새 일정/아카이브/행사 보기 문구와 `20260430-4` 캐시 버전 렌더링 확인.
*   GitHub `main` 브랜치 푸시 및 GitHub Pages 배포 반영 확인 완료.

#### **기술적 결정 이유**
*   **방문자 중심 정보 구조**: 홈페이지 본문은 운영자가 무엇을 수정했는지보다 방문자가 어떤 모임이 있었고 다음 일정이 무엇인지 바로 이해하는 문장으로 구성하는 것이 적합함.

---

### **[2026-04-30] 2026년 4월 베이스타즈CC 요약 문구 개선**

#### **주요 변경 사항**
*   **아카이브 요약 문구 조정**:
    *   `기록을 남겼습니다`처럼 내부 작업 설명으로 읽히는 표현을 제거.
    *   조별 티오프, 명촌 중식 모임, 이동수 팀장 홀인원, 전체 1위 시상이 자연스럽게 이어지도록 문장을 수정.
*   **캐시 갱신**:
    *   `main.js` 변경 반영을 위해 `index.html`의 스크립트 쿼리 버전을 `20260430-3`으로 갱신.

#### **검증**
*   `node --check main.js` 통과.
*   `git diff --check` 통과.
*   로컬 서버에서 `index.html`, `main.js?v=20260430-3` `200` 응답 확인.
*   Chromium `--dump-dom`으로 새 요약 문구와 기존 홀인원/수상 상세 기록 렌더링 확인.

#### **기술적 결정 이유**
*   **방문자 관점 문장**: 아카이브 카드는 작업 내역이 아니라 행사 경험을 소개하는 영역이므로, 기록 행위보다 행사 내용과 시상 분위기가 먼저 읽히도록 조정.

---

### **[2026-04-30] 2026년 4월 베이스타즈CC 수상 기록 추가**

#### **주요 변경 사항**
*   **4월 필드 행사 아카이브 보강**:
    *   이동수 팀장의 STARS 8번 홀 홀인원 기록을 상세 기록에 추가.
    *   필드 전체 1위 기록을 권순노 팀장, 서무환 팀장 공동 1위로 추가.
    *   니어리스트는 이동수, 다버디는 심재호로 수상 기록을 정리.
*   **일정 섹션 문구 보강**:
    *   4월 필드 행사 기록 완료 안내에 홀인원과 수상 기록 반영 내용을 추가.
*   **캐시 갱신**:
    *   `main.js` 변경 반영을 위해 `index.html`의 스크립트 쿼리 버전을 `20260430-2`로 갱신.

#### **검증**
*   `node --check main.js` 통과.
*   `git diff --check` 통과.
*   로컬 서버에서 `index.html`, `main.js?v=20260430-2`, `style.css?v=20260430-1` `200` 응답 확인.
*   Chromium `--dump-dom`으로 홀인원, STARS 8번 홀, 공동 1위, 니어리스트 이동수, 다버디 심재호 문구 렌더링 확인.
*   GitHub `main` 브랜치 푸시 및 GitHub Pages 배포 반영 확인 완료.

#### **기술적 결정 이유**
*   **아카이브 중심 기록**: 완료된 필드 행사의 성과 기록은 일정 안내보다 아카이브 상세 정보에 남기는 것이 탐색 맥락에 맞음.
*   **검색 가능한 텍스트 보존**: 홀인원, 공동 1위, 니어리스트, 다버디 기록을 이미지가 아닌 텍스트 데이터로 남겨 이후 검색과 수정이 쉽도록 처리.

---

### **[2026-04-30] 회원명부 SVG 동물 아이콘 추가**

#### **주요 변경 사항**
*   **가벼운 SVG 스프라이트 추가**:
    *   회원명부 섹션 안에 18종 동물 라인 아이콘을 `<symbol>`로 정의.
    *   각 회원 카드는 `<use>` 참조로 아이콘을 호출해 반복 SVG 마크업을 최소화.
*   **회원 카드 레이아웃 개선**:
    *   역할과 아이콘을 카드 상단에 정렬하고, 실제 이름은 굵게 처리해 닉네임/이름/특징의 위계를 정리.
    *   기존 장식 원형 요소를 은은한 배경 하이라이트로 바꾸어 아이콘과 충돌하지 않게 조정.
*   **캐시 갱신**:
    *   `main.js`, `style.css` 변경 반영을 위해 `index.html`의 쿼리 버전을 `20260430-1`로 갱신.
*   **GitHub Pages 배포 안정화**:
    *   정적 파일을 Jekyll 처리 없이 그대로 배포하도록 `.nojekyll`을 추가.

#### **검증**
*   `node --check main.js` 통과.
*   `git diff --check` 통과.
*   로컬 서버에서 `index.html`, `main.js?v=20260430-1`, `style.css?v=20260430-1` `200` 응답 확인.
*   Chromium `--dump-dom`으로 회원 SVG 18개, 스프라이트 심볼 18개, `currentColor` stroke 속성 렌더링 확인.
*   GitHub `main` 브랜치 푸시 및 GitHub Pages 배포 반영 확인 완료.

#### **기술적 결정 이유**
*   **토큰/파일 크기 절감**: 카드마다 전체 SVG를 반복하지 않고 스프라이트와 `<use>`를 사용해 DOM 반복을 줄임.
*   **디자인 일관성**: 단색 라인 아이콘과 8px 이하 반경 배지로 기존 서비스형 카드 디자인을 유지.
*   **접근성 유지**: 각 아이콘에 `aria-label`을 부여해 보조 기술에서도 의미가 전달되도록 처리.

---

### **[2026-04-29] 메인 히어로 소개 문구 정리**

#### **주요 변경 사항**
*   **첫 화면 카피 조정**:
    *   히어로 설명 문구에서 `4월 필드 행사` 직접 언급을 제거.
    *   방문자가 처음 읽는 문장이 동호회 자체의 성격을 먼저 설명하도록 `함께 라운드하고 기록을 나누는 사내 골프 모임` 중심으로 수정.
*   **히어로 보조 정보 정리**:
    *   정보 스트립의 `Latest 4월 필드` 표현을 `Archive 라운드 기록`으로 변경.
    *   히어로 이미지 태그를 `FIELD 04`에서 `CLUB PHOTO`로 변경해 특정 행사보다 동호회 사진이라는 맥락을 앞세움.
*   **캐시 갱신**:
    *   `main.js` 변경 반영을 위해 `index.html`의 스크립트 쿼리 버전을 `20260429-6`으로 갱신.

#### **검증**
*   `node --check main.js` 통과.
*   `python3 -m http.server 4173` 로컬 서버에서 `index.html`, `main.js?v=20260429-6` `200` 응답 확인.
*   Chromium `--dump-dom`으로 새 히어로 문구, `Archive 라운드 기록`, `CLUB PHOTO` 렌더링 확인.
*   GitHub 기기 인증 코드 만료로 원격 푸시와 GitHub Pages 배포 확인은 대기 상태.

#### **기술적 결정 이유**
*   **첫인상 우선순위**: 완료된 특정 행사보다 동호회 목적과 활동 방식이 먼저 읽혀야 신규 방문자가 페이지의 성격을 빠르게 이해할 수 있음.
*   **기록 정보 분리**: 4월 행사는 아카이브와 사진 기록에서 충분히 다루고, 히어로는 전체 동호회 소개 역할에 집중하도록 분리.

---

### **[2026-04-29] 디자인 요소 보강 및 하단 일정 공지 팝업**

#### **주요 변경 사항**
*   **홈 시각 요소 보강**:
    *   페이지 배경에 미세한 사선 질감과 히어로 그리드 패턴, 하단 컬러 스트립을 추가해 기존 미니멀 구조의 밀도를 보강.
    *   히어로에 다음 일정, 최신 기록, 회원 수를 보여주는 정보 스트립과 사진 태그를 추가.
    *   일정 카드에 `Q2 Late` 날짜 락업, 상단 상태 라인, 장식 라인을 적용해 다음 행사 안내의 주목도를 높임.
    *   원칙/회원/아카이브 카드에 선, 아이콘, 호버 그림자, 작은 그래픽 디테일을 추가.
*   **하단 일정 공지 팝업 추가**:
    *   `<kolon-bottom-notice>` Web Component를 추가해 2026년 2분기 말 스크린 행사 예정 공지를 하단 고정형으로 노출.
    *   닫기 버튼, 상세 보기 버튼, `일주일간 열지 않기` 체크박스를 제공.
    *   체크 후 닫기 시 `kolongolf:bottom-notice:hidden-until` 키에 7일 만료 시각을 저장하고, 만료 전에는 공지를 숨김.
*   **반응형 처리**:
    *   모바일 폭에서는 하단 공지가 화면 좌우 여백에 맞춰 2열 구성으로 정리되도록 미디어 쿼리 추가.
    *   긴 안내 문구는 모바일에서 숨기고 핵심 제목/상태/액션만 남겨 팝업이 화면을 과도하게 가리지 않게 조정.

#### **검증**
*   `node --check main.js` 통과.
*   `python3 -m http.server 4173` 로컬 서버에서 `index.html`, `main.js`, `style.css`, 4월 행사 대표 이미지가 모두 `200` 응답 확인.
*   Chromium `--dump-dom`으로 `hero-meta-strip`, `event-date-lockup`, `bottom-notice`, `일주일간 열지 않기` DOM 렌더링 확인.
*   데스크톱 캡처 `/tmp/kolongolf-desktop.png` 생성 및 하단 공지 배치 확인. 현재 headless Chromium 환경은 한글 폰트 렌더링 오류가 있어 텍스트 시각 검증은 DOM 확인으로 보완.

#### **기술적 결정 이유**
*   **미니멀 유지**: 사용자가 요청한 "심플하지만 디자인 요소가 있는" 방향에 맞춰 큰 구조를 바꾸지 않고 배경 질감, 정보 스트립, 강조 패널처럼 기존 레이아웃을 해치지 않는 요소를 추가.
*   **공지 재사용성**: 하단 공지를 별도 Web Component와 `nextNotice` 데이터로 분리해 다음 공지 문구 교체 시 수정 범위를 좁힘.
*   **사용자 선택 존중**: `localStorage` 만료 시각 방식으로 일주일 숨김을 구현해 새 공지를 띄우되 반복 노출 피로도를 낮춤.

---

### **[2026-04-29] 2026년 4월 필드 행사 기록 및 다음 일정 업데이트**

#### **주요 변경 사항**
*   **4월 필드 행사 기록 반영**:
    *   `notice.png`의 행사 안내를 기준으로 2026년 4월 10일 베이스타즈CC 필드 행사 정보를 정리.
    *   조별 티오프(07:20 BAY, 07:55 BAY, 08:09 STARS), 비용 운영, 시상 항목을 아카이브 상세 기록으로 추가.
    *   `images/archive-2026-04-1.png`, `images/archive-2026-04-2.png`, `images/archive-2026-04-3.png`를 최신 행사 갤러리로 연결.
*   **홈 주요 이미지 최신화**:
    *   히어로 슬라이드 첫 순서를 4월 베이스타즈CC 필드 행사 사진으로 교체.
    *   풀폭 이미지 배너를 4월 행사 중식 모임 사진과 기록 중심 문구로 변경.
*   **다음 일정 안내 갱신**:
    *   일정 섹션과 공지 모달을 2026년 2분기 말 스크린 행사 예정 상태로 변경.
    *   장소, 세부 시간, 참가 방식은 추후 공지로 명확히 표기.

#### **검증**
*   `node --check main.js` 통과.
*   `python3 -m http.server 4173` 로컬 서버에서 페이지, JS, CSS, 4월 행사 이미지 3종 모두 `200` 응답 확인.
*   Chromium `--dump-dom`으로 2분기 말 스크린 행사 안내와 4월 베이스타즈CC 아카이브 DOM 렌더링 확인.
*   Chromium 데스크톱 스크린샷 생성 확인. 단, 현재 headless 환경에 한글 렌더링 폰트가 없어 텍스트 시각 검증은 DOM 확인으로 보완.

#### **기술적 결정 이유**
*   **기록 우선순위**: 4월 행사는 완료된 행사이므로 일정 섹션이 아닌 아카이브 맨 앞에 보관하고, 다음 행동이 필요한 2분기 말 스크린 행사를 일정 섹션에 배치.
*   **운영 정보 보존**: 안내문 전체를 이미지로 노출하기보다 실제 홈페이지 검색/읽기에 유리한 텍스트 데이터로 티오프, 비용, 시상 정보를 구조화.
*   **기존 UX 유지**: 새 사진도 기존 라이트박스와 히어로 슬라이더 데이터에만 연결해 Web Components 구조와 상호작용 방식을 유지.

---

### **[2026-04-29] 참고 이미지 기반 미니멀 서비스형 홈페이지 전면 리디자인**

#### **주요 변경 사항**
*   **홈 구조 전면 교체**:
    *   `index.html`을 Web Components 앱 셸 구조로 단순화.
    *   기존 와키 패럴랙스/오브/강한 글래스모피즘 구간을 제거하고, 참고 이미지의 흐름에 맞춰 히어로, 소개, 3개 핵심 블록, 이미지 배너, 일정, 회원명부, 아카이브, 가입 CTA, 푸터 순서로 재구성.
*   **Vanilla JS Custom Elements 적용**:
    *   `main.js`에서 `<kolon-site-header>`, `<kolon-hero>`, `<kolon-intro>`, `<kolon-principles>`, `<kolon-image-statement>`, `<kolon-schedule>`, `<kolon-members>`, `<kolon-archive>`, `<kolon-join>`, `<kolon-modal-stack>`, `<kolon-footer>`를 정의.
    *   회원 검색, 모바일 메뉴, 히어로 사진 전환, 모달, 사진 라이트박스, 스크롤 리빌, 진행률 표시를 Vanilla JS로 재구현.
*   **참고 이미지형 CSS 시스템 적용**:
    *   `style.css`를 `@layer reset/tokens/base/components/utilities` 구조로 재작성.
    *   컬러 토큰을 `oklch()` 기반으로 교체하고, 밝은 블루그레이 히어로, 흰색 카드, 다크 푸터, 얇은 네비게이션, 모바일 전용 헤더를 구현.
    *   Container Queries와 모바일 우선 미디어 쿼리로 회원/아카이브 그리드를 반응형 처리.
*   **로딩 안정성 수정**:
    *   `type="module"` 스크립트는 파일 직접 열기/일부 preview 환경에서 차단될 수 있어, import를 사용하지 않는 현재 구조에 맞춰 일반 `defer` 스크립트로 변경.

#### **검증**
*   `node --check main.js` 통과.
*   `python3 -m http.server 4173` 로컬 서버에서 Chromium DOM 렌더링 확인.
*   `file:///home/user/kolongolf/index.html` 직접 열기 방식에서도 Custom Elements 렌더링 확인.
*   데스크톱 스크린샷 생성 확인: `/tmp/kolongolf-home.png`.

#### **기술적 결정 이유**
*   **참고 이미지 충실도**: 강한 시각 효과보다 실사 사진과 정보 구조가 먼저 보이도록 레이아웃을 절제.
*   **운영 안정성**: 정적 홈페이지 성격에 맞게 빌드 도구 없이 동작하도록 일반 스크립트와 로컬 이미지 자산만 사용.
*   **데이터 유지**: 기존 회원 18명과 아카이브 기록을 유지하되, 카드형 리스트와 라이트박스로 탐색성을 개선.

---

### **[2026-04-29] 홈페이지 구조 학습 및 현재 상태 정리**

#### **주요 확인 사항**
*   **프로젝트 맥락 학습**:
    *   `AGENTS.md`, `TASK.md`, `PROJECT_LOG.md`, `GEMINI.md`, `blueprint.md`를 확인해 프로젝트의 프리미엄/모바일 우선 방향성과 운영 지침을 파악.
*   **현재 구현 구조 파악**:
    *   `index.html`은 히어로, 클럽 소개, 일정, 와키 스크롤 연출, 회원명부, 아카이브, 가입 배너, 모달/라이트박스로 구성된 단일 페이지.
    *   `main.js`는 회원 검색, 모달 열기/닫기, 사진 라이트박스, 앵커 스무스 스크롤, `IntersectionObserver` 리빌, 스크롤 진행률/패럴랙스/와키 이동 연출을 담당.
    *   `style.css`는 베이지/그린/골드 컬러 팔레트, 유리 질감 헤더, 히어로 캐릭터 연출, 카드 그리드, 모바일 반응형, 저동작 모드를 담당.
*   **문서-코드 차이 확인**:
    *   문서에는 Web Components, Three.js, OKLCH, CSS `@layer`가 목표 또는 완료 사항으로 기록되어 있으나, 현재 파일 기준 실제 구현은 정적 HTML과 DOM 기반 Vanilla JS, 일반 CSS 변수 중심임.

#### **기술적 결정 이유**
*   **실구현 기준 컨텍스트 분리**: 이후 작업에서 과거 리팩토링 기록과 현재 배포 파일 상태를 혼동하지 않도록, 문서상 목표와 현재 코드 상태를 명확히 구분해 기록.

---

### **[2026-03-25] `main` 브랜치 롤백 및 배포 상태 복구**

#### **주요 변경 사항**
*   **히스토리 보존형 롤백 수행**:
    *   `b1f692e` 이후의 커밋 `9cec10b`, `8e139a2`, `ab76df9`를 되돌려 단일 롤백 커밋 `a94a89f` 생성.
    *   생성된 커밋의 파일 트리가 요청 기준 커밋 `b1f692e`와 동일함을 확인.
*   **로컬 작업 보존**:
    *   충돌 가능성이 있는 기존 추적 파일 변경은 `git stash`의 `pre-rollback-to-b1f692e` 엔트리로 별도 보존.
*   **원격 반영 상태**:
    *   Code OSS askpass 경로를 유효한 `/nix/store` 위치로 교정한 뒤 `git push origin main`을 재시도해 `main -> origin/main` 반영 완료.

#### **기술적 결정 이유**
*   **강제 푸시 회피**: 원격 `main` 히스토리를 재작성하지 않고 동일한 결과 상태를 복구하기 위해 `reset --hard` 대신 `git revert --no-commit` + 단일 커밋 전략을 선택.
*   **작업 안전성 확보**: 커밋되지 않은 로컬 변경을 즉시 폐기하지 않고 `stash`로 격리해, 배포 복구와 사용자 작업 보존을 동시에 충족.

---

### **[2026-03-14] 프로젝트 프리미엄 고도화 리팩토링**

#### **주요 변경 사항**
*   **Web Components 도입**: 
    *   `<club-metric>`, `<member-card>`, `<three-golf-ball>` 정의.
    *   기존 `innerHTML` 기반 렌더링을 캡슐화된 커스텀 엘리먼트로 전환하여 재사용성 향상.
*   **Three.js 3D 비주얼 구현**:
    *   히어로 섹션 배경에 Icosahedron 기반의 기하학적 객체 배치.
    *   마우스 스크롤 및 브라우저 크기 조정 시 실시간 반응형 렌더링 적용.
*   **Modern CSS 시스템 구축**:
    *   `oklch()` 컬러 시스템으로 전체 컬러 변수 재정의.
    *   배경에 미세한 SVG 노이즈 텍스처 오버레이 추가 (Tactile Feel).
    *   CSS `@layer`를 활용하여 스타일 우선순위 관리 체계 수립.
    *   `:has()`를 사용하여 활성 필터 상태의 시각적 강조 구현.
*   **데이터 시각화**: 
    *   회원 활동량(라운드 참석 수)을 SVG 기반 막대 차트로 시각화.

#### **기술적 결정 이유**
*   **PWA 지향**: 외부 프레임워크 의존성을 제거하고 브라우저 네이티브 기술(Web Components, CSS Standard)만으로 최고 성능의 웹 경험을 제공하고자 함.
*   **브랜드 아이덴티티**: 사내 동호회지만 프리미엄 브랜드 느낌을 주기 위해 미세한 질감(Noise)과 동적인 시각 요소(Three.js)를 적극 활용함.

---

### **[2026-03-14] 동호회 활동 중심 콘텐츠 강화 및 시각 최적화**

#### **주요 변경 사항**
*   **콘텐츠 리얼리즘 강화**:
    *   전체 텍스트에서 개발 용어(업로드, 리팩토링 등) 배제.
    *   실제 골프 운영 데이터(신페리오 경기 방식, 니어리스트 시상 등)로 교체.
*   **중복 섹션 구조 개선**:
    *   중복된 "소개" 섹션을 "명예의 전당 & 시상 안내" 섹션으로 변경하여 정보 유용성 증대.
*   **Three.js 시각 효과 고도화**:
    *   단순 회전하던 3D 객체에 마우스 인터랙션 및 Sine Wave 부유 효과 추가.
    *   가독성 확보를 위해 투명도와 와이어프레임 밀도 최적화.
*   **인터랙션 및 레이아웃 수정**:
    *   `IntersectionObserver`를 활용한 리빌 애니메이션(Reveal) 로직 통합 관리.
    *   모바일 환경에서의 다이얼로그 및 메뉴 간섭 오류 수정.

#### **기술적 결정 이유**
*   **사용자 중심 설계**: 홈페이지의 목적이 기술 과시가 아닌 '동호회 활동 공유'임을 인지하고 사용자 경험을 실제 활동 도메인에 맞춤.
*   **성능 최적화**: 다수의 렌더링 함수 호출 후 `refreshRevealTargets`를 일괄 실행하여 브라우저 부하 최소화.

---

### **[2026-03-14] 동호회 전용성 강화 및 타이포그래피 최적화**

#### **주요 변경 사항**
*   **회원 대상 한정 및 문구 수정**:
    *   참가 대상을 '전 임직원'에서 '동호회 정회원 및 게스트'로 명확히 변경.
    *   멤버 카드 내 '최근 필드 티오프'를 '최근 모임 참가'로 변경하여 동호회 활동 중심 용어로 통일.
    *   `index.html` 내의 광범위한 표현(코오롱 가족 등)을 동호회 활동 관심자 대상으로 구체화.
*   **타이포그래피 및 레이아웃 안정화**:
    *   `body` 전체에 `word-break: keep-all` 및 `overflow-wrap: break-word`를 적용하여 한국어 텍스트가 부자연스럽게 끊기는 현상 방지.
    *   히어로 타이틀 및 리드 문구의 `max-width`를 확장하여 불필요한 줄바꿈 남발 억제.
    *   카드 내 요약 텍스트(`archive-summary`, `member-note`)에 `text-align: justify` 및 줄바꿈 최적화 적용.

#### **기술적 결정 이유**
*   **도메인 충실도**: 동호회 내부용 페이지임을 고려하여 불특정 다수가 아닌 멤버 중심의 폐쇄성과 전문성을 강화함.
*   **한글 가독성**: 한국어는 어절 단위 줄바꿈(`keep-all`)이 가독성에 큰 영향을 미치므로 이를 기본값으로 설정하여 '남발되는 줄바꿈' 문제를 해결함.

---

### **[2026-03-14] Apple/Samsung 스타일 전면 리디자인 개편**

#### **주요 변경 사항**
*   **디자인 컨셉 전면 교체**: 
    *   기존의 일반적인 웹 레이아웃을 폐기하고 Apple/Samsung 제품 페이지 스타일의 **Immersive UI** 도입.
    *   깊이 있는 다크 모드와 고해상도 타이포그래피(Giant Title) 적용.
*   **시각 효과 및 애니메이션**:
    *   **Three.js 엔진 업그레이드**: 고사양 메테리얼(Physical Material)이 적용된 Icosahedron 객체를 중앙 배치하고 스크롤 속도에 반응하는 인터랙션 구현.
    *   **Intersection Observer**: 모든 콘텐츠 섹션에 부드러운 스크롤 리빌(Reveal) 애니메이션 적용.
*   **콘텐츠 슬림화**:
    *   '행사 일정(Next Event)', '멤버(Players)', '사진 기록(History)'의 3대 핵심 콘텐츠 위주로 구조 단순화.
    *   불필요한 안내 섹션 및 복잡한 컴포넌트 과감히 제거.
*   **UI/UX 고도화**:
    *   글래스모피즘(Glassmorphism) 기반의 카드 시스템 및 오버레이 디자인.
    *   모바일 환경에서도 압도적인 시각적 몰입감을 유지하도록 반응형 레이아웃 재설계.

#### **기술적 결정 이유**
*   **Brand Experience**: 동호회를 하나의 프리미엄 브랜드처럼 인식하게 하여 멤버들의 소속감과 만족도 극대화.
*   **Focus on Core**: 사용자가 가장 보고 싶어 하는 정보에만 시각적 무게중심을 두어 정보 전달 효율성 향상.

---

### **[2026-03-14] 데이터 복구 및 프리미엄 디자인 통합**

#### **주요 변경 사항**
*   **전체 데이터 복원**: 
    *   리디자인 과정에서 생략되었던 18명의 멤버 상세 정보와 5개의 라운딩 기록(사진 포함)을 모두 복구.
*   **프리미엄 컴포넌트 확장**:
    *   **멤버 카드**: 18명의 멤버가 애플 스타일의 카드 그리드로 렌더링되도록 구현.
    *   **시네마틱 아카이브**: 5개의 라운딩 기록이 대형 이미지 타일로 배치되며, 클릭 시 프리미엄 모달 창을 통해 상세 내용과 사진 갤러리 확인 가능.
*   **Visual Engine 강화**:
    *   Three.js 배경에 마우스 움직임 보간(Interpolation)을 적용하여 더 부드러운 3D 인터랙션 제공.
    *   공간감을 주는 배경 입자(Particles) 효과 추가.

#### **기술적 결정 이유**
*   **Data-Rich Minimalism**: 화려하고 미니멀한 디자인을 유지하면서도, 실제 사용자가 필요한 방대한 정보를 효과적으로 구조화하여 제공함.
*   **Enhanced Interactivity**: 단순 스크롤을 넘어 마우스와 시선에 반응하는 레이아웃을 통해 몰입형 경험(Immersive Experience) 완성.

---
*로그 관리 중*
