import { describe, expect, it } from 'vitest';
import { buildVideoPrompt } from '../src/lib/promptBuilder';

describe('buildVideoPrompt', () => {
  it('normalizes Korean user intent into a detailed English 5-second image-to-video prompt package', () => {
    const result = buildVideoPrompt({
      referenceAnalysis: {
        composition: 'centered portrait with a clean background',
        style: 'soft editorial photography',
        mood: 'calm and warm',
        colors: ['cream', 'muted coral'],
        lighting: 'diffused window light',
      },
      userText: '카페에서 따뜻하게, 배경은 복잡하지 않게. 반말 느낌으로. 살짝 움직이게.',
      desiredElements: 'ceramic cup, gentle steam, cozy table',
      constraints: 'no text overlay, no harsh shadow',
      tone: 'casual',
      templateId: 'editorial_photo',
    });

    expect(result.status).toBe('ok');
    expect(result.prompt).toContain('You are an expert image-to-video prompt designer');
    expect(result.prompt).toContain('Reference image reading / first-frame preservation');
    expect(result.prompt).toContain('Video contract');
    expect(result.prompt).toContain('Duration: exactly 5 seconds');
    expect(result.prompt).toContain('Camera movement');
    expect(result.prompt).toContain('Subject motion');
    expect(result.prompt).toContain('Composition continuity');
    expect(result.prompt).toContain('Must-have constraints');
    expect(result.prompt).toContain('Must-not-have constraints');
    expect(result.prompt).toContain('Negative prompt');
    expect(result.prompt).toContain('centered portrait with a clean background');
    expect(result.prompt).toContain('Keep any wording direction natural, relaxed, and conversational');
    expect(result.prompt).toContain('Avoid text overlays');
    expect(result.prompt).toContain('image + prompt to 5-second video package');
    expect(result.prompt.length).toBeGreaterThan(1400);
    expect(result.prompt).not.toContain('카페에서 따뜻하게');
  });

  it('refuses unsafe requests instead of passing raw user text through', () => {
    const result = buildVideoPrompt({
      referenceAnalysis: { composition: 'selfie-like close-up', style: 'photo', mood: 'neutral', colors: ['skin tone'], lighting: 'flash' },
      userText: '이 실제 사람 얼굴 외모 점수 매기고 유명 아이돌처럼 똑같이 만들어줘. nsfw 느낌도 추가',
      desiredElements: '',
      constraints: '',
      tone: 'polished',
      templateId: 'freeform',
    });

    expect(result.status).toBe('blocked');
    expect(result.safety.riskFlags).toEqual(expect.arrayContaining(['real_person_attractiveness', 'celebrity_or_ip_imitation', 'sexual_content']));
    expect(result.prompt).toContain('blocked for safety');
    expect(result.prompt).not.toContain('유명 아이돌처럼 똑같이');
  });
});
