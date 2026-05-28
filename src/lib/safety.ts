import type { SafetyResult } from './types';

const RISK_RULES: Array<{ flag: string; label: string; patterns: RegExp[] }> = [
  {
    flag: 'real_person_attractiveness',
    label: 'real-person attractiveness scoring',
    patterns: [/외모\s*점수|외모\s*순위|attractiveness\s*score|beauty\s*rank/i],
  },
  {
    flag: 'celebrity_or_ip_imitation',
    label: 'celebrity/IP direct imitation',
    patterns: [/유명\s*(연예인|아이돌)|똑같이|exactly like|celebrity|disney|pokemon|marvel/i],
  },
  {
    flag: 'sexual_content',
    label: 'sexual or NSFW content',
    patterns: [/nsfw|누드|나체|섹시|sexual|erotic/i],
  },
  {
    flag: 'political_sensitive',
    label: 'political or sensitive persuasion',
    patterns: [/정치\s*선전|투표\s*조작|political propaganda|election manipulation/i],
  },
];

export function runSafetyReview(text: string): SafetyResult {
  const riskFlags: string[] = [];
  const messages: string[] = [];

  for (const rule of RISK_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(text))) {
      riskFlags.push(rule.flag);
      messages.push(rule.label);
    }
  }

  return {
    allowed: riskFlags.length === 0,
    riskFlags,
    messages,
  };
}
