# Kanana Prompt Template

링크나 음성 파일을 넣으면 AI 레시피 카드로 바꿔주는 웹페이지 데모입니다. 현재 구현은 외부 GPT/OpenAI/Kanana/API 호출 없이 샘플 데이터와 로컬 입력값만으로 변환 결과를 보여줍니다.

## 범위

- 첫 화면에서 “링크/음성 파일을 AI 레시피 카드로 바꾸는 서비스” 가치제안을 한국어로 설명합니다.
- 레시피 링크 입력과 음성 파일 선택 UI를 제공합니다.
- 실제 외부 변환 API는 호출하지 않으며, 데모/샘플 기반 변환임을 명확히 표시합니다.
- 샘플 요리 데이터 6개를 제공합니다: 엄마 김치찌개, 된장찌개, 제육볶음, 감자조림, 계란찜, 닭가슴살 토마토 파스타.
- 각 샘플은 입력 원문 느낌, 요리명, 재료, 단계, 팁, 확인 필요 항목을 포함합니다.
- 샘플을 클릭하면 AI 레시피 결과 카드가 즉시 채워집니다.
- 민감정보, 가족 음성 동의, 원본 업로드 파일 미저장 전제를 안내합니다.

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

- `src/App.tsx`: 링크/음성 입력, 샘플 선택, 안전 안내, 레시피 결과 카드 UI
- `src/lib/recipeDemo.ts`: 샘플 요리 데이터와 데모 변환 빌더
- `tests/App.test.tsx`: 레시피 데모 화면/상호작용 테스트
- `tests/recipeDemo.test.ts`: 샘플 데이터 계약 테스트
- `tests/*-smoke.mjs`: HTTP/브라우저 smoke
