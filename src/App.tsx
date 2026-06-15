import { useState } from 'react';
import { buildDemoRecipeFromInput, buildRecipeCardFromSample, recipeSamples } from './lib/recipeDemo';
import type { RecipeCard } from './lib/recipeDemo';
import './styles.css';

function RecipeResult({ card }: { card: RecipeCard }) {
  return (
    <article className="recipe-card" aria-label="AI 레시피 결과 카드">
      <div className="result-header">
        <p className="eyebrow">{card.sourceTypeLabel}</p>
        <h2>{card.recipeName}</h2>
        <p className="demo-notice">{card.demoNotice}</p>
        <div className="recipe-meta">
          <span>분량: {card.serving}</span>
          <span>시간: {card.time}</span>
        </div>
      </div>

      <section>
        <h3>입력 원문</h3>
        <pre className="source-box">{card.sourceText}</pre>
      </section>

      <section className="recipe-columns">
        <div>
          <h3>재료</h3>
          <ul>{card.ingredients.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h3>단계</h3>
          <ol>{card.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        </div>
      </section>

      <section className="recipe-columns muted-columns">
        <div>
          <h3>팁</h3>
          <ul>{card.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
        </div>
        <div>
          <h3>확인 필요</h3>
          <ul>{card.reviewNeeded.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>
    </article>
  );
}

export default function App() {
  const [link, setLink] = useState('');
  const [audioFileName, setAudioFileName] = useState('');
  const [result, setResult] = useState<RecipeCard | null>(null);

  function onAudioChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setAudioFileName(file?.name ?? '');
  }

  function onDemoConvert() {
    setResult(buildDemoRecipeFromInput(link, audioFileName));
  }

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Kanana AI Recipe Card Demo</p>
          <h1>링크와 음성 파일을 AI 레시피 카드로 바꿉니다</h1>
          <p className="hero-copy">
            링크/음성 파일을 AI 레시피 카드로 바꾸는 서비스 데모입니다. 흩어진 블로그 링크, 짧은 영상 설명, 가족의 음성 메모를 재료·단계·팁·확인 필요 항목이 있는 한 장의 레시피로 정리하는 경험을 보여줍니다.
          </p>
        </div>
        <aside className="safety-card" aria-label="데모와 개인정보 안내">
          <strong>데모/샘플 기반 변환</strong>
          <span>외부 API 호출 없이 샘플 데이터와 로컬 입력값으로만 결과 카드를 채웁니다.</span>
          <span>가족 음성은 당사자 동의 후 사용해야 하며, 이 데모는 원본 업로드 파일은 저장하지 않는 전제로 안내합니다.</span>
        </aside>
      </section>

      <section className="workspace-grid">
        <section className="panel input-panel" aria-label="레시피 변환 입력">
          <label>
            레시피 링크
            <input
              aria-label="레시피 링크"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="예: https://blog.example.com/mom-kimchi-jjigae"
            />
          </label>

          <label className="upload-box">
            <span>음성 파일</span>
            <input aria-label="음성 파일" type="file" accept="audio/*" onChange={onAudioChange} />
            <small>{audioFileName ? `${audioFileName} 선택됨` : 'm4a, mp3, wav 등 음성 메모를 선택하는 데모 UI입니다.'}</small>
          </label>

          <div className="notice-list" aria-label="안전 안내">
            <p>실제 변환 엔진이 붙기 전까지는 샘플 데이터로 변환 결과를 표시합니다.</p>
            <p>민감정보, 가족 음성, 원본 링크의 개인정보는 서비스 정책과 동의 절차가 필요합니다.</p>
          </div>

          <button type="button" onClick={onDemoConvert}>데모 레시피 카드 만들기</button>
        </section>

        <section className="panel samples-panel" aria-label="샘플 요리 데이터">
          <div className="section-heading">
            <p className="eyebrow">Sample recipes</p>
            <h2>샘플을 누르면 결과 카드가 즉시 채워집니다</h2>
          </div>
          <div className="sample-grid">
            {recipeSamples.map((sample) => (
              <button
                type="button"
                className="sample-card"
                key={sample.id}
                onClick={() => setResult(buildRecipeCardFromSample(sample))}
              >
                <span className="sample-action">샘플 변환: {sample.recipeName}</span>
                <strong>{sample.recipeName}</strong>
                <small>{sample.sourceKind === 'link' ? '링크 원문 느낌' : '음성 transcript 느낌'} · {sample.time}</small>
              </button>
            ))}
          </div>
        </section>
      </section>

      <section className="panel output-panel" aria-live="polite">
        {result ? (
          <RecipeResult card={result} />
        ) : (
          <div className="placeholder">
            링크를 입력하거나 음성 파일을 선택한 뒤 데모 변환을 누르거나, 위 샘플 요리를 클릭하면 AI 레시피 결과 카드가 여기에 표시됩니다.
          </div>
        )}
      </section>
    </main>
  );
}
