# Kolon Golf Society

코오롱 스크린 골프 동호회의 일정, 회원, 지난 라운드 기록을 보여주는 정적 홈페이지입니다.

- 우선 개선 계획: [`PRIORITY_IMPROVEMENT_PLAN.md`](./PRIORITY_IMPROVEMENT_PLAN.md)
- 장기 최종 개선안: [`FINAL_IMPROVEMENT_PLAN.md`](./FINAL_IMPROVEMENT_PLAN.md)
- 마이그레이션 종합 진단: [`REPLIT_MIGRATION_AUDIT.md`](./REPLIT_MIGRATION_AUDIT.md)
- 홈페이지 진단: [`HOMEPAGE_REVIEW.md`](./HOMEPAGE_REVIEW.md)

- 배포 URL: https://moogun-jeong.github.io/kolongolf/ (방명록·댓글 API는 https://kolongolf.pages.dev)
- 구조: `index.html`, `main.js`, `style.css`, `images/`
- 빌드: `npm run build`가 공개 파일만 `dist/`로 모으고, 배포는 `dist/`만 사용합니다
- 주요 수정 지점: 회원/일정/아카이브 데이터는 `main.js`, 화면 톤과 반응형은 `style.css`

## 배포 범위

저장소 루트를 그대로 배포하면 설계 문서, 개발 로그, migration SQL, `wrangler.toml`까지 공개됩니다.
그래서 `scripts/build.js`의 allowlist에 있는 파일만 `dist/`로 복사해 배포합니다.

| 배포 | 방법 |
| --- | --- |
| Cloudflare Pages | `wrangler.toml`의 `pages_build_output_dir = "dist"`. 빌드 명령은 `npm run build` |
| GitHub Pages | `.github/workflows/pages.yml`이 `dist/`만 업로드 |

`dist/`에 들어가는 것은 `index.html`, `main.js`, `style.css`, `_routes.json`, `_headers`,
`robots.txt`, `sitemap.xml`, `.nojekyll`, 그리고 소스에서 실제로 참조하는 `images/` 자산뿐입니다.
새 이미지를 추가할 때 별도 등록은 필요 없습니다. 빌드가 `index.html`/`main.js`/`style.css`의
참조를 훑어 `-display`와 짝이 되는 `-thumb`까지 함께 복사합니다.

> **GitHub Pages 최초 1회 설정**: 저장소 Settings > Pages > Source를 **GitHub Actions**로 바꿔야
> `dist/`만 배포됩니다. "Deploy from a branch"로 두면 예전처럼 저장소 전체가 공개됩니다.
>
> `.github/workflows/pages.yml`은 workflow 파일이라 `workflow` scope가 있는 토큰으로만 push할 수 있습니다.
> 아직 저장소에 없다면 `gh auth refresh -s workflow` 후 커밋하거나 GitHub 웹에서 직접 추가해주세요.

Cloudflare Pages Functions(`functions/`)는 정적 자산이 아니라 빌드 시 번들되므로 `dist/`에 넣지 않습니다.

## 로컬 개발

| 명령 | 용도 |
| --- | --- |
| `npm start` | 정적 파일 + `/api` Functions + **로컬 D1**을 같은 출처에서 실행합니다. Replit Run 버튼이 쓰는 명령입니다. |
| `npm run build` | 공개 배포용 `dist/`를 만듭니다. |
| `npm run preview:static` | `dist/`만 정적으로 확인합니다(`/api` 없음). |
| `npm run images` | `images/`의 새 원본에서 웹용 파생본을 생성합니다. |
| `npm run db:local:init` | 로컬 D1에 스키마를 다시 적용합니다. |

Node 22 이상이 필요합니다(`wrangler` 4.x 요구 사항).

`npm start`는 처음 실행할 때 로컬 전용 `.dev.vars`(gitignore 대상)를 만들고 로컬 D1을 초기화합니다.

```
ALLOW_INSECURE_WRITES = "true"   # 로컬에서만 Turnstile 없이 글쓰기 허용
MESSAGE_SALT = "local-dev-salt"
ADMIN_TOKEN = "local-dev-admin-token"
```

`ALLOW_INSECURE_WRITES`는 **운영 Pages 환경 변수에 절대 넣지 않습니다.**

### 로컬과 운영 데이터 분리

- 로컬 D1은 `.wrangler/state`에만 저장되고 운영 D1은 건드리지 않습니다.
- 화면은 GitHub Pages(`*.github.io`)에서만 `index.html`의 `message-api-base`를 쓰고,
  그 외(로컬·Replit·Cloudflare Pages)에서는 항상 같은 출처의 `/api`를 호출합니다.
- API에 연결되지 않은 화면에서는 방명록·댓글 입력이 비활성화되고 이유가 표시됩니다.

## 사진 추가 방법

브라우저가 받는 용량을 줄이기 위해 원본을 그대로 참조하지 않고 파생본 두 종류를 사용합니다.

- `*-display.jpg` — 긴 변 1800px. 히어로, 아카이브 카드, 라이트박스 본 사진용
- `*-thumb.jpg` — 긴 변 400px. 라이트박스 썸네일용 (`main.js`의 `thumbSource()`가 경로를 자동으로 유도)

1. 원본을 `images/archive-<연도>-<월>-<번호>.jpg` 규칙으로 넣습니다.
2. `npm run images`를 실행해 파생본을 생성합니다.
3. `main.js`의 `archives` 배열에는 **`-display` 경로**를 적습니다.
4. 파생본을 확인했으면 원본은 저장소에 남기지 않아도 됩니다(git 이력에 보존됩니다).

## 일정 문구 업데이트

`main.js`의 `upcomingEvents` 배열이 화면의 "다음 모임"을 결정합니다.

- 배열이 비어 있으면 일정 영역은 `다음 모임 준비 중`으로 안내하고 하단 일정 공지는 표시하지 않습니다.
- 확정된 **미래** 일정만 넣습니다. 지난 행사는 넣지 않습니다(배열 위 주석에 예시가 있습니다).
- 오늘 날짜가 지난 항목은 자동으로 "다음 모임"에서 빠집니다.
- 지난 행사 기록은 `latestRecordEvent`와 `archives` 배열에 그대로 남아 계속 열람할 수 있습니다.

## Cloudflare 방명록/댓글 백엔드

방명록과 아카이브 댓글은 Cloudflare Pages Functions와 D1을 사용합니다.

1. Cloudflare D1 데이터베이스를 만들고 `migrations/`의 SQL을 적용합니다.
2. Cloudflare Pages 프로젝트 설정에서 D1 binding 이름을 `DB`로 연결합니다.
3. 아래 환경 변수를 설정합니다. **없으면 글쓰기가 저장되지 않습니다(fail-closed).**

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `TURNSTILE_SECRET_KEY` | 필수 | 없으면 공개 글쓰기 POST를 거부합니다. |
| `MESSAGE_SALT` | 필수 | IP/UA 해시 salt. 기본값 없음. |
| `ADMIN_TOKEN` | 관리자 기능 사용 시 | 16자 이상이어야 하며 짧으면 관리자 API가 동작하지 않습니다. |
| `ALLOWED_ORIGINS` | 선택 | 쉼표로 구분한 허용 출처. 기본값은 `https://kolongolf.pages.dev`, `https://moogun-jeong.github.io`. |
| `ENABLE_ARCHIVE_UPLOADS` | 선택 | `"true"`일 때만 회원 사진 업로드 POST를 받습니다. 기본은 꺼짐. |

4. `index.html`의 `cf-turnstile-sitekey` 메타 값을 Turnstile sitekey로 채웁니다.
   비어 있으면 화면에서 글쓰기 입력이 비활성화되고 안내 문구가 표시됩니다.
5. `_routes.json`은 `/api/*` 요청만 Functions로 보내도록 제한합니다.

### 쓰기 요청 보호

- 공개 POST는 Turnstile 검증을 통과해야 저장됩니다(토큰 누락·실패·재사용 모두 거부).
- POST/PATCH/DELETE는 허용된 `Origin`에서 온 요청만 처리합니다.
- 방명록은 IP 해시 기준 1분에 5건, 아카이브 업로드는 10분에 2건으로 제한합니다.
- 관리자 인증은 상수 시간 비교를 쓰고, 실패가 10분 내 5회를 넘으면 잠시 차단합니다.

## 회원 사진 업로드

회원이 직접 사진을 올리는 공개 업로드는 **현재 사용하지 않습니다.**
관리자가 사진 파일을 저장소에 추가하고 배포하는 방식이 기본입니다.

- 화면: `main.js`의 `publicArchiveUploadEnabled = false`
- 서버: `ENABLE_ARCHIVE_UPLOADS` 환경 변수 미설정(POST 403)

이미 올라온 공개 기록이 있으면 읽기 전용 목록으로 계속 보여주고, 없으면 해당 영역 자체를 숨깁니다.
기존 데이터는 삭제하지 않았습니다. 관리자 패널에서 계속 확인·관리할 수 있습니다.
