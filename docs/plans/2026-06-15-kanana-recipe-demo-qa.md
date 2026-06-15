# Kanana Recipe Demo QA — 2026-06-15

## Verdict

PASS / deploy-ready for operator Vercel deployment, with blocking findings 0.

Scope checked: Kanana recipe-conversion web demo sample data, UI support for sample click-to-fill, link input and audio file selection, Korean privacy/demo copy, no misleading real API/customer-data claim, fresh test/build/smoke gates, diff hygiene, and changed-file secret-like scan.

## Changed files inspected

Tracked dirty files:
- `README.md`
- `src/App.tsx`
- `src/lib/promptBuilder.ts`
- `src/lib/safety.ts`
- `src/styles.css`
- `tests/App.test.tsx`
- `tests/browser-smoke.mjs`
- `tests/promptBuilder.test.ts`

Untracked files included in QA scope:
- `docs/plans/2026-05-29-kanana-image-to-video-meta-prompting-qa.md`
- `docs/plans/2026-05-29-kanana-image-to-video-meta-prompting-rework-qa.md`
- `docs/plans/2026-06-15-kanana-recipe-demo.md`
- `src/lib/recipeDemo.ts`
- `tests/recipeDemo.test.ts`
- `docs/plans/2026-06-15-kanana-recipe-demo-qa.md` (this report)

Repository state at QA start: `main...origin/main [ahead 1]` with recipe-demo working tree changes; no staged files.

## Requirement checklist

- Sample dataset: PASS. `src/lib/recipeDemo.ts` contains 6 samples. Fresh invariant probe confirmed all samples include `sourceText`, `recipeName`, `ingredients`, `steps`, `tips`, and `reviewNeeded`.
- Sample click-to-fill: PASS. `tests/App.test.tsx` verifies at least 5 sample buttons and clicking “샘플 변환: 엄마 김치찌개” renders the result card with source, ingredient, step, and review-needed content.
- Link input / audio-file path: PASS. `App.tsx` renders labelled recipe link and audio file input; `tests/App.test.tsx` verifies typed link + uploaded `mom-voice.m4a` are reflected in the demo result card.
- Korean privacy/demo copy: PASS. `App.tsx` and `README.md` state demo/sample-based conversion, external API not called, family voice consent, sensitive/private source-link handling, and upload file non-storage premise.
- Misleading real API/customer-data claim: PASS. Copy inspected says no external API call and sample/local-input only; no claim of live customer-data processing or production API conversion was found in the recipe-demo UI/README.
- Browser smoke/screenshot: PASS. `npm run smoke:browser` rendered DOM and captured `artifacts/screenshots/kanana-prompt-template-smoke.png` (220,785 bytes; 1440x1200). Visual inspection showed the Kanana recipe demo hero, safety copy, input panel, 6 sample cards, and placeholder output without blank/broken layout.

## Fresh verification evidence

```text
npm test
Test Files  4 passed (4)
Tests       12 passed (12)
Exit code   0
```

```text
npm run typecheck
> tsc -b --pretty false
Exit code 0
```

```text
npm run build
vite v8.0.14 building client environment for production...
✓ 17 modules transformed.
dist/index.html                   0.40 kB │ gzip:  0.27 kB
dist/assets/index-kYfTrIcY.css    3.69 kB │ gzip:  1.36 kB
dist/assets/index-CGnXRUgA.js   202.91 kB │ gzip: 64.80 kB
✓ built in 83ms
Exit code 0
```

```text
npm run smoke:http
http smoke ok: 200 http://127.0.0.1:5173/
Exit code 0
```

```text
npm run smoke:browser
browser smoke ok: http://127.0.0.1:5173/; screenshot=artifacts/screenshots/kanana-prompt-template-smoke.png; bytes=220785
Exit code 0
```

```text
git diff --check && git diff --cached --check
Exit code 0
```

```text
tracked+untracked whitespace scan
changed_paths=13
untracked/tracked whitespace scan OK
Exit code 0
```

```text
changed-file secret-like scan
scanned_changed_paths=13
secret-like scan OK
Exit code 0
```

```text
screenshot metadata
PNG image data, 1440 x 1200, 8-bit/color RGB, non-interlaced
pixelWidth: 1440
pixelHeight: 1200
Exit code 0
```

## Notes / boundaries

- No deploy, Vercel login/env mutation, push, merge, PR, credential change, customer-data write, or destructive cleanup was performed.
- `npm run smoke:browser` starts a local Vite dev server on `127.0.0.1:5173` and invokes Chrome with `--password-store=basic --use-mock-keychain`; preflight showed ports 3000, 3001, 5173, and 8080 had no listeners before smoke.
- One attempted screenshot-dimension check using Python PIL failed because PIL is not installed; it was immediately replaced by `file` + `sips`, which passed and confirmed 1440x1200 dimensions.
