# **TASK.md - 홈페이지 우선 개선 범위 정리**

현재의 소규모 콘텐츠 업데이트 운영 방식에 맞춰 방대한 최종 개선안에서 실제로 먼저 필요한 안전 조치와 완료 결과를 분리해 기록합니다.

## **0. 디자인 현대화 (Design Modernization) — Phase 0~3 완료 (2026-08-10)**

`DESIGN_MODERNIZATION_PLAN.md`의 진단과 로드맵을 그대로 실행했습니다. **다크 모드는 사용자 요청으로 제외**했습니다.

*   [x] **Phase 0. 토큰 시스템 재구축** — 유동 타이포 스케일 8단계, 4pt 간격 램프 8단계, 이징 4종, 2단 그림자 3단계, 반경 3단계, 포커스 링 1종 신설
*   [x] **Phase 0. `font-weight: 900` 버그 수정** — Inter가 900 페이스를 로드하지 않아 가짜 볼드가 합성되던 30곳을 `--weight-label`(650)로 교체
*   [x] **Phase 0. 이미지 대역폭·CLS** — 아카이브 카드 8장에 `srcset` 연결(display 6MB ↔ thumb 440KB), 이미지 31개에 `width`/`height` 부여
*   [x] **Phase 1. 값 이관** — `font-size` 108개 → 토큰, `oklch()` 리터럴 159→74, 간격 61종 → `--sp-*`, 반경 12종 → 3종, `text-wrap: balance/pretty` 적용
*   [x] **Phase 2. 모션 레이어 신설** — 커스텀 이징 도입(기존엔 전부 기본 `ease`), 스크롤 기반 리빌·패럴랙스, View Transitions(히어로 슬라이드·라이트박스)
*   [x] **Phase 2. 강제 리플로우 제거** — `initScrollProgress()`의 스크롤마다 `scrollHeight` 읽기를 `animation-timeline: scroll()`로 대체 (`HOMEPAGE_REVIEW.md` H-18 해소)
*   [x] **Phase 3. 가로 넘침 근본 수정** — `body { overflow-x: hidden }` 제거, 넘침 유발 요소를 섹션별 `overflow: clip`으로 지역화
*   [x] **Phase 3. 레이아웃 리듬** — 읽기 섹션 폭 축소(760px), 섹션 여백 3단계 위계, 원칙 카드 계단식 오프셋
*   [x] **Phase 3. 컨테이너 쿼리 실사용** — 격자를 `auto-fit`으로 전환해 미디어 쿼리 단계 지정 제거 (D-07)
*   [x] **Phase 3. 모달 → 네이티브 `<dialog>`** — 포커스 트랩·배경 inert·ESC를 브라우저에 위임 (`HOMEPAGE_REVIEW.md` H-08 해소)

**계획 대비 변경한 것 (판단 근거 포함)**

*   **`main` 명명 그리드 대신 `--section` 오버라이드 사용** — 이 프로젝트는 이미 `--section` 변수로 폭을 제어하고 있어, 같은 결과를 훨씬 적은 회귀 위험으로 얻을 수 있었습니다.
*   **`image-statement` 스티키 스크롤 미적용** — 해당 섹션의 카피가 키커+제목+뱃지뿐이라 스크롤될 내용이 없습니다. 스티키를 넣어도 시각적으로 아무 일도 일어나지 않아 패럴랙스만 적용했습니다.
*   **히어로 이미지 패럴랙스 미적용** — `.hero-course-card`가 히어로 경계 밖에 배치되어 있어 `overflow: clip`을 걸 수 없습니다. 패럴랙스는 클립이 가능한 `image-statement`에만 적용했습니다.
*   **모바일 메뉴 Popover 미적용** — 헤더 안에 인라인으로 펼쳐지는 내비게이션이라 최상위 레이어로 올리면 배치가 깨집니다. 포커스 트랩이 실제로 필요한 모달 쪽에만 `<dialog>`를 적용했습니다.

**검증**
*   jsdom 렌더 검증: 지원 브라우저 경로(리빌 CSS 위임)와 미지원 폴백 경로(IntersectionObserver) 양쪽에서 콘솔 오류 0건, 모달 열기/닫기 정상
*   `esbuild` CSS 파싱, `node --check` JS 문법, 로컬 wrangler 서버 200 확인

---

## **1. 현재 진행 중인 작업 (Current Active Task)**

> 2026-08-10 기준. GitHub Pages와 Cloudflare Pages의 공개 경계 및 운영 보안 설정을 모두 반영했습니다.
> 다음 활성 항목은 실제 DB 기능을 바꾸기 직전에 수행할 1-C이며, 그 전까지 운영 D1은 변경하지 않습니다.

*   [x] **1-A. Cloudflare Pages를 `dist/` 전용 배포로 전환** — build/output 설정, 비공개 경로 차단, 이전 캐시 무효화까지 완료
*   [x] **1-B. Cloudflare Pages 환경 변수 설정** (`MESSAGE_SALT`, `ADMIN_TOKEN`, Turnstile) — secret 값은 저장소·로그에 남기지 않고 production에 적용
*   [ ] 1-C. 다음 DB 기능 변경 **직전에** D1 migration chain 복구 (`PRIORITY_IMPROVEMENT_PLAN.md` 3장 순서 준수. 지금 당장 할 필요 없음)
*   [x] **1-D. `하선재`/`허선재` 표기를 회원명부·이전 행사 기록 기준인 `하선재`로 통일**
*   [x] **1-E. Wrangler 4.120.0 갱신, `npm audit` 0건, 로컬 full-stack·브라우저 재검증 완료**

---

### **재시작 후 첫 작업 체크포인트 — 완료 (2026-08-10)**

*   기존 Pages 프로젝트 `kolongolf`만 수정해 build command `npm run build`, output `dist`, root 빈 값으로 설정. 기존 D1 binding과 `ADMIN_TOKEN`은 보존.
*   Turnstile widget을 `kolongolf.pages.dev`, `moogun-jeong.github.io`에 연결하고 공개 sitekey를 프런트엔드에 반영. production에는 `MESSAGE_SALT`, `ADMIN_TOKEN`, `TURNSTILE_SECRET_KEY`, `SKIP_DEPENDENCY_INSTALL`이 설정됨(이름·타입만 확인, 값은 미출력).
*   Cloudflare의 이전 저장소 루트 자산 캐시를 1회성 tombstone 배포로 무효화한 뒤 flag를 제거. 현재 공개 파일과 API는 200, 저장소·개발·원본 이미지 경로는 404.
*   불허 Origin의 무효 메시지 POST와 비활성화된 사진 업로드 POST는 403. 운영 D1 write, migration, export, delete는 수행하지 않음.
*   실제 Turnstile 글쓰기 테스트는 D1 행을 추가하므로 별도 사용자 허락 전까지 보류. 자동 브라우저에서는 widget 로드와 입력 활성화까지 확인했으며, 실행 환경의 동적 challenge host DNS 실패로 challenge 완료 여부는 판정하지 않음.
*   마지막 코드 배포 기준 `main`은 `2abe779`, Cloudflare production deployment는 `9130cc5c-31ff-4e72-8595-d8bf0d50bfd6`, GitHub Pages workflow `31381941083`은 성공.
*   Replit Secret의 `CLOUDFLARE_ACCOUNT_ID`에는 계정 ID 대신 이메일이 들어 있어 향후 API 작업 전에 올바른 32자리 계정 ID로 교정 필요. 이번 작업은 GitHub 배포 check URL에서 확인한 실제 계정 ID를 메모리에만 사용함.

---

### **1-A. Cloudflare Pages `dist/` 전용 배포 전환 — 완료**

**완료 상태 / 왜 했는가**
GitHub Pages와 Cloudflare Pages 모두 2026-08-10에 `dist/` allowlist 배포로 전환했습니다. Cloudflare edge에 남은 이전 저장소 루트 응답은 private-route middleware와 1회성 tombstone 배포로 404 전환했습니다.

회귀 확인 명령 (둘 다 404가 정상):
```bash
curl -s -o /dev/null -w '%{http_code}\n' https://kolongolf.pages.dev/wrangler.toml
curl -s -o /dev/null -w '%{http_code}\n' https://kolongolf.pages.dev/PROJECT_LOG.md
```

`wrangler.toml`의 `pages_build_output_dir = "dist"`는 이미 커밋되어 있지만, **build command가 비어 있으면 `dist/`가 생성되지 않습니다**(`dist/`는 `.gitignore` 대상이라 저장소에 없음). 따라서 build command와 output directory를 **둘 다** 설정해야 합니다.

**방법 1 — 대시보드 (권장, 계정 로그인만 있으면 됨)**
1. Cloudflare 대시보드 → Workers & Pages → `kolongolf` → Settings → Builds & deployments
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Root directory: 비움(저장소 루트)
5. 저장 후 Deployments 탭 → 최신 배포 → **Retry deployment** (또는 아무 커밋이나 push)

**방법 2 — API (셸에서 처리하고 싶을 때)**
Cloudflare 대시보드 → My Profile → API Tokens → Create Custom Token,
권한은 **Account → Cloudflare Pages → Edit** 하나면 충분. TTL은 1일 권장.

```bash
export CLOUDFLARE_API_TOKEN='발급받은_토큰'
API=https://api.cloudflare.com/client/v4
AUTH="Authorization: Bearer $CLOUDFLARE_API_TOKEN"

# 계정 ID 확인
ACCOUNT_ID=$(curl -s -H "$AUTH" "$API/accounts" | jq -r '.result[0].id')

# 현재 build 설정 확인
curl -s -H "$AUTH" "$API/accounts/$ACCOUNT_ID/pages/projects/kolongolf" \
  | jq '.result.build_config'

# build command / output directory 변경
curl -s -X PATCH -H "$AUTH" -H 'Content-Type: application/json' \
  "$API/accounts/$ACCOUNT_ID/pages/projects/kolongolf" \
  -d '{"build_config":{"build_command":"npm run build","destination_dir":"dist","root_dir":""}}' \
  | jq '.success, .result.build_config'

# 재배포 트리거
curl -s -X POST -H "$AUTH" \
  "$API/accounts/$ACCOUNT_ID/pages/projects/kolongolf/deployments" | jq '.success'
```

**완료 판정 (빌드 끝난 뒤 실행)**
```bash
B=https://kolongolf.pages.dev
for p in / /main.js /style.css /robots.txt /sitemap.xml; do
  printf '%-16s %s  (기대: 200)\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' "$B$p")"; done
for p in /wrangler.toml /package.json /PROJECT_LOG.md /TASK.md /AGENTS.md /blueprint.md /home1.png; do
  printf '%-16s %s  (기대: 404)\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' "$B$p")"; done
# API가 살아있는지 (Functions는 dist/ 밖 functions/ 에서 그대로 동작해야 함)
curl -s -o /dev/null -w 'api %{http_code}  (기대: 200)\n' "$B/api/messages"
```
`/api/messages`가 404면 Functions가 깨진 것이므로 **즉시 이전 배포로 롤백**(Deployments → 직전 성공 배포 → Rollback)하고 원인부터 확인할 것.

---

### **1-B. Cloudflare Pages 환경 변수 설정 — 완료**

설정 위치: `kolongolf` → Settings → Environment variables → **Production**
(값 입력 후 **재배포해야** 반영됩니다. Functions는 배포 시점 환경을 읽음)

| 변수 | 값 | 비고 |
|---|---|---|
| `MESSAGE_SALT` | 임의 난수 32자 이상 | 아래 명령으로 생성. **한 번 정하면 바꾸지 말 것** — 바꾸면 기존 댓글 작성자 해시가 전부 어긋납니다 |
| `ADMIN_TOKEN` | 임의 난수 **16자 이상** | 16자 미만이면 서버가 거부 |
| `TURNSTILE_SECRET_KEY` | Turnstile 대시보드 발급값 | 없으면 공개 POST가 503 (fail-closed) |

난수 생성:
```bash
node -e "console.log('MESSAGE_SALT=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('ADMIN_TOKEN='  + require('crypto').randomBytes(24).toString('base64url'))"
```
생성값은 Cloudflare 대시보드에만 저장하고 저장소·채팅에 남기지 말 것. `ADMIN_TOKEN`은 비밀번호 관리자에 따로 보관.

**Turnstile (secret 하나로는 부족 — sitekey도 필요)**
1. Cloudflare 대시보드 → Turnstile → Add site
2. Domain에 `kolongolf.pages.dev`와 `moogun-jeong.github.io` 둘 다 등록
3. 발급된 **Secret key** → 위 표대로 환경 변수에 입력
4. 발급된 **Site key** → `index.html`의 Turnstile sitekey 자리에 입력 후 커밋·푸시
   ```bash
   grep -n -i 'turnstile\|sitekey' index.html main.js
   ```
   (sitekey는 공개 값이라 저장소에 커밋해도 됩니다. secret만 비밀)

**완료 판정**: 홈페이지 방명록/댓글 입력창 활성화와 Turnstile widget 로드를 확인. 실제 한 건 작성·표시는 운영 D1 write이므로 별도 허락을 받은 뒤 수동 확인합니다.

---

### **셸이 초기화된 뒤 다시 시작할 때 (환경 복구 메모)**

*   **GitHub 인증**: 워크스페이스가 초기화되면 `gh` 로그인이 풀립니다. 저장소 push 자체는 Replit 기본 자격증명으로 되지만, **`.github/workflows/` 아래 파일을 건드리는 커밋은 `workflow` scope가 없으면 거부**됩니다. 그때는:
    ```bash
    gh auth login --hostname github.com --git-protocol https --web --scopes workflow
    gh auth setup-git
    ```
    브라우저에 one-time code를 입력하는 device flow입니다. (`gh`는 토큰을 작업 트리 안 `.config/gh/hosts.yml`에 평문 저장하므로 `.gitignore`에 `.config/`를 넣어 두었습니다. 지우지 말 것)
*   **Cloudflare 인증**: `wrangler login`은 이 환경에서 **동작하지 않습니다.** OAuth 콜백이 컨테이너 안 `localhost:8976`으로 돌아오는데 브라우저는 로컬 PC에 있어 도달하지 못합니다. 반드시 위 1-A의 API 토큰 방식을 쓸 것.
*   **로컬 개발 재시작**: `npm start` (= `wrangler pages dev`, 정적 + `/api` + 로컬 D1). 첫 실행 시 `.dev.vars`와 로컬 D1 스키마를 자동 생성합니다. `.dev.vars`의 `ALLOW_INSECURE_WRITES`는 **로컬 전용** — 운영 환경 변수에 절대 넣지 말 것.
*   **배포 전 점검 3종**:
    ```bash
    node scripts/build.js                 # dist 생성 (루트 9개 + 이미지 48장)
    npm run preview:static                # dist만 서빙되는지 로컬 확인
    git fetch origin && git status --short # 워킹 트리 clean / origin과 동기 확인
    ```

## **2. 완료된 작업 (Completed Tasks)**
*   [x] **GitHub Pages `dist/` 전용 배포 적용 완료**
    *   `.github/workflows/pages.yml`을 `0dd09ee`로 커밋·푸시 (`gh auth login --scopes workflow`로 OAuth `workflow` scope 확보 후 해결)
    *   저장소 Settings > Pages > Source를 **GitHub Actions**로 변경하고 workflow run `31363627933` build/deploy 성공 확인
    *   운영 검증: `/`, `/main.js`, `/style.css`, `/robots.txt`, `/sitemap.xml`, `/404.html` 200 / `wrangler.toml`, `package.json`, `PROJECT_LOG.md`, `AGENTS.md`, `blueprint.md`, `lib/api-security.mjs`, `migrations/*.sql`, `home1.png` 전부 404
    *   `dist/images` 48장 전량 200 응답, `index.html`·`main.js`·`style.css`가 참조하는 이미지 중 누락 0건 확인
*   [x] **우선 개선 계획 P0/P1 구현**
    *   `scripts/build.js` allowlist 빌드로 공개 배포 범위를 `dist/`로 제한하고, `firebase-debug.log`를 Git tree에서 제거
    *   Replit Run을 `wrangler pages dev` full stack으로 전환해 로컬 D1만 쓰도록 분리하고, 프런트엔드는 같은 출처 `/api`를 호출하도록 변경
    *   댓글 쓰기를 fail-closed로 강화 (Turnstile secret·`MESSAGE_SALT` 필수, Origin 검증, 속도 제한, 관리자 상수 시간 비교와 인증 실패 제한)
    *   지난 7월 행사를 `다음 모임`으로 안내하지 않도록 `upcomingEvents` 기반으로 전환하고, 확정 일정이 없으면 하단 일정 공지를 표시하지 않음
    *   사용하지 않는 회원 공개 사진 업로드를 화면·서버 양쪽에서 비활성화 (기존 데이터는 삭제하지 않고 읽기 전용 유지)
*   [x] **홈페이지 우선 개선 계획 수립**
    *   정상 운영 중인 화면과 댓글 흐름은 유지하고 공개 배포 경계, Replit 운영 API 오접속, 댓글 봇 방어, 지난 일정만 우선 개선 대상으로 선정
    *   공개 사진 업로드를 사용하지 않으면 비활성화해 R2 작업을 생략하고, D1 migration은 다음 DB 변경 직전에 복구하도록 범위 축소
    *   `PRIORITY_IMPROVEMENT_PLAN.md`에 권장 실행 순서, 제외 범위, 최소 완료 기준 기록
*   [x] **마이그레이션 및 홈페이지 최종 개선안 수립**
    *   두 리뷰의 핵심 진단을 현재 소스, local 재현, 운영 URL 읽기 응답, npm 보안 상태와 교차 검증
    *   `#admin` 숨김, 미정 Event 날짜, 원격 preflight 없는 D1 migration 등 위험하거나 과장된 제안을 보정
    *   `FINAL_IMPROVEMENT_PLAN.md`에 목표 구조, 7개 phase, PR 의존성, 파일별 변경, 롤백, CI 성능 budget, 전체 완료 기준을 문서화
*   [x] **Firebase Studio → Replit 마이그레이션 종합 진단**
    *   Replit Run, Cloudflare Pages, GitHub Pages, D1 migration, 프런트엔드 품질을 종합 점검
    *   공개 파일 노출, 운영 API 오접속, 로컬 서버 종료, D1 schema 불일치 등 우선 조치 항목 재현
    *   `REPLIT_MIGRATION_AUDIT.md`에 P0/P1/P2 개선안과 단계별 로드맵 기록
*   [x] **아카이브 다중 사진 표시 강화**
    *   아카이브 대표 이미지 위에 사진 수 배지와 갤러리 안내 패널 추가
    *   모바일에서도 사진 수와 터치 유도가 잘 보이도록 스타일 조정
*   [x] **7/4 아카이브 대표 사진 변경**
    *   2026년 7월 4일 제8회 석노협 스크린골프대회 아카이브의 대표 사진을 `images/archive-2026-07-11.jpeg`로 변경
    *   기존 11장 갤러리 구성은 유지하고 대표 노출 순서만 조정
    *   검증 후 GitHub `main` 브랜치 푸시 완료
*   [x] **7/4 석노협 스크린골프대회 사진 아카이브 추가**
    *   2026년 7월 4일 제8회 석노협 스크린골프대회 기록을 아카이브 최상단에 추가
    *   JPEG/JPG 사진 11장을 `images/archive-2026-07-*` 규칙으로 정리하고 라이트박스 갤러리에 연결
    *   업로드된 `MOV` 파일은 요청대로 참조하거나 스테이징하지 않고 추후 개선 범위로 보존
*   [x] **신입회원 3명 회원명부 추가**
    *   서승규, 안상욱, 박동성 신입회원을 회원명부에 추가하고, 닉네임이 없는 회원은 이름을 닉네임 위치에 표시
    *   기존과 중복되지 않는 동물 SVG 이미지를 연결하고, 신입회원이 운영진이 아닌 회원 그리드에 표시되도록 분류 로직 정리
    *   문법, 중복 동물, 렌더링 검증 후 GitHub `main` 브랜치 푸시 완료
*   [x] **제8회 석노협 스크린골프대회 참가 안내 업데이트**
    *   울산석유화학공업단지 노동조합 협의회 주관 제8회 의장배 스크린골프대회 참가 안내를 홈페이지 일정, 공지 모달, 하단 공지에 핵심 정보 중심으로 반영
    *   문법, 정적 검색, 로컬 서버, `jsdom` 런타임 검증 완료 및 Chromium headless 환경 이슈 기록
*   [x] **6월 행사 사진 노출 범위 조정**
    *   2026년 6월 23일 스크린 행사 사진은 해당 행사 기록에만 유지하고, 메인 히어로 사진·풀폭 활동 배너·공유 대표 이미지는 기존 4월 행사 자산으로 복구
    *   정적 검색, 자산 존재, 로컬 서버 응답 검증 후 GitHub `main` 푸시 및 배포 확인 완료
*   [x] **프리미엄 골프 클럽형 홈페이지 전면 개선**
    *   `home_redisign.md` 설계에 맞춰 딥그린·아이보리·골드 기반의 클럽형 디자인 시스템 적용
    *   헤더, 히어로, 소개, 일정, 회원명부, 아카이브, 가입 CTA, 푸터, 하단 공지의 시각 위계 전면 개선
    *   문법, 정적 서버, Chromium DOM/스크린샷 기반 렌더링 검증 후 GitHub SSH 푸시 및 배포 확인 완료
*   [x] **홈 디자인 진단 및 개선 설계 문서화**
    *   `home_redisign.md` 참고 방향과 현재 Web Components 기반 홈 구조를 비교해 개선 구간 정리
    *   히어로, 헤더, 일정, 회원명부, 아카이브, CTA/푸터의 구간별 개선안과 구현 우선순위 문서화
*   [x] **방문자용 행사 소개 문구 전반 개선**
    *   `반영했습니다`, `업데이트합니다`, `기록 완료`처럼 운영 작업으로 들리는 표현을 행사 소개 톤으로 수정
    *   일정, 아카이브, 모달, 라이트박스 안내 문구를 함께 점검
*   [x] **2026년 4월 베이스타즈CC 요약 문구 개선**
    *   `기록을 남겼습니다` 식의 작업 설명 문구를 행사 소개 중심 문장으로 수정
*   [x] **2026년 4월 베이스타즈CC 수상 기록 추가**
    *   이동수 팀장 STARS 8번 홀 홀인원 기록 추가
    *   권순노 팀장, 서무환 팀장 공동 1위와 니어리스트/다버디 수상 기록 추가
*   [x] **회원명부 SVG 동물 아이콘 추가**
    *   회원 카드마다 가벼운 inline SVG 동물 아이콘을 배치하고 카드 레이아웃을 정리
    *   SVG 스프라이트와 `<use>` 참조 방식으로 반복 마크업을 줄임
*   [x] **메인 히어로 문구 정리**
    *   첫 화면 설명 문구를 특정 행사 기록이 아닌 동호회 소개 중심으로 수정
    *   히어로 보조 정보와 사진 태그에서도 4월 행사 중심 표현을 덜어냄
*   [x] **디자인 요소 보강 및 하단 일정 공지 팝업 배포**
    *   `c52a092` 커밋으로 GitHub `main`에 푸시하고 GitHub Pages 배포 완료
*   [x] **디자인 요소 보강 및 하단 일정 공지 팝업**
    *   미니멀 서비스형 구조를 유지하면서 히어로/일정/카드 구간에 질감, 정보 스트립, 강조 요소를 추가 완료
    *   2026년 2분기 말 스크린 행사 예정 공지를 하단 고정 팝업으로 노출하고, 체크 후 닫기 시 7일간 숨김 처리 완료
*   [x] **2026년 4월 필드 행사 기록 업데이트**
    *   `notice.png`와 `images/archive-2026-04-*.png`를 바탕으로 2026년 4월 10일 베이스타즈CC 필드 행사 기록을 아카이브에 반영 완료
    *   다음 일정은 2026년 2분기 말 스크린 행사 예정 및 상세 추후 공지 상태로 반영 완료
*   [x] **미니멀 서비스형 홈페이지 전면 리디자인**
    *   `home1.png`, `home2.png`, `mobile1.png` 참고 이미지를 기반으로 밝은 배경·실사 이미지·정돈된 정보 카드 중심의 서비스형 홈페이지로 전면 개편 완료
    *   Web Components 기반 홈 섹션, 모바일 메뉴, 회원 검색, 모달, 사진 라이트박스, 리빌 애니메이션 구현 완료
*   [x] **디자인 컨셉 혁신**
    *   Apple/Samsung 스타일의 고해상도 타이포그래피 및 다크 테마 적용 완료
    *   글래스모피즘 기반의 UI 컴포넌트 재설계 완료
*   [x] **시각적 임팩트 강화**
    *   Three.js를 활용한 역동적인 3D 인터랙션 배경 구축 완료
    *   스크롤 기반 섹션별 리빌(Reveal) 애니메이션 구현 완료
*   [x] **핵심 콘텐츠 집중**
    *   불필요한 섹션 제거 및 '일정', '멤버', '기록' 중심의 3단 구조 개편 완료
    *   시네마틱 갤러리 뷰 구현 완료

## **3. 아이디어 백로그 (Idea Backlog)**
*   멤버 카드 클릭 시 개별 전적/통계 팝업 레이어 추가
*   갤러리 이미지 확대 시 슬릭(Sleek)한 슬라이드 애니메이션 보강
*   스크롤 깊이에 따른 배경 컬러 변이(Transition) 효과

---
*마지막 업데이트: 2026-08-10*
