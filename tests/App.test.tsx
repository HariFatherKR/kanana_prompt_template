import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../src/App';

function makeImageFile() {
  return new File(['fake-image-bytes'], 'reference.png', { type: 'image/png' });
}

describe('App local MVP flow', () => {
  it('previews a local image without uploading and generates English 5-second video prompt plus reverse evaluation', async () => {
    const user = userEvent.setup();
    render(<App />);

    const fileInput = screen.getByLabelText(/reference image/i);
    await user.upload(fileInput, makeImageFile());
    expect(await screen.findByAltText(/local reference preview/i)).toBeInTheDocument();
    expect(screen.getByText(/local preview only/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/한국어 요구사항/i), '따뜻한 카페 무드, 복잡한 배경은 싫어. 반말 느낌.');
    await user.type(screen.getByLabelText(/구현 요소/i), 'ceramic cup, gentle steam');
    await user.type(screen.getByLabelText(/제약/i), '글자 넣지 말고 과한 그림자 금지');
    await user.click(screen.getByLabelText(/casual tone/i));
    await user.click(screen.getByRole('button', { name: /generate english 5-second video prompt/i }));

    expect(await screen.findByText(/Generated English 5-second Video Prompt/i)).toBeInTheDocument();
    expect(screen.getByText(/You are an expert image-to-video prompt designer/i)).toBeInTheDocument();
    expect(screen.getByText(/Reverse Evaluation/i)).toBeInTheDocument();
    expect(screen.getByText(/Fit score/i)).toBeInTheDocument();
    expect(screen.getByText(/5-second video contract included/i)).toBeInTheDocument();
    expect(screen.queryByText(/따뜻한 카페 무드, 복잡한 배경은 싫어/)).not.toBeInTheDocument();
  });

  it('shows safety refusal for disallowed requests', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/한국어 요구사항/i), '실제 사람 외모 점수 매기고 유명 연예인처럼 똑같이 만들어줘');
    await user.click(screen.getByRole('button', { name: /generate english 5-second video prompt/i }));

    expect(await screen.findByText(/Safety review needed/i)).toBeInTheDocument();
    expect(screen.getByText(/real-person attractiveness scoring/i)).toBeInTheDocument();
    expect(screen.queryByText(/유명 연예인처럼 똑같이/)).not.toBeInTheDocument();
  });
});
