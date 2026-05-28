import { describe, expect, it } from 'vitest';
import { evaluatePromptFit } from '../src/lib/reverseEvaluation';

describe('evaluatePromptFit', () => {
  it('scores 5-second video fit and lists checklist, gaps, and improvement suggestions', () => {
    const evaluation = evaluatePromptFit({
      prompt: 'You are an expert image-to-video prompt designer. Reference image reading: centered portrait, warm mood, cream palette, diffused window light. Video contract: Duration: exactly 5 seconds. Use one single continuous shot. Camera movement: subtle push-in. Subject motion: gentle steam. Must-have constraints: preserve centered composition and soft editorial photography. Must-not-have constraints: avoid text overlays and harsh shadows. Negative prompt: extra limbs, logos, distorted face.',
      referenceAnalysis: {
        composition: 'centered portrait',
        style: 'soft editorial photography',
        mood: 'warm mood',
        colors: ['cream'],
        lighting: 'diffused window light',
      },
      requestedElements: ['ceramic cup', 'gentle steam'],
    });

    expect(evaluation.fitScore).toBeGreaterThanOrEqual(75);
    expect(evaluation.checklist).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: 'Reference composition reflected', passed: true }),
      expect.objectContaining({ label: '5-second video contract included', passed: true }),
      expect.objectContaining({ label: 'Motion and camera direction included', passed: true }),
      expect.objectContaining({ label: 'Negative constraints included', passed: true }),
    ]));
    expect(evaluation.gaps.length).toBeGreaterThan(0);
    expect(evaluation.improvements.join(' ')).toContain('ceramic cup');
  });
});
