# Kolon Golf Society

코오롱 스크린 골프 동호회의 일정, 회원, 지난 라운드 기록을 보여주는 정적 홈페이지입니다.

- 배포 URL: https://moogun-jeong.github.io/kolongolf/
- 구조: `index.html`, `main.js`, `style.css`, `images/`
- 빌드: 별도 빌드 도구 없이 GitHub Pages에서 정적 파일로 배포
- 주요 수정 지점: 회원/일정/아카이브 데이터는 `main.js`, 화면 톤과 반응형은 `style.css`

## Cloudflare 방명록/댓글 백엔드

방명록과 아카이브 댓글은 Cloudflare Pages Functions와 D1을 사용합니다.

1. Cloudflare D1 데이터베이스를 만들고 `migrations/0001_messages.sql`을 적용합니다.
2. Cloudflare Pages 프로젝트 설정에서 D1 binding 이름을 `DB`로 연결합니다.
3. 스팸 방지를 강화하려면 환경 변수 `TURNSTILE_SECRET_KEY`와 `MESSAGE_SALT`를 추가합니다.
4. Turnstile을 화면에 표시하려면 `index.html`의 `cf-turnstile-sitekey` 메타 값을 sitekey로 채웁니다.
5. `_routes.json`은 `/api/*` 요청만 Functions로 보내도록 제한합니다.
