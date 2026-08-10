# Firebase Studio → Replit 마이그레이션 종합 진단

- 진단일: 2026-08-09 (UTC)
- 대상 저장소: `kolongolf`
- 범위: Replit 실행 환경, 정적 배포, Cloudflare Pages Functions/D1, 프런트엔드 구조, 보안, 성능, 접근성, 운영 문서
- 성격: 현황 진단 및 개선 제안. 이 문서 작성 시점에는 운영 코드나 원격 데이터에 수정·삭제를 수행하지 않았습니다.

## 1. 결론

홈페이지 자체는 완성도가 높고 현재 공개 URL도 정상 렌더링됩니다. Vanilla JS Web Components, OKLCH 기반 디자인 시스템, 반응형 레이아웃, 이미지 파생본, 방명록·댓글·회원 업로드·관리자 승인까지 기능 범위도 충분합니다.

그러나 Replit을 새 기준 환경으로 삼기 전에 반드시 해결해야 할 문제가 있습니다.

1. **저장소 루트가 그대로 공개되고 있습니다.** 현재 Cloudflare Pages와 GitHub Pages에서 `firebase-debug.log`, `README.md`, `wrangler.toml`, 마이그레이션 SQL 등이 HTTP 200으로 내려옵니다. Firebase 로그에는 개인 계정 식별 정보와 개발 요청 기록이 포함되어 있습니다.
2. **Replit Run은 로컬 API가 아니라 운영 Cloudflare API를 사용합니다.** Run 버튼의 `npm start`는 정적 서버만 띄우며, 이 화면에서 방명록이나 사진 업로드를 시험하면 운영 데이터에 쓰기를 시도합니다.
3. **Replit 정적 서버가 저장소 전체를 서비스하며 잘못 인코딩된 URL 한 번에 종료됩니다.** 공개 미리보기 또는 배포 서버로 사용하기에 안전하지 않습니다.
4. **D1의 배포 마이그레이션과 로컬 스키마가 서로 다릅니다.** 새 DB를 공식 마이그레이션으로 재구축하면 현재 메시지 API의 INSERT가 실패합니다.

따라서 권장 운영 형태는 다음과 같습니다.

```text
Replit: 주 개발 환경 + 로컬 전체 스택 미리보기
GitHub: 소스 저장소 + CI
Cloudflare Pages: 단일 운영 배포
Cloudflare D1: 메시지/메타데이터
Cloudflare R2: 회원 업로드 사진
GitHub Pages: 공개 배포 중단 또는 대표 도메인으로 리다이렉트
```

Replit 자체를 운영 호스팅으로도 쓰고 싶다면 별도 선택지로 진행할 수 있지만, 현재 `npm start` 서버를 그대로 배포해서는 안 됩니다.

## 2. 현재 홈페이지 구조

### 2.1 프런트엔드

- 빌드 프레임워크 없는 `index.html` + `style.css` + `main.js` 단일 페이지입니다.
- 13개 Custom Element가 헤더, 히어로, 소개, 일정, 회원, 아카이브, 방명록, 가입, 모달, 하단 공지, 푸터를 렌더링합니다.
- 회원 21명과 기본 아카이브 8건은 `main.js`의 정적 배열로 관리됩니다.
- 히어로 슬라이드, 회원 검색, 모바일 메뉴, 모달, 라이트박스, 스크롤 리빌, 댓글, 회원 사진 업로드, 관리자 도구가 모두 `main.js`에 들어 있습니다.
- CSS는 `@layer reset, tokens, base, components, utilities`, OKLCH 컬러, Container Query, 저동작 모드를 사용합니다.
- 표시용 1800px 이미지와 400px 썸네일을 분리해 `images/`를 약 80MB에서 7.7MB로 줄인 상태입니다.

### 2.2 데이터/API

- `/api/messages`: 방명록과 아카이브 댓글 조회·등록·숨김·삭제
- `/api/archives`: 회원 아카이브 신청, 사진 업로드, 공개 승인·숨김·삭제
- Cloudflare Pages Functions가 API를 실행하고 `DB` D1 binding을 사용합니다.
- 관리 기능은 `ADMIN_TOKEN` Bearer 값으로 보호됩니다. 공개 운영 API에서 관리자 무인증 요청이 401을 반환하므로 토큰 자체는 설정된 상태로 보입니다.
- 방명록은 선택적 Turnstile 검증과 분당 IP 제한이 있고, 회원 아카이브 업로드는 10분당 2건 제한만 있습니다.
- 회원 업로드 사진은 브라우저에서 JPEG Data URL로 압축한 뒤 D1 텍스트 컬럼에 직접 저장합니다.

### 2.3 현재 환경별 실제 동작

| 환경 | 화면 | API | 현재 의미 |
| --- | --- | --- | --- |
| Replit Run (`npm start`, 5000) | 로컬 정적 서버 | `https://kolongolf.pages.dev/api` | 개발 화면이 운영 데이터에 연결됨 |
| Replit 셸 (`npm run dev`, 8788) | Wrangler Pages 로컬 서버 | 로컬 D1 | 전체 기능을 안전하게 검증할 수 있는 유일한 경로 |
| Cloudflare Pages | 정적 화면 + Functions | 운영 D1 | 사실상 전체 기능 운영 환경 |
| GitHub Pages | 정적 화면 | Cloudflare 운영 API | 두 번째 공개 프런트엔드 |

현재 문서에는 Replit을 개발 환경으로만 사용한다고 기록되어 있습니다. 사용자의 새 방향처럼 Replit을 주 작업 환경으로 삼으려면 Run 버튼부터 로컬 전체 스택을 실행하도록 기준을 바꿔야 합니다.

## 3. 잘 되어 있는 점

### UI/디자인

- 딥그린·아이보리·골드 팔레트와 실사 사진이 일관되어 동호회 정체성이 분명합니다.
- 데스크톱과 모바일 모두 가로 넘침이 없고, 헤더·히어로·일정·회원·아카이브의 시각 위계가 안정적입니다.
- 아카이브 사진 수, 썸네일, 대표 행사 강조, 회원 검색 등 실제 사용 흐름을 잘 보강했습니다.
- `prefers-reduced-motion`, 포커스 스타일, 폼 라벨, 이미지 대체 텍스트 등 접근성 기본기가 좋습니다.

### 기술/성능

- 외부 UI 프레임워크 없이 Custom Elements로 주요 영역을 분리했습니다.
- CSS Cascade Layer와 OKLCH 토큰을 실제로 사용해 프로젝트 지침을 대부분 충족합니다.
- 이미지 파생본 체계가 효과적입니다. Lighthouse에서도 초기 네트워크 총량은 약 899KiB로 대형 사진 사이트치고 과도하지 않았습니다.
- 사용자 텍스트는 대체로 `textContent` 또는 escape 처리 후 렌더링해 기본 XSS 방어가 되어 있습니다.
- 공개 업로드를 즉시 노출하지 않고 `pending` 상태로 관리자 승인 후 공개합니다.

### 운영

- `TASK.md`, `PROJECT_LOG.md`, `blueprint.md`에 변경 이력이 상세히 남아 있습니다.
- Node 22, Wrangler, 이미지 처리 명령이 `package.json`에 정리되어 있습니다.
- Cloudflare와 GitHub Pages의 공개 화면, Cloudflare 읽기 API는 진단 시점에 모두 HTTP 200으로 응답했습니다.

## 4. 발견 사항과 우선순위

우선순위 기준은 다음과 같습니다.

- **P0**: Replit을 공유하거나 공개하기 전에 즉시 조치
- **P1**: 첫 안정화 작업에서 처리
- **P2**: 안정화 이후 품질 개선

### P0-1. 개발 파일과 Firebase 로그가 현재 공개되어 있음

근거:

- `wrangler.toml`의 `pages_build_output_dir = "."`와 GitHub Pages 루트 배포 때문에 저장소의 추적 파일이 정적 자산으로 취급됩니다.
- 2026-08-09 실측 결과 아래 경로가 Cloudflare Pages와 GitHub Pages에서 HTTP 200을 반환했습니다.
  - `/firebase-debug.log` 19,038 bytes
  - `/README.md`
  - `/wrangler.toml`
  - `/migrations/0001_messages.sql`
  - `/.idx/mcp.json`
- `firebase-debug.log`에는 개인 계정 식별 정보와 Firebase Studio 개발 요청 기록이 포함되어 있습니다. 키워드 검사에서는 토큰·비밀번호가 확인되지 않았지만 공개 상태로 둘 이유가 없습니다.

영향:

- 개인정보와 내부 구조 노출
- 미래에 `.env`나 다른 로그가 실수로 추적될 경우 즉시 공개될 수 있음
- 공격자가 API 구조, DB 이름, 운영 도구를 불필요하게 쉽게 파악함

권고:

1. `firebase-debug.log`를 Git 추적 대상과 배포물에서 즉시 제거하고 캐시가 갱신됐는지 확인합니다.
2. `dist/` 또는 `public/`에 허용한 정적 자산만 복사하는 빌드 단계를 만듭니다.
3. Cloudflare `pages_build_output_dir`와 GitHub Pages artifact를 해당 디렉터리로 바꿉니다.
4. 공개 허용 목록은 `index.html`, `style.css`, 브라우저용 JS, `images/`, `robots.txt`, `sitemap.xml`, `_headers`, `_routes.json` 정도로 제한합니다.
5. 기존 로그에 인증 정보가 없었는지 한 번 더 비밀정보 스캔하고, 의심되는 자격 증명이 있다면 교체합니다.

### P0-2. Replit Run 화면이 운영 API에 연결됨

근거:

- `.replit`의 Run 명령은 `npm start`입니다.
- `npm start`는 Functions가 없는 `scripts/serve.js`만 실행합니다.
- `getMessageApiBase()`는 `localhost:8788`만 로컬 API로 인정합니다. Replit 포트 5000과 Replit 공개 미리보기 호스트는 모두 메타 태그의 운영 API를 선택합니다.
- Chromium으로 `http://127.0.0.1:5000/`을 열었을 때 실제 요청 10개가 모두 `https://kolongolf.pages.dev/api`로 향했습니다.

영향:

- 개발자가 방명록·댓글·회원 업로드·관리 기능을 시험하다 운영 데이터를 변경할 수 있음
- 로컬과 운영의 차이를 발견하기 어려움
- 인터넷 연결이나 Cloudflare 장애가 Replit 미리보기 장애처럼 보임

권고:

- Run 버튼이 `wrangler pages dev`와 로컬 D1을 포트 5000에서 실행하도록 변경합니다.
- 예: `wrangler pages dev dist --ip 0.0.0.0 --port 5000 --show-interactive-dev-session=false`
- 로컬 D1 초기화는 별도 `local-schema.sql`이 아니라 운영과 같은 migration chain을 사용합니다.
- 개발/미리보기/운영 API base를 URL 추측이 아닌 명시적 환경 설정으로 분리합니다.
- 운영 API 쓰기는 운영 도메인에서만 허용하도록 Origin 검증도 추가합니다.

### P0-3. Replit 정적 서버가 저장소 전체를 서비스함

근거:

- `scripts/serve.js`의 root가 저장소 루트입니다.
- 로컬 실측에서 `/.git/config`, `/wrangler.toml`, `/.idx/mcp.json`, `/firebase-debug.log`, `/package-lock.json`이 모두 HTTP 200을 반환했습니다.
- 잘못 인코딩된 `/%E0%A4%A` 요청 한 번으로 `decodeURIComponent()`가 `URIError`를 던졌고 Node 프로세스가 종료되었습니다.

영향:

- Replit 외부 포트가 공개될 경우 소스·설정·로그가 노출됨
- 단일 비정상 요청으로 미리보기 또는 배포 프로세스가 중단됨
- 향후 로컬 `.dev.vars`나 `.env`가 생기면 같은 서버가 서비스할 수 있음

권고:

- 이 서버를 공개 서버로 사용하지 않습니다.
- 유지할 경우에도 저장소 루트가 아닌 `dist/`만 서비스하고, URL 파싱 예외를 400으로 처리하며, dotfile 차단·HEAD 처리·보안 헤더를 추가합니다.
- 가장 단순한 해법은 Replit Run도 Wrangler 로컬 서버로 통일하는 것입니다.

### P1-1. D1 마이그레이션 체인과 로컬 스키마 불일치

근거:

| 항목 | `migrations/0001_messages.sql` | `sql/local-schema.sql` / 현재 API |
| --- | --- | --- |
| `id` | `TEXT PRIMARY KEY` | `INTEGER PRIMARY KEY AUTOINCREMENT` |
| 공개 상태 | `published` | `visible` |
| 생성 시각 | `INTEGER NOT NULL` | `TEXT DEFAULT CURRENT_TIMESTAMP` |
| 상태 범위 | `published/hidden/pending` | `visible/hidden` |

- 임시 D1에 `0001_messages.sql`만 적용한 뒤 현재 API와 같은 `status='visible'` INSERT를 실행하자 CHECK constraint 오류가 재현됐습니다.
- 운영 읽기 API는 현재 200이므로 원격 DB는 수동 또는 다른 방식으로 보정됐을 가능성이 있지만, Cloudflare API token이 이 환경에 없어 원격 스키마 자체는 확인하지 못했습니다.

영향:

- 새 개발자·새 Replit·재해 복구 시 DB를 동일하게 재구축할 수 없음
- 운영과 로컬에서만 나타나는 오류가 생길 수 있음
- 과거 migration 파일을 그대로 믿고 배포할 수 없음

권고:

- 기존 적용 이력을 보존하면서 `0003_messages_schema_v2.sql` 같은 보정 migration을 추가합니다.
- SQLite 테이블 재생성 → 데이터 변환(`published` → `visible`) → 인덱스 재생성 순서로 작성합니다.
- 이후 로컬 초기화도 `wrangler d1 migrations apply --local`을 사용하고 `local-schema.sql` 중복 정의를 제거합니다.
- 빈 DB부터 모든 migration을 적용한 뒤 API GET/POST/PATCH/DELETE를 검증하는 자동 테스트를 만듭니다.

### P1-2. 공개 쓰기 API의 스팸·남용 방어가 불완전함

근거:

- `cf-turnstile-sitekey` 메타 값이 비어 있습니다.
- 메시지 API의 Turnstile 검증은 `TURNSTILE_SECRET_KEY`가 있을 때만 동작합니다. site key와 secret이 한쪽만 설정되면 전면 실패 또는 무검증 상태가 됩니다.
- 회원 아카이브 업로드 API에는 Turnstile 검증이 없습니다.
- CORS가 `Access-Control-Allow-Origin: *`이며, API에서 요청 Origin 허용 목록을 검사하지 않습니다.
- 관리자 API는 단일 Bearer token 비교이며 인증 실패 rate limit이 없습니다.
- 기본 `MESSAGE_SALT`가 공개 문자열 `kolongolf`입니다.

영향:

- 자동화된 방명록 스팸과 대기 상태 사진 업로드로 D1 저장량이 늘어날 수 있음
- 제3자 사이트가 방문자 브라우저를 이용해 공개 POST를 보낼 수 있음
- 관리자 token brute-force 방어와 감사 로그가 부족함

권고:

- 메시지와 아카이브 업로드 모두 Turnstile을 운영에서 필수화하고 설정 누락 시 배포 검증을 실패시킵니다.
- 허용 Origin을 대표 운영 도메인과 필요한 미리보기 도메인으로 제한합니다.
- 관리자 화면은 Cloudflare Access 또는 별도 세션 인증 뒤에 두고 인증 실패 제한과 감사 로그를 추가합니다.
- `MESSAGE_SALT`는 강한 운영 secret으로 반드시 설정합니다.
- 콘텐츠·IP hash 보존 기간과 삭제 정책을 정합니다.

### P1-3. 회원 업로드 사진을 D1 Data URL로 저장함

근거:

- 한 신청당 최대 약 1.2M characters의 Base64 이미지를 `archive_post_images.image_data_url`에 저장합니다.
- 공개 목록은 게시물별로 이미지를 추가 조회하는 N+1 쿼리를 실행하고, JSON에 Data URL 전체를 포함합니다.

영향:

- 사진 수가 늘면 D1 크기, 쿼리 응답, Worker 메모리, 브라우저 JSON 파싱 비용이 빠르게 증가함
- 이미지 캐시, 썸네일, CDN 변환, 개별 삭제가 어려움

권고:

- 원본·표시용 이미지는 R2에 저장하고 D1에는 object key, MIME, 크기, width/height, alt, 상태만 저장합니다.
- 업로드 URL 발급 또는 Worker 중계 업로드를 사용하고, 공개 응답에는 썸네일 URL만 포함합니다.
- 관리자 승인 후에만 공개 URL을 노출합니다.

### P1-4. 개발 의존성 보안 업데이트 필요

근거:

- 현재 `wrangler`는 4.100.0이고 최신 설치 가능 버전은 진단 시점 기준 4.120.0이었습니다.
- `npm audit`에서 Wrangler 하위 의존성에 5개 high, 1개 low 취약점이 보고됐습니다.
- 대상은 운영 브라우저 번들보다는 Replit/로컬 개발 서버 의존성이지만, Replit이 주 환경이면 중요합니다.

권고:

- 별도 브랜치에서 Wrangler를 4.120.0 이상으로 올리고 local D1/API/Pages 동작을 재검증합니다.
- Dependabot 또는 정기 `npm audit` CI를 추가합니다.
- lockfile을 기준으로 Replit 시작 시 `npm ci`를 사용합니다.

### P1-5. 모바일 초기 표시 성능이 폰트와 DOM에 묶여 있음

Lighthouse 모바일 실험 결과:

- Performance 58 / Accessibility 100 / Best Practices 100 / SEO 92
- FCP 7.9s, LCP 8.3s, TBT 0ms, CLS 0.028
- 초기 전송 약 899KiB, 42 requests, DOM 905 elements
- Google Fonts CSS가 약 140KiB이고 렌더 차단 예상 시간이 가장 컸습니다.
- 네 종류의 font family와 여러 weight가 한글 subset 다수를 요청합니다.
- 한 화면 진입 시 방명록 1회, 공개 업로드 1회, 아카이브 댓글 수 8회로 API 10회가 발생합니다.

해석:

- JS main thread blocking은 거의 없고, 이미지 최적화도 효과가 있습니다.
- 병목은 원격 폰트 의존, 많은 초기 DOM, 분산된 API 호출입니다.
- Lighthouse 값은 로컬 서버와 모의 저속 네트워크 기준이므로 절대값보다 병목 위치를 봐야 합니다.

권고:

- 한글 본문 family를 하나로 통합하고 필요한 weight만 self-host 또는 subset합니다.
- 히어로에 꼭 필요한 폰트만 preload하고 나머지는 비차단 로드 또는 시스템 폰트 fallback을 사용합니다.
- 댓글 수 전용 batch endpoint를 만들어 8회 요청을 1회로 줄입니다.
- 회원과 과거 아카이브는 모바일에서 일부만 먼저 보여주고 `더 보기`로 확장합니다.
- 라이트박스의 초기 `<img src="">`를 제거해 현재 문서 URL이 이미지로 해석되는 일을 막습니다.

### P1-6. 모달 키보드 포커스가 실제로 이동하지 않음

근거:

- 자동 접근성 검사 점수는 100이었지만 실제 키보드 검증에서 공지 모달을 연 뒤 포커스가 모달 닫기 버튼으로 가지 않고 기존 `공지` 버튼에 남았습니다.
- 이후 Tab 키가 열린 모달 내부가 아니라 배경 페이지의 `가입 문의`, 히어로 버튼, 링크 순으로 이동했습니다.
- 배경을 `inert` 처리하거나 포커스를 순환시키는 focus trap이 없습니다.

영향:

- 키보드·스크린리더 사용자가 열린 대화상자의 위치와 범위를 놓칠 수 있음
- `aria-modal="true"`의 기대 동작과 실제 상호작용이 다름

권고:

- 가능하면 네이티브 `<dialog>`의 `showModal()`을 사용합니다.
- Custom modal을 유지하면 다음 animation frame에서 초기 포커스를 이동하고, 배경 `inert`, Tab 순환, Escape, 닫은 뒤 trigger 복귀를 한 유틸리티로 통합합니다.
- 공지·가입·위치·라이트박스·관리자 패널 모두 같은 모달 컨트롤러를 사용합니다.

### P1-7. 공개 도메인과 배포 책임이 세 갈래로 나뉨

근거:

- README는 GitHub Pages를 배포 URL로 안내합니다.
- Open Graph URL과 이미지는 GitHub Pages를 가리킵니다.
- 실제 동적 기능은 Cloudflare Pages API에 의존합니다.
- 사용자는 Replit을 새 기준 환경으로 사용하려 합니다.
- canonical URL, sitemap, 유효한 robots.txt가 없습니다. Wrangler의 SPA fallback 때문에 `/robots.txt`가 HTML을 반환해 Lighthouse SEO가 92였습니다.

권고:

- 한 개의 대표 운영 도메인을 결정합니다. 현재 구조에서는 Cloudflare Pages가 가장 자연스럽습니다.
- GitHub Pages는 중단하거나 대표 도메인으로 리다이렉트합니다.
- Replit은 주 개발 환경으로 두되 배포 승격은 Git commit과 CI를 통해 Cloudflare로 진행합니다.
- `canonical`, `og:url`, `og:image`, README, sitemap, robots.txt를 대표 도메인 기준으로 통일합니다.

### P1-8. 공개 회원 정보와 방문자 데이터 정책이 없음

근거:

- 회원 실명·닉네임, 운영진 회사 이메일, 행사 사진이 검색 가능한 공개 페이지에 있습니다.
- 메시지와 아카이브 API는 IP와 User-Agent hash를 저장하지만 개인정보 안내·보존 기간·삭제 요청 경로가 없습니다.
- Google Fonts와 jsDelivr Twemoji는 방문자의 외부 네트워크 요청을 만듭니다.

권고:

- 회원과 사진 공개 동의 범위를 확인하고, 필요하면 robots noindex 또는 사내 접근 제한을 적용합니다.
- 개인정보 처리 안내, 수집 목적, 보존 기간, 삭제 문의 경로를 짧게라도 제공합니다.
- 운영진 이메일은 동의 여부를 확인하고, 스팸이 문제면 직접 노출 대신 문의 폼으로 바꿉니다.
- 폰트와 Twemoji self-host는 성능뿐 아니라 외부 요청 최소화에도 도움이 됩니다.

### P2-1. `main.js`와 `style.css`가 기능 추가 방식으로 비대해짐

근거:

- `main.js`: 2,258 lines / 약 93KB
- `style.css`: 3,763 lines / 약 73KB
- 화면 데이터, 컴포넌트, API client, 관리자 기능, 이미지 압축, 상호작용 초기화가 한 파일에 섞여 있습니다.
- 프로젝트 지침은 ES Modules를 요구하지만 브라우저 스크립트는 일반 `defer`, Node 서버는 CommonJS, Functions는 ESM으로 세 방식이 혼재합니다.

권고:

- 빌드 프레임워크 없이 ES Modules로만 분리합니다.
  - `data/members.js`, `data/archives.js`
  - `components/*.js`
  - `services/messages-api.js`, `services/archives-api.js`
  - `ui/modal-controller.js`, `ui/reveal.js`
- CSS도 파일을 나누되 최종 layer 순서는 한 entry stylesheet에서 선언합니다.
- 정적 파일 직접 열기 호환성은 더 이상 기준으로 두지 않고 Replit/HTTP preview를 공식 경로로 정합니다.

### P2-2. 자동 검증과 CI가 없음

현재 `package.json`에 `test`, `lint`, `check`가 없고 GitHub Actions도 없습니다.

권고 최소 세트:

- `npm run check`: JS 문법, migration dry run, 이미지 참조, 금지된 공개 파일 검사
- Playwright smoke: 390px/1440px 렌더, 콘솔 오류, 메뉴, 검색, 모달, 라이트박스
- API integration: 빈 D1에서 migration → messages/archives CRUD
- Lighthouse budget: LCP, 요청 수, DOM 수, 초기 bytes 상한
- secret scan: `.env`, `.dev.vars`, `*.log`, key/token 패턴

### P2-3. 정보 구조가 길고 최신 일정과 기록의 역할이 섞임

근거:

- 모바일 문서 높이가 약 17,640px, 데스크톱은 약 10,024px입니다.
- 일정 영역이 2026년 7월 4일의 완료된 대회를 보여주면서 `다음 모임`, `언제 어디서 만나는지` 링크로 연결됩니다.
- `진행됩니다` 같은 미래형 표현이 완료 기록 안에 남아 있습니다.
- 회원명부는 `하선재`, 7월 대회 참가자 표기는 `허선재`로 달라 실제 인물 여부 확인이 필요합니다.

권고:

- 일정에는 미래 일정만 두고, 없으면 `다음 일정 준비 중` 상태와 알림/문의 액션을 제공합니다.
- 완료 행사는 아카이브로만 이동합니다.
- 모바일에서 회원 6~8명, 아카이브 최신 3건을 먼저 보여주고 검색/더 보기를 제공합니다.
- 회원·참가자 이름은 운영자가 확인할 단일 데이터 소스에서 가져옵니다.

### P2-4. 문서와 불필요 자산 정리가 필요함

- `.idx/dev.nix`, `.idx/mcp.json`, `GEMINI.md`는 Firebase Studio 전제를 유지합니다.
- `blueprint.md`는 최근 Replit 실행 및 이미지 최적화 상태가 반영되지 않았습니다.
- 빈 파일 `kolongolf`, 미사용 `waacky.png`, 화면에서 사용하지 않는 MOV와 과거 디자인 참고 PNG가 운영 배포물에 포함됩니다.
- `README.md`는 회원 업로드용 `0002_archive_uploads.sql`, 관리자 token, Replit 전체 스택 실행 절차를 충분히 설명하지 않습니다.

권고:

- Firebase Studio 파일은 `legacy/firebase-studio/`로 보관하거나 더 이상 필요 없으면 제거합니다.
- 디자인 참고 자료와 원본 영상은 `docs/assets/` 또는 외부 저장소로 옮기고 배포물에서는 제외합니다.
- README를 `개발`, `로컬 DB`, `운영 배포`, `환경 변수`, `복구 절차` 중심으로 다시 씁니다.

## 5. 권장 목표 구조

### 선택 A — 권장: Replit 주 개발 환경 + Cloudflare 단일 운영

```text
workspace/
├── src/ 또는 현재 브라우저 소스
├── public assets
├── functions/api/
├── migrations/
├── scripts/build.js
├── tests/
└── dist/                 # 허용한 공개 파일만 생성, Git에는 미추적

Replit Run
  1. npm ci
  2. D1 migrations apply --local
  3. build to dist
  4. wrangler pages dev dist --ip 0.0.0.0 --port 5000

Production
  Git push → CI checks → Cloudflare Pages deploy dist + Functions
```

장점:

- 기존 Functions/D1을 그대로 살릴 수 있습니다.
- Replit에서 운영과 가장 비슷한 전체 스택을 테스트합니다.
- 대표 도메인, CORS, SEO, 운영 데이터 위치가 하나로 정리됩니다.
- 프레임워크를 도입하지 않아도 됩니다.

### 선택 B — Replit도 운영 호스팅

필요 조건:

- `dist/`만 서비스하는 안전한 production server 또는 Replit Static Deployment 사용
- API를 계속 Cloudflare에 둘 경우 Replit 운영 도메인을 CORS/Turnstile 허용 목록에 포함
- API까지 Replit으로 옮길 경우 D1/R2 대체 DB·object storage와 데이터 이전 계획 필요
- preview/staging/production secrets와 DB 완전 분리

현재 기능의 중심이 Cloudflare D1/Pages Functions이므로, 특별한 이유가 없다면 선택 A가 비용과 위험이 더 낮습니다.

## 6. 실행 로드맵

### 0단계 — 즉시, 반나절

- [ ] `firebase-debug.log` 추적 제거 및 두 공개 배포에서 404 확인
- [ ] `dist/` allowlist 빌드 도입, 저장소 루트 배포 중단
- [ ] Replit Run을 Wrangler + local D1 전체 스택으로 변경
- [ ] Replit preview가 운영 API를 호출하지 않는지 네트워크 검사
- [ ] `scripts/serve.js` 폐기 또는 안전화

완료 기준:

- 개발 파일 URL이 모두 404
- Replit Run의 `/api/messages`가 local D1을 사용
- malformed URL이 서버를 종료하지 않음

### 1단계 — 안정화, 1~2일

- [ ] 단일 D1 migration chain 작성 및 원격 스키마 백업/확인
- [ ] Wrangler 업데이트와 `npm audit` high 0건 목표
- [ ] Turnstile을 메시지·아카이브에 필수 적용
- [ ] Origin allowlist, 관리자 인증 실패 제한, 운영 secret 검증
- [ ] canonical 운영 도메인 결정 및 GitHub Pages 정리

완료 기준:

- 빈 DB에서 migrations만으로 API CRUD 통과
- 운영/미리보기 데이터가 분리됨
- 공개 쓰기 API에 bot 검증과 origin 정책이 적용됨

### 2단계 — 구조/성능, 3~5일

- [ ] 회원 업로드 이미지를 R2로 이동
- [ ] 댓글 수 batch endpoint와 아카이브 이미지 조회 N+1 제거
- [ ] Google Fonts 축소/self-host, Twemoji self-host 검토
- [ ] 모달을 네이티브 dialog 또는 통합 포커스 컨트롤러로 교체
- [ ] ES Modules와 데이터/컴포넌트/API 파일 분리
- [ ] Playwright/API/Lighthouse/secret scan CI 추가

완료 기준:

- 초기 API 요청 수 10회 → 3회 이하
- 모바일 Lighthouse Performance 80 이상을 1차 목표로 설정
- 키보드 포커스가 열린 모달 밖으로 나가지 않음
- 회원 사진 증가가 D1 응답 크기에 직접 비례하지 않음

### 3단계 — 콘텐츠/운영, 지속

- [ ] 미래 일정과 완료 기록 분리
- [ ] 회원/참가자 데이터 단일화와 이름 확인
- [ ] 모바일 회원·아카이브 더 보기 적용
- [ ] 개인정보 공개 동의, 보존 기간, 삭제 절차 문서화
- [ ] README/blueprint/PROJECT_LOG 운영 기준 통일

## 7. 검증 기록

### 정적/실행

- Node 22.22.0, npm 10.9.4
- `npm start`: 5000 포트 기동 성공, 정적 자산 응답 성공
- `npm run dev`: Wrangler Functions compile 및 8788 포트 기동 성공
- local D1 `sql/local-schema.sql`: 9 commands 성공
- `node --check main.js`, `node --check scripts/serve.js`, `bash -n scripts/optimize-images.sh`: 성공
- Functions 파일은 Pages ESM이지만 `package.json`이 CommonJS라 일반 `node --check functions/api/*.js`는 실패합니다. Wrangler compile은 성공했습니다.

### API

- local `/api/messages` guestbook/comment GET: 200
- local `/api/archives`: 200
- local 관리자 무설정 상태: 503, 예상 동작
- live Cloudflare messages/archives GET: 200
- live 관리자 무인증 GET: 401, token 설정 확인
- 원격 데이터 쓰기 테스트는 수행하지 않았습니다.
- 원격 D1 schema read는 `CLOUDFLARE_API_TOKEN` 부재로 수행하지 못했습니다.

### 브라우저

- Chromium 138, desktop 1440×900, mobile 390×844
- Custom Elements 13개 렌더 확인
- 콘솔 오류 0, page error 0, 실패 요청 0, 4xx/5xx 응답 0
- 데스크톱/모바일 가로 overflow 없음
- 모바일 메뉴, 아카이브 라이트박스, 댓글 scope 동작 확인
- 실제 스크롤 후 모든 lazy image 로드 확인
- 모달 초기 포커스/Tab 범위 문제 재현

### Lighthouse 모바일 실험

| 항목 | 결과 |
| --- | ---: |
| Performance | 58 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 92 |
| FCP | 7.9s |
| LCP | 8.3s |
| TBT | 0ms |
| CLS | 0.028 |
| 초기 전송 | 약 899KiB |
| 요청 | 42 |
| DOM | 905 elements |

## 8. 최종 의견

이 프로젝트는 디자인을 다시 만드는 것보다 **운영 경계를 바로 세우는 것**이 먼저입니다. 현재 UI는 충분히 매력적이고 실제 기능도 많습니다. 문제는 Firebase Studio 시절의 루트 정적 배포 관습 위에 Cloudflare API와 Replit 미리보기가 덧붙으면서, 공개 파일·운영 데이터·로컬 데이터의 경계가 불명확해졌다는 점입니다.

가장 좋은 다음 작업은 전면 리디자인이 아니라 아래 세 가지입니다.

1. 공개 산출물을 `dist/` allowlist로 격리
2. Replit Run을 local D1 포함 전체 스택으로 통일
3. D1 migration을 단일 진실 공급원으로 복구

이 세 가지를 끝내면 Replit을 안심하고 주 작업 환경으로 사용할 수 있고, 그 다음에 R2·성능·모듈화·콘텐츠 개선을 순서대로 진행할 수 있습니다.
