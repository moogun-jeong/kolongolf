# Kolon Golf Society

코오롱 스크린 골프 동호회의 일정, 회원, 지난 라운드 기록을 보여주는 정적 홈페이지입니다.

- 배포 URL: https://moogun-jeong.github.io/kolongolf/
- 구조: `index.html`, `main.js`, `style.css`, `images/`
- 빌드: 별도 빌드 도구 없이 GitHub Pages에서 정적 파일로 배포
- 주요 수정 지점: 회원/일정/아카이브 데이터는 `main.js`, 화면 톤과 반응형은 `style.css`

## 로컬 개발

| 명령 | 용도 |
| --- | --- |
| `npm start` | 정적 미리보기 서버 (`scripts/serve.js`, 기본 5000 포트). Replit Run 버튼이 실행하는 명령입니다. |
| `npm run dev` | `wrangler pages dev .` — `/api` Functions까지 함께 확인할 때 사용합니다. |
| `npm run images` | `images/`의 새 원본에서 웹용 파생본을 생성합니다. |

Node 22 이상이 필요합니다(`wrangler` 4.x 요구 사항). Replit에서는 `.replit`의 `modules`가
`nodejs-22`로 맞춰져 있습니다.

## 사진 추가 방법

브라우저가 받는 용량을 줄이기 위해 원본을 그대로 참조하지 않고 파생본 두 종류를 사용합니다.

- `*-display.jpg` — 긴 변 1800px. 히어로, 아카이브 카드, 라이트박스 본 사진용
- `*-thumb.jpg` — 긴 변 400px. 라이트박스 썸네일용 (`main.js`의 `thumbSource()`가 경로를 자동으로 유도)

1. 원본을 `images/archive-<연도>-<월>-<번호>.jpg` 규칙으로 넣습니다.
2. `npm run images`를 실행해 파생본을 생성합니다.
3. `main.js`의 `archives` 배열에는 **`-display` 경로**를 적습니다.
4. 파생본을 확인했으면 원본은 저장소에 남기지 않아도 됩니다(git 이력에 보존됩니다).

## Cloudflare 방명록/댓글 백엔드

방명록과 아카이브 댓글은 Cloudflare Pages Functions와 D1을 사용합니다.

1. Cloudflare D1 데이터베이스를 만들고 `migrations/0001_messages.sql`을 적용합니다.
2. Cloudflare Pages 프로젝트 설정에서 D1 binding 이름을 `DB`로 연결합니다.
3. 스팸 방지를 강화하려면 환경 변수 `TURNSTILE_SECRET_KEY`와 `MESSAGE_SALT`를 추가합니다.
4. Turnstile을 화면에 표시하려면 `index.html`의 `cf-turnstile-sitekey` 메타 값을 sitekey로 채웁니다.
5. `_routes.json`은 `/api/*` 요청만 Functions로 보내도록 제한합니다.
6. GitHub Pages 화면에서도 Cloudflare API를 쓰도록 `index.html`의 `message-api-base`는 `https://kolongolf.pages.dev/api`를 가리킵니다.
