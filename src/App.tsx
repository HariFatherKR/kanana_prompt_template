import { Image, ShieldCheck, Sparkles, UploadCloud } from 'lucide-react';
import { useMemo, useState } from 'react';
import { buildVideoPrompt, DEFAULT_REFERENCE_ANALYSIS } from './lib/promptBuilder';
import { evaluatePromptFit } from './lib/reverseEvaluation';
import type { PromptBuildResult, ReverseEvaluation, Tone } from './lib/types';
import './styles.css';

const templateOptions = [
  { id: 'editorial_photo', label: 'Editorial photo' },
  { id: 'illustration', label: 'Illustration' },
  { id: 'freeform', label: 'Freeform video' },
];

function copyRiskLabel(label: string) {
  return label;
}

export default function App() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [userText, setUserText] = useState('');
  const [desiredElements, setDesiredElements] = useState('');
  const [constraints, setConstraints] = useState('');
  const [tone, setTone] = useState<Tone>('polished');
  const [templateId, setTemplateId] = useState('editorial_photo');
  const [result, setResult] = useState<PromptBuildResult | null>(null);

  const evaluation: ReverseEvaluation | null = useMemo(() => {
    if (!result || result.status !== 'ok') return null;
    return evaluatePromptFit({
      prompt: result.prompt,
      referenceAnalysis: DEFAULT_REFERENCE_ANALYSIS,
      requestedElements: result.normalized.desiredElements,
    });
  }, [result]);

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setFileName(file.name);
  }

  function onGenerate() {
    const generated = buildVideoPrompt({
      referenceAnalysis: DEFAULT_REFERENCE_ANALYSIS,
      userText,
      desiredElements,
      constraints,
      tone,
      templateId,
    });
    setResult(generated);
    setUserText('');
    setConstraints('');
  }

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">GPT-5.5-style image-to-video meta-prompting MVP</p>
          <h1>기준 이미지와 한국어 요청을 5초 영상용 영어 프롬프트 패키지로 정리합니다.</h1>
          <p className="hero-copy">이미지는 브라우저 안에서만 미리보기로 사용합니다. 이 MVP는 외부 GPT/OpenAI/Kanana API 호출이나 이미지 업로드 없이, 안전한 템플릿 기반 5초 image-to-video 프롬프트와 역평가 패널을 보여줍니다.</p>
        </div>
        <div className="safety-card" aria-label="local preview only notice">
          <ShieldCheck aria-hidden="true" />
          <strong>Local preview only</strong>
          <span>No external upload · No API calls · 5-second video prompt package</span>
        </div>
      </section>

      <section className="workspace-grid">
        <form className="panel input-panel" onSubmit={(event) => { event.preventDefault(); onGenerate(); }}>
          <label className="upload-box">
            <span><UploadCloud aria-hidden="true" /> Reference image</span>
            <input aria-label="Reference image" type="file" accept="image/*" onChange={onFileChange} />
            <small>브라우저 로컬 미리보기만 사용합니다. 외부 서버로 보내지 않습니다.</small>
          </label>

          {previewUrl ? (
            <figure className="preview-card">
              <img src={previewUrl} alt="Local reference preview" />
              <figcaption>{fileName} · 브라우저 내부 미리보기</figcaption>
            </figure>
          ) : (
            <div className="empty-preview"><Image aria-hidden="true" /> 기준 이미지를 선택하면 여기에만 표시됩니다.</div>
          )}

          <label>
            한국어 요구사항
            <textarea aria-label="한국어 요구사항" value={userText} onChange={(event) => setUserText(event.target.value)} placeholder="예: 따뜻한 카페 무드, 복잡한 배경은 싫어. 반말 느낌." />
          </label>

          <label>
            구현 요소
            <input aria-label="구현 요소" value={desiredElements} onChange={(event) => setDesiredElements(event.target.value)} placeholder="ceramic cup, gentle steam, cozy table" />
          </label>

          <label>
            제약
            <input aria-label="제약" value={constraints} onChange={(event) => setConstraints(event.target.value)} placeholder="글자 넣지 말고 과한 그림자 금지" />
          </label>

          <div className="inline-controls">
            <label><input type="radio" name="tone" checked={tone === 'polished'} onChange={() => setTone('polished')} /> Polished tone</label>
            <label><input aria-label="casual tone" type="radio" name="tone" checked={tone === 'casual'} onChange={() => setTone('casual')} /> Casual tone</label>
          </div>

          <label>
            Optional template helper
            <select value={templateId} onChange={(event) => setTemplateId(event.target.value)}>
              {templateOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </label>

          <button type="submit"><Sparkles aria-hidden="true" /> Generate English 5-second video prompt</button>
        </form>

        <section className="panel output-panel" aria-live="polite">
          {!result && <div className="placeholder">요구사항을 입력하고 생성하면 영어 5초 영상 프롬프트와 역평가가 여기에 표시됩니다.</div>}

          {result?.status === 'blocked' && (
            <div className="blocked-card">
              <h2>Safety review needed</h2>
              <p>{result.prompt}</p>
              <ul>{result.safety.messages.map((message) => <li key={message}>{copyRiskLabel(message)}</li>)}</ul>
            </div>
          )}

          {result?.status === 'ok' && (
            <>
              <article className="prompt-card">
                <h2>Generated English 5-second Video Prompt</h2>
                <pre>{result.prompt}</pre>
              </article>

              {evaluation && (
                <article className="evaluation-card">
                  <h2>Reverse Evaluation</h2>
                  <div className="score"><span>Fit score</span><strong>{evaluation.fitScore}</strong>/100</div>
                  <h3>Checklist</h3>
                  <ul>{evaluation.checklist.map((item) => <li key={item.label} className={item.passed ? 'pass' : 'gap'}>{item.label === 'Must-have constraints included' ? 'Required section included' : item.label}: {item.passed ? 'pass' : item.detail}</li>)}</ul>
                  <h3>Gaps</h3>
                  <ul>{(evaluation.gaps.length ? evaluation.gaps : ['No major gaps detected.']).map((gap) => <li key={gap}>{gap}</li>)}</ul>
                  <h3>Improvement suggestions</h3>
                  <ul>{evaluation.improvements.map((tip) => <li key={tip}>{tip}</li>)}</ul>
                </article>
              )}
            </>
          )}
        </section>
      </section>
    </main>
  );
}

