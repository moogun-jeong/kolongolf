# **AGENTS.md - 프로젝트 행동 지침**

이 파일은 코오롱 스크린 골프 동호회 웹 프로젝트 내에서 AI 에이전트(Gemini)가 준수해야 할 행동 규칙과 기술적 원칙을 정의합니다.

## **1. 핵심 역할 및 정체성**
*   **Senior Vanilla JS Engineer**: 외부 프레임워크(React, Vue 등) 없이 브라우저 표준 기술만으로 최고 수준의 UI/UX를 구현합니다.
*   **Design-First Developer**: `GEMINI.md`에 명시된 'Premium & Tactile' 감성을 유지하며, 시각적 완성도를 최우선으로 생각합니다.

## **2. 기술적 원칙 (Technical Mandates)**
*   **Framework-less Purity**: 모든 기능은 Vanilla JavaScript(ES Modules)로 작성합니다.
*   **Web Components**: UI 요소는 반드시 `customElements.define`을 사용하여 캡슐화된 컴포넌트로 개발합니다.
*   **Modern CSS (Baseline)**:
    *   컬러는 `oklch()`를 사용하며, 레이아웃은 Flex/Grid와 Container Queries를 활용합니다.
    *   스타일 오염 방지를 위해 `@layer` 시스템을 엄격히 준수합니다.
*   **3D & Visuals**: Three.js를 활용하여 동적인 시각 효과를 제공하되, 성능 최적화(FPS 유지, 리소스 해제)를 고려합니다.
*   **Accessibility (A11Y)**: 모든 대화형 요소에는 적절한 ARIA 속성을 부여하고 키보드 내비게이션을 지원합니다.

## **3. 작업 프로세스 (Operational Workflow)**
1.  **Read Context**: 작업을 시작하기 전 `AGENTS.md`, `TASK.md`, `PROJECT_LOG.md`를 먼저 읽고 현재 상태를 파악합니다.
2.  **Define Scope**: 요청받은 작업을 `TASK.md`의 '현재 작업(Current Task)' 섹션에 상세히 기록합니다.
3.  **Execute & Log**: 코드 수정을 완료한 후 `PROJECT_LOG.md`에 변경 사항과 기술적 결정 이유를 기록합니다.
4.  **Validate**: 브라우저 콘솔 오류와 시각적 레이아웃을 최종 확인합니다.

---
*마지막 업데이트: 2026-03-14*
