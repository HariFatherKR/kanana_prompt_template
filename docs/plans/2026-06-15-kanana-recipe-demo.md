# Kanana Recipe Demo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 기존 image-to-video MVP 화면을 링크/음성 입력을 AI 레시피 카드로 바꾸는 한국어 데모로 전환하고, 5개 이상의 샘플 요리 데이터를 클릭 즉시 결과 카드에 채운다.

**Architecture:** React 단일 페이지에서 샘플 데이터와 변환 결과 타입을 분리해 `src/lib/recipeDemo.ts`에 둔다. `App.tsx`는 링크 입력, 음성 파일 선택, 샘플 선택, 개인정보/가족 음성 동의/미저장 안내, 결과 레시피 카드를 렌더링한다. 실제 외부 API 호출은 하지 않고 데모/샘플 기반 변환임을 명확히 표시한다.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, Node smoke scripts.

---

### Task 1: RED 테스트 작성

**Files:**
- Modify: `tests/App.test.tsx`
- Create: `tests/recipeDemo.test.ts`

**Steps:**
1. 첫 화면 가치제안, 링크/음성 파일 UI, 데모/샘플 기반 안내, 개인정보·가족 음성 동의·원본 미저장 안내를 검증한다.
2. 샘플 5개 이상과 샘플 클릭 시 결과 카드가 즉시 채워지는 동작을 검증한다.
3. 샘플 데이터가 입력 원문, 요리명, 재료, 단계, 팁/확인필요 항목을 포함하는지 검증한다.
4. `npm test -- tests/App.test.tsx tests/recipeDemo.test.ts`로 실패를 확인한다.

### Task 2: GREEN 구현

**Files:**
- Create: `src/lib/recipeDemo.ts`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

**Steps:**
1. 샘플 레시피 6개 이상을 `recipeSamples`로 정의한다.
2. `buildRecipeCardFromSample`와 `buildDemoRecipeFromInput`을 구현한다.
3. `App.tsx`를 레시피 데모 UX로 교체한다.
4. 스타일을 레시피 카드/샘플 그리드/안전 안내에 맞게 정리한다.
5. 테스트를 통과시킨다.

### Task 3: 검증과 smoke 업데이트

**Files:**
- Modify: `tests/browser-smoke.mjs` if needed
- Modify: `README.md` if needed

**Steps:**
1. `npm test`, `npm run typecheck`, `npm run build`를 실행한다.
2. 가능하면 `npm run smoke:http`, `npm run smoke:browser`를 실행하고 스크린샷을 갱신한다.
3. Kanban comment에 변경 파일, 테스트 결과, deploy readiness, 남은 리스크를 남기고 `review-required`로 block한다.
