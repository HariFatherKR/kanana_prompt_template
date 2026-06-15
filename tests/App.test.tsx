import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../src/App';

function makeAudioFile() {
  return new File(['fake-audio-bytes'], 'mom-voice.m4a', { type: 'audio/mp4' });
}

describe('Kanana recipe conversion demo', () => {
  it('explains the Korean value proposition and shows link/audio demo safety UI', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /링크와 음성 파일을 AI 레시피 카드로 바꿉니다/i })).toBeInTheDocument();
    expect(screen.getByText(/링크\/음성 파일을 AI 레시피 카드로 바꾸는 서비스/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/레시피 링크/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/음성 파일/i)).toBeInTheDocument();
    expect(screen.getByText(/데모\/샘플 기반 변환/i)).toBeInTheDocument();
    expect(screen.getByText(/외부 API 호출 없이/i)).toBeInTheDocument();
    expect(screen.getByText(/가족 음성은 당사자 동의/i)).toBeInTheDocument();
    expect(screen.getByText(/원본 업로드 파일은 저장하지 않는 전제/i)).toBeInTheDocument();
  });

  it('renders at least 5 recipe samples and fills the result card immediately when a sample is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const sampleButtons = screen.getAllByRole('button', { name: /샘플 변환:/i });
    expect(sampleButtons.length).toBeGreaterThanOrEqual(5);

    await user.click(screen.getByRole('button', { name: /샘플 변환: 엄마 김치찌개/i }));

    const result = await screen.findByRole('article', { name: /AI 레시피 결과 카드/i });
    expect(within(result).getByRole('heading', { name: /엄마 김치찌개/i })).toBeInTheDocument();
    expect(within(result).getByText(/입력 원문/i)).toBeInTheDocument();
    expect(within(result).getByText(/엄마가 음성으로 말한 느낌/i)).toBeInTheDocument();
    expect(within(result).getByText(/잘 익은 김치 2컵/i)).toBeInTheDocument();
    expect(within(result).getByText(/김치를 먼저 볶아/i)).toBeInTheDocument();
    expect(within(result).getByText(/김치 염도/i)).toBeInTheDocument();
  });

  it('accepts link text and audio file selection for a demo conversion without claiming real API processing', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/레시피 링크/i), 'https://example.com/family/recipe-note');
    await user.upload(screen.getByLabelText(/음성 파일/i), makeAudioFile());
    await user.click(screen.getByRole('button', { name: /데모 레시피 카드 만들기/i }));

    const result = await screen.findByRole('article', { name: /AI 레시피 결과 카드/i });
    expect(within(result).getByRole('heading', { name: /데모 변환 레시피/i })).toBeInTheDocument();
    expect(within(result).getByText(/https:\/\/example.com\/family\/recipe-note/i)).toBeInTheDocument();
    expect(within(result).getByText(/mom-voice.m4a/i)).toBeInTheDocument();
    expect(within(result).getByText(/실제 AI 추출이 아닌 데모\/샘플 기반 변환/i)).toBeInTheDocument();
  });
});
