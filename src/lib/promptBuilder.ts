import { runSafetyReview } from './safety';
import type { PromptBuilderInput, PromptBuildResult } from './types';

const TRANSLATION_HINTS: Array<[RegExp, string]> = [
  [/카페|coffee|cafe/i, 'a warm cafe atmosphere'],
  [/따뜻|warm/i, 'warm, inviting emotional tone'],
  [/복잡하지|단순|clean|simple/i, 'clean, uncluttered background'],
  [/배경/i, 'carefully controlled background'],
  [/반말|casual/i, 'natural casual English wording where any on-screen direction or narration note is needed'],
  [/글자|텍스트|text/i, 'avoid visible text or typography in the video'],
  [/그림자|shadow/i, 'avoid harsh shadows'],
  [/감성|mood/i, 'tasteful editorial mood'],
  [/움직|모션|흔들|줌|pan|tilt|dolly|motion/i, 'subtle controlled motion that supports the reference image rather than replacing it'],
];

function unique(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function splitList(value: string): string[] {
  return unique(value.split(/[,\n/]+/).map((item) => item.trim()).filter(Boolean));
}

function normalizeKoreanIntent(userText: string): string {
  const hints = TRANSLATION_HINTS.filter(([pattern]) => pattern.test(userText)).map(([, text]) => text);
  if (hints.length === 0) {
    return 'Transform the user request into a controlled, production-ready 5-second image-to-video direction without copying raw wording.';
  }
  return unique(hints).join('; ');
}

function inferConstraints(userText: string, constraints: string): string[] {
  const combined = `${userText} ${constraints}`;
  const inferred: string[] = [];
  if (/글자|텍스트|text/i.test(combined)) inferred.push('Avoid text overlays, captions, labels, watermarks, subtitles, or UI-like typography.');
  if (/그림자|shadow/i.test(combined)) inferred.push('Avoid harsh shadows; keep lighting soft and physically plausible across the whole 5-second shot.');
  if (/복잡하지|복잡한|clean|simple/i.test(combined)) inferred.push('Keep the background visually quiet and uncluttered during the motion.');
  if (/로고|logo|브랜드/i.test(combined)) inferred.push('Avoid logos, brand marks, and recognizable trademark elements.');
  return unique(inferred);
}

function templateGuidance(templateId: string): string {
  switch (templateId) {
    case 'editorial_photo':
      return 'Use refined editorial image-to-video language: believable materials, natural depth, careful framing, premium but not artificial styling, and restrained camera movement.';
    case 'illustration':
      return 'Use polished illustration-to-video language while preserving the reference composition, color relationships, and emotional intent through subtle animated motion.';
    default:
      return 'Use a general high-quality 5-second video prompt format and prioritize reference-image fidelity over decorative novelty.';
  }
}

function blockedPrompt(): string {
  return [
    'Request blocked for safety review.',
    'This MVP does not support the detected unsafe request categories.',
    'Please rewrite the request around non-identifiable style, composition, mood, lighting, materials, short motion, and allowed creative constraints.',
  ].join('\n');
}

export function buildVideoPrompt(input: PromptBuilderInput): PromptBuildResult {
  const safety = runSafetyReview(`${input.userText}
${input.desiredElements}
${input.constraints}`);
  const normalized = {
    intent: normalizeKoreanIntent(input.userText),
    desiredElements: splitList(input.desiredElements),
    constraints: inferConstraints(input.userText, input.constraints),
    negativeConstraints: unique([
      'no visible text overlays unless explicitly approved',
      'no watermarks, logos, signatures, UI chrome, social media frames, or subtitles',
      'no jump cuts, scene changes, time skips, fast edits, or multi-shot montage behavior',
      'no distorted anatomy, extra limbs, broken hands, warped faces, or uncanny eyes',
      'no harsh over-sharpening, blown highlights, muddy low-resolution artifacts, flicker, jitter, or plastic skin',
      'no celebrity, trademarked character, living artist, or direct IP imitation',
    ]),
  };

  if (!safety.allowed) {
    return { status: 'blocked', prompt: blockedPrompt(), safety, normalized };
  }

  const casualLine = input.tone === 'casual'
    ? 'Keep any wording direction natural, relaxed, and conversational in casual English; do not make it stiff, corporate, or literal-translated from Korean.'
    : 'Keep the final direction polished, precise, and production-ready.';

  const prompt = [
    'You are an expert image-to-video prompt designer for a high-end generative video model. Your job is to transform a local reference image analysis and a short Korean user request into a controlled English prompt package for a 5-second video result.',
    '',
    'Reference image reading / first-frame preservation:',
    `- Composition: ${input.referenceAnalysis.composition}. Preserve the same spatial hierarchy, subject placement, camera distance, and visual balance in the first frame and throughout the shot.`,
    `- Style: ${input.referenceAnalysis.style}. Translate this into concrete materials, rendering cues, lens/medium choices, and finishing details.`,
    `- Mood: ${input.referenceAnalysis.mood}. Maintain the emotional temperature of the reference rather than replacing it with generic drama.`,
    `- Color palette: ${input.referenceAnalysis.colors.join(', ') || 'muted natural palette'}. Keep the palette coherent and avoid random accent colors across frames.`,
    `- Lighting: ${input.referenceAnalysis.lighting}. Preserve the softness, direction, contrast level, and shadow behavior implied by the reference.`,
    '',
    'Video contract:',
    '- Duration: exactly 5 seconds.',
    '- Format: image-to-video from the provided local reference image; treat the reference as the first-frame anchor, not as an inspiration-only mood board.',
    '- Shot design: one continuous single shot with no cuts, no scene transitions, and no sudden identity/style changes.',
    '- Camera movement: subtle, cinematic micro-movement only, such as a slow push-in, gentle parallax, or slight handheld breathing if it fits the reference.',
    '- Subject motion: small believable motion that preserves the reference composition, e.g. gentle steam, tiny fabric movement, soft blinking light, or environmental drift; avoid large repositioning.',
    '- Composition continuity: keep subject scale, silhouette, background layout, color grading, and lighting consistent from frame 1 to frame 150.',
    '',
    'Normalized user intent:',
    `- ${normalized.intent}.`,
    `- ${casualLine}`,
    `- Template helper: ${templateGuidance(input.templateId)}`,
    '',
    'Must-have constraints:',
    `- Include these requested visual elements if they fit the scene: ${normalized.desiredElements.join(', ') || 'no additional elements beyond the reference-led direction'}.`,
    '- Preserve the reference composition, style, mood, color relationship, and lighting logic before adding optional decorative elements.',
    '- Make the video prompt concrete: first frame, subject, environment, camera/framing, motion, materials, color, lighting, mood, quality level, and finishing details must all be explicit.',
    '- Normalize the user request into controlled prompt sections; do not quote or pass through raw Korean text.',
    ...normalized.constraints.map((constraint) => `- ${constraint}`),
    '',
    'Must-not-have constraints:',
    '- Do not upload, retain, or imply external storage of the reference image; this prompt is generated from local/mock analysis only.',
    '- Do not imitate a real person, celebrity, brand mascot, copyrighted character, or living artist by name.',
    '- Do not score, rank, beautify, sexualize, or judge a real person in the reference image.',
    '- Do not add political persuasion, sensitive profiling, medical claims, or unsafe content.',
    '- Do not add text overlays, logos, watermarks, captions, subtitles, or social UI unless the user explicitly requests a safe non-branded graphic element.',
    '',
    'Final English 5-second video prompt:',
    `Create a 5-second image-to-video clip that uses the reference image as the first-frame anchor: ${input.referenceAnalysis.composition}, ${input.referenceAnalysis.style}, ${input.referenceAnalysis.mood}, with ${input.referenceAnalysis.lighting} and a ${input.referenceAnalysis.colors.join(', ') || 'cohesive'} palette. Keep the same composition and visual identity for the entire shot. The video should feel ${normalized.intent}. Add ${normalized.desiredElements.join(', ') || 'only subtle, reference-compatible details'} with careful scale, believable texture, and natural integration. Use a single continuous shot with restrained camera micro-movement, stable subject identity, gentle environmental motion, consistent color grading, and high-quality finishing. The result should be an image + prompt to 5-second video package, not a still-image keyword list or a multi-scene video storyboard.`,
    '',
    'Supporting still-image prompt section:',
    `If the workflow also needs a still-image prompt, use the same reference-led composition, palette, lighting, mood, and requested elements, but keep the video contract above as the primary output.`,
    '',
    'Negative prompt:',
    normalized.negativeConstraints.map((constraint) => `- ${constraint}`).join('\n'),
  ].join('\n');

  return { status: 'ok', prompt, safety, normalized };
}

export const buildImagePrompt = buildVideoPrompt;

export const DEFAULT_REFERENCE_ANALYSIS = {
  composition: 'balanced central composition with a clear primary subject and calm negative space',
  style: 'clean contemporary editorial image with soft realistic detail',
  mood: 'warm, composed, and approachable',
  colors: ['warm cream', 'soft charcoal', 'muted accent color'],
  lighting: 'soft diffused light with gentle shadows',
};
