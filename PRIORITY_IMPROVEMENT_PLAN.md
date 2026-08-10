# 홈페이지 우선 개선 계획

- 작성일: 2026-08-10 (UTC)
- 목적: 현재처럼 관리자가 문구·회원·일정·사진을 직접 갱신하는 소규모 운영 방식에 맞춘 최소 개선 범위
- 상세 참고: [`FINAL_IMPROVEMENT_PLAN.md`](./FINAL_IMPROVEMENT_PLAN.md)

## 1. 결론

현재 홈페이지와 공개 조회 API는 동작하고 있으므로 전면 재구축하지 않는다. 디자인, Web Components 구조, `main.js`/`style.css` 단일 파일 구조도 우선 유지한다.

지금은 다음 세 가지 안전 문제와 한 가지 콘텐츠 문제만 먼저 처리한다.

1. 저장소 전체가 공개되는 배포 범위
2. Replit 미리보기에서 운영 API를 호출하는 환경 혼선
3. 공개 댓글의 봇 방어가 설정 누락 시 꺼지는 문제
4. 지난 행사가 다음 일정처럼 표시되는 콘텐츠 문제

D1 migration 정리는 다음 DB 기능 변경 전에 수행한다. R2, 프리렌더, 대규모 모듈화와 전면 CI 구축은 현재 범위에서 제외한다.

## 2. 지금 우선 처리할 사항

### P0-1. 공개 배포 파일 제한

#### 작업

- 저장소 루트가 아닌 `dist/`만 정적 사이트로 배포한다.
- 최소 build script가 아래 공개 파일만 `dist/`에 복사하도록 allowlist를 둔다.
  - `index.html`, `main.js`, `style.css`
  - 실제 참조 중인 `images/` 자산
  - `_routes.json`, `robots.txt`, `sitemap.xml`, 필요 시 `_headers`
- Cloudflare Pages output을 `dist/`로 변경한다.
- GitHub Pages를 유지하는 동안에도 같은 `dist/`만 배포한다.
- `firebase-debug.log`, `.git/`, `.idx/`, `AGENTS.md`, migration SQL, `wrangler.toml`, lockfile, 참고 PNG/MOV는 배포물에서 제외한다.
- `firebase-debug.log`는 현재 Git tree에서 제거하고 로그 파일을 계속 ignore한다.

#### 완료 기준

- 운영 URL에서 개발 로그·설정·migration·dotfile 요청이 모두 404다.
- 홈페이지, CSS, JS, 사용 중인 이미지와 `/api/*`는 정상 동작한다.
- `robots.txt`와 `sitemap.xml`이 올바른 content type으로 응답한다.

### P0-2. Replit 로컬과 운영 데이터 분리

#### 작업

- Replit Run은 정적 `scripts/serve.js` 대신 Wrangler local full stack을 실행한다.
- 로컬 D1은 운영 D1과 분리한다.
- 프런트엔드 API 주소는 동일 출처 `/api`를 사용한다.
- Replit에서 운영 API가 준비되지 않은 경우 쓰기 폼을 비활성화하고 명확한 안내를 표시한다.

#### 완료 기준

- Replit에서 댓글을 작성해도 운영 홈페이지의 댓글 데이터가 변하지 않는다.
- Replit 브라우저 network에 `kolongolf.pages.dev/api` 요청이 없다.
- 잘못된 URL 요청으로 개발 서버가 종료되지 않는다.

### P0-3. 댓글 쓰기 안전화

#### 작업

- 운영 환경에 Turnstile site key와 secret을 함께 설정한다.
- 운영에서 key, secret 또는 검증 응답이 없으면 POST를 허용하지 않는 fail-closed 정책을 적용한다.
- 댓글 POST에 Origin 검증과 기존 속도 제한을 함께 적용한다.
- `MESSAGE_SALT` 기본값을 제거하고 운영 secret으로 설정한다.
- 관리자 기능을 계속 사용한다면 강한 `ADMIN_TOKEN`과 인증 실패 제한을 적용한다. 별도 관리자 페이지와 Cloudflare Access 전환은 필요해질 때 진행한다.

#### 완료 기준

- 정상 사용자는 방명록과 아카이브 댓글을 작성할 수 있다.
- Turnstile token 누락·실패·재사용 요청은 저장되지 않는다.
- 허용되지 않은 Origin과 속도 제한 초과 요청은 거부된다.
- 조회 API는 계속 공개로 정상 동작한다.

### P1-1. 현재 일정 문구 바로잡기

#### 작업

- 2026년 7월 4일 완료 행사를 `다음 모임`으로 안내하지 않는다.
- 확정된 미래 일정이 없으면 다음 상태를 표시한다.
  - 제목: `다음 모임 준비 중`
  - 본문: `일정은 확정되는 대로 이 자리에 안내합니다.`
- 과거 행사의 사진과 상세 기록은 아카이브에 유지한다.
- 하단 일정 공지도 확정 미래 일정이 없으면 표시하지 않는다.

#### 완료 기준

- 일정 영역과 하단 공지에 지난 날짜를 미래형으로 안내하는 문구가 없다.
- 기존 7월 행사 아카이브와 사진은 그대로 열람할 수 있다.

### P1-2. 사용하지 않는 회원 사진 업로드 범위 축소

현재 운영 방식의 기본 결정은 **관리자가 사진 파일을 직접 추가하고 배포하는 방식 유지**다.

- 공개 회원 사진 업로드를 실제로 사용하지 않으면 업로드 UI와 POST를 비활성화한다.
- 기존 공개 업로드 데이터가 있는지는 삭제 전에 읽기 전용으로 확인한다.
- 업로드 기능을 유지하기로 결정한 경우에만 R2 이전과 이미지 승인 관리 개선을 별도 작업으로 시작한다.

이 결정을 적용하면 현재 단계에서는 R2 구축이 필요하지 않다.

## 3. 다음 DB 변경 전에 처리할 사항

### D1 migration chain 복구

현재 `0001_messages.sql`의 `published` 상태와 API의 `visible` 상태가 달라 빈 DB 재구축이 실패한다. 운영 댓글이 현재 동작하더라도 복구와 새 환경 생성에는 위험이 남는다.

DB 기능을 다음에 변경하기 직전에 아래 순서로 처리한다.

1. 운영 D1 migration journal과 실제 schema를 읽기 전용으로 확인
2. 운영 D1 export 백업
3. 기존 migration 파일은 수정하지 않고 새 forward migration 작성
4. 빈 local D1과 운영 schema를 복제한 fixture 양쪽에서 연습
5. 댓글 GET/POST와 관리자 변경을 확인한 후 운영 적용

단순 문구·사진·회원 데이터 수정만 하는 동안에는 이 작업 때문에 홈페이지 업데이트를 중단하지 않는다.

## 4. 현재 하지 않을 작업

- `main.js`와 `style.css`의 전면 분해
- `src/` 전체 이전과 build-time 프리렌더
- private R2 구축 및 D1 사진 데이터 이전
- 폰트와 Twemoji 전면 자체 호스팅
- Playwright 3개 브라우저, 시각 회귀, Lighthouse budget을 포함한 전체 CI
- 9개 PR로 나눈 장기 아키텍처 전환
- 디자인 전면 변경

다음 조건이 생기면 장기 계획의 해당 항목만 다시 검토한다.

- 회원 사진 직접 업로드를 계속 운영해야 함 → R2 검토
- 여러 관리자가 자주 동시에 수정함 → 모듈화와 CI 검토
- 검색 노출 또는 JS 실패 시 본문 노출이 중요해짐 → 프리렌더 검토
- 단일 JS/CSS 수정 충돌이 반복됨 → 단계적 파일 분리 검토

## 5. 권장 실행 순서

1. `dist/` allowlist 배포와 공개 로그 제거
2. Replit local API/D1 분리
3. 댓글 Turnstile·Origin·속도 제한 보강
4. 지난 일정 문구를 `다음 모임 준비 중`으로 수정
5. 공개 회원 사진 업로드 사용 여부 확인 후 기본 비활성화
6. 다음 DB 변경 시점에만 D1 migration 복구

각 단계는 기존 화면 디자인과 댓글 조회 기능을 유지하며 작게 배포한다. 운영 DB 쓰기나 삭제가 필요한 단계는 사전 백업과 별도 확인 없이 진행하지 않는다.

## 6. 최소 개선 완료 조건

- [x] 운영 사이트에서 개발·로그·DB 관련 파일이 공개되지 않음 — `dist/` allowlist 빌드 적용, local에서 allowlist 밖 경로 404 확인. *원격 배포 설정 변경 후 재확인 필요*
- [x] Replit 테스트가 운영 D1을 변경하지 않음 — Run이 `wrangler pages dev` + 로컬 D1, 프런트엔드는 같은 출처 `/api`
- [x] 공개 댓글 POST가 Turnstile과 속도 제한을 통과해야만 저장됨 — 코드는 fail-closed. *운영 secret 설정 전까지는 저장 자체가 막힘*
- [x] 지난 행사가 다음 일정처럼 표시되지 않음 — `upcomingEvents`가 비어 있어 `다음 모임 준비 중` 표시, 하단 일정 공지 미표시
- [x] 사용하지 않는 공개 사진 업로드가 비활성화됨 — 화면 `publicArchiveUploadEnabled = false`, 서버 POST 403
- [x] 홈페이지·댓글 조회·댓글 작성·아카이브 열람의 기존 사용 흐름이 유지됨 — 조회는 공개 유지, 댓글 작성은 운영 secret 설정 후 정상 동작

### 남은 원격 설정 (코드로 처리 불가)

- [ ] Cloudflare Pages 환경 변수 `TURNSTILE_SECRET_KEY`, `MESSAGE_SALT`, 16자 이상 `ADMIN_TOKEN` 설정
- [ ] `index.html`의 `cf-turnstile-sitekey` 메타 값 입력
- [ ] Cloudflare Pages build output directory `dist`, build command `npm run build` 설정
- [ ] GitHub 저장소 Settings > Pages > Source를 GitHub Actions로 변경
- [ ] 위 설정 후 운영 URL에서 404/조회/작성 재확인
