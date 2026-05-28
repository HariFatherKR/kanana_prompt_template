# Kanana Image Meta-Prompting MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a local-only web MVP that turns a reference image preview plus Korean user intent into a controlled English image-generation prompt and reverse-evaluation panel.

**Architecture:** Vite + React + TypeScript single-page app. All prompt generation is deterministic local logic; reference image handling is browser-only preview via object URL. Safety, prompt building, and reverse evaluation are pure modules covered by Vitest.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, headless Chrome smoke scripts.

---

### Task 1: Test-first prompt contracts

**Files:**
- Create: `tests/promptBuilder.test.ts`
- Create: `tests/reverseEvaluation.test.ts`

**Steps:**
1. Write failing tests for English prompt sections, no raw Korean passthrough, casual tone mapping, safety refusal, fit score/checklist/gaps/suggestions.
2. Run `npm test` and verify missing implementation failures.
3. Implement `src/lib/safety.ts`, `src/lib/promptBuilder.ts`, `src/lib/reverseEvaluation.ts`, `src/lib/types.ts`.
4. Re-run `npm test` and keep all module tests green.

### Task 2: Local browser UI

**Files:**
- Create: `src/App.tsx`
- Create: `src/main.tsx`
- Create: `src/styles.css`
- Test: `tests/App.test.tsx`

**Steps:**
1. Write failing UI tests for local image preview, local-only copy, English prompt output, reverse evaluation, and safety refusal.
2. Implement minimal React UI with file input, text/element/constraint inputs, tone/template controls, output prompt, and evaluation panel.
3. Run `npm test` until 5/5 tests pass.

### Task 3: Verification and smoke

**Files:**
- Create: `tests/http-smoke.mjs`
- Create: `tests/browser-smoke.mjs`
- Modify: `package.json`

**Steps:**
1. Add scripts for `test`, `typecheck`, `build`, `smoke:http`, and `smoke:browser`.
2. Run `npm run typecheck` and `npm run build`.
3. Run `npm run smoke:http` for local HTTP status/content check.
4. Run `npm run smoke:browser` with Chrome headless flags `--password-store=basic --use-mock-keychain` and capture screenshot.

### Task 4: Docs, wiki, commit

**Files:**
- Modify: `README.md`
- Modify: Hermes wiki `docs/wiki/current-status.md`, `docs/wiki/log.md`
- Commit local repo only; do not push.

**Steps:**
1. Document local run and verification commands.
2. Write wiki status/log summary.
3. Run fresh verification again.
4. Commit with `feat: add image-to-video meta-prompting mvp`.

