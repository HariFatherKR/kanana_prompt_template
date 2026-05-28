export type Tone = 'polished' | 'casual';

export interface ReferenceAnalysis {
  composition: string;
  style: string;
  mood: string;
  colors: string[];
  lighting: string;
}

export interface PromptBuilderInput {
  referenceAnalysis: ReferenceAnalysis;
  userText: string;
  desiredElements: string;
  constraints: string;
  tone: Tone;
  templateId: string;
}

export interface SafetyResult {
  allowed: boolean;
  riskFlags: string[];
  messages: string[];
}

export interface PromptBuildResult {
  status: 'ok' | 'blocked';
  prompt: string;
  safety: SafetyResult;
  normalized: {
    intent: string;
    desiredElements: string[];
    constraints: string[];
    negativeConstraints: string[];
  };
}

export interface EvaluationInput {
  prompt: string;
  referenceAnalysis: ReferenceAnalysis;
  requestedElements: string[];
}

export interface EvaluationChecklistItem {
  label: string;
  passed: boolean;
  detail: string;
}

export interface ReverseEvaluation {
  fitScore: number;
  checklist: EvaluationChecklistItem[];
  gaps: string[];
  improvements: string[];
}
