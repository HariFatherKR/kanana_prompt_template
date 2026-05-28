# Kanana Prompt Template

로컬 브라우저에서 기준 이미지를 미리보고, 한국어 요구사항을 안전하게 정규화해 영어 5초 image-to-video 프롬프트 패키지와 역평가 패널을 만드는 MVP입니다.

## 범위

- 기준 이미지는 브라우저 `objectURL` 로컬 preview로만 사용합니다.
- 외부 GPT/OpenAI/Kanana/API 호출은 없습니다.
- 사용자 원문은 그대로 출력 프롬프트에 통과시키지 않고, 템플릿 섹션으로 정규화합니다.
- 출력 프롬프트는 영어이며 role/system-prompt-like framing, reference/first-frame preservation, 5-second duration, single-shot motion, camera movement, subject motion, composition continuity, must-have, must-not-have, negative prompt를 포함합니다.
- still-image prompt section은 보조 섹션으로만 유지하고, 주 계약은 `reference image + Korean prompt -> 5-second video prompt package`입니다.
- reverse evaluation은 5초 영상 적합도 fit score, checklist, gaps, improvement suggestions를 보여줍니다.
- 실제 사람 외모 점수/순위, 유명인·IP 직접 모방, NSFW, 정치/민감 요청은 차단합니다.

## 실행

```bash
npm install
npm run dev -- --port 5173
```

브라우저에서 `http://127.0.0.1:5173/`를 엽니다.

## 검증

```bash
npm test
npm run typecheck
npm run build
npm run smoke:http
npm run smoke:browser
```

`npm run smoke:browser`는 로컬 dev server를 띄우고 Chrome headless로 렌더 DOM과 스크린샷을 확인합니다. macOS Keychain prompt 방지를 위해 Chrome 실행 인자에 `--password-store=basic --use-mock-keychain`을 포함합니다. 스크린샷 기본 경로는 `artifacts/screenshots/kanana-prompt-template-smoke.png`입니다.

## 주요 파일

- `src/App.tsx`: 로컬 이미지 preview, 입력 폼, 5초 영상 프롬프트 출력/평가 UI
- `src/lib/promptBuilder.ts`: 안전 검수와 영어 image-to-video 프롬프트 생성
- `src/lib/reverseEvaluation.ts`: prompt/reference/video-contract fit 역평가
- `src/lib/safety.ts`: 금지 요청 guard
- `tests/*.test.*`: TDD 계약 테스트
- `tests/*-smoke.mjs`: HTTP/브라우저 smoke
