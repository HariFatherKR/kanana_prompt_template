import type { EvaluationChecklistItem, EvaluationInput, ReverseEvaluation } from './types';

function includesLoose(text: string, needle: string): boolean {
  return text.toLowerCase().includes(needle.toLowerCase());
}

function scoreItem(item: EvaluationChecklistItem): number {
  return item.passed ? 1 : 0;
}

export function evaluatePromptFit(input: EvaluationInput): ReverseEvaluation {
  const prompt = input.prompt;
  const checklist: EvaluationChecklistItem[] = [
    {
      label: 'Reference composition reflected',
      passed: includesLoose(prompt, input.referenceAnalysis.composition),
      detail: 'The prompt should preserve the reference layout and subject hierarchy.',
    },
    {
      label: 'Reference style reflected',
      passed: includesLoose(prompt, input.referenceAnalysis.style),
      detail: 'The output should name the visual style rather than only listing objects.',
    },
    {
      label: 'Mood and lighting reflected',
      passed: includesLoose(prompt, input.referenceAnalysis.mood) && includesLoose(prompt, input.referenceAnalysis.lighting),
      detail: 'Mood and light are critical for matching the reference image.',
    },
    {
      label: '5-second video contract included',
      passed: /5-second|exactly 5 seconds|Duration: exactly 5 seconds/i.test(prompt),
      detail: 'The main product contract must be image + prompt to a 5-second video, not still-image generation only.',
    },
    {
      label: 'Motion and camera direction included',
      passed: /camera movement|subject motion|single continuous shot|micro-movement/i.test(prompt),
      detail: 'A reusable image-to-video prompt should specify short motion, camera behavior, and continuity.',
    },
    {
      label: 'Must-have constraints included',
      passed: /must-have constraints/i.test(prompt),
      detail: 'A reusable prompt should separate required elements from general style notes.',
    },
    {
      label: 'Negative constraints included',
      passed: /negative prompt|must-not-have constraints/i.test(prompt),
      detail: 'Negative constraints reduce off-target or unsafe generations.',
    },
    {
      label: 'Requested elements included',
      passed: input.requestedElements.length === 0 || input.requestedElements.every((element) => includesLoose(prompt, element)),
      detail: 'User-provided implementation elements should appear after normalization.',
    },
  ];

  const fitScore = Math.round((checklist.reduce((sum, item) => sum + scoreItem(item), 0) / checklist.length) * 100);
  const gaps = checklist.filter((item) => !item.passed).map((item) => `${item.label}: ${item.detail}`);
  const improvements = gaps.length > 0
    ? gaps.map((gap) => `Improve ${gap}`)
    : ['Prompt is aligned; consider adding exact camera distance, motion intensity, frame continuity risks, and material texture for even tighter control.'];

  for (const element of input.requestedElements) {
    if (!includesLoose(prompt, element)) {
      improvements.push(`Add the requested element "${element}" in a controlled, reference-compatible way.`);
    }
  }

  return { fitScore, checklist, gaps, improvements: Array.from(new Set(improvements)) };
}
