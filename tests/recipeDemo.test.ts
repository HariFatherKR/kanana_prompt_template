import { describe, expect, it } from 'vitest';
import { buildRecipeCardFromSample, recipeSamples } from '../src/lib/recipeDemo';

describe('recipe demo sample data', () => {
  it('contains at least 5 rich samples with source text, recipe name, ingredients, steps, tips, and review items', () => {
    expect(recipeSamples.length).toBeGreaterThanOrEqual(5);

    for (const sample of recipeSamples) {
      expect(sample.sourceText.length).toBeGreaterThan(40);
      expect(sample.recipeName.length).toBeGreaterThan(1);
      expect(sample.ingredients.length).toBeGreaterThanOrEqual(4);
      expect(sample.steps.length).toBeGreaterThanOrEqual(3);
      expect(sample.tips.length).toBeGreaterThanOrEqual(1);
      expect(sample.reviewNeeded.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('builds an immediately renderable recipe card from a selected sample', () => {
    const sample = recipeSamples.find((item) => item.recipeName === '엄마 김치찌개');
    expect(sample).toBeDefined();

    const card = buildRecipeCardFromSample(sample!);

    expect(card.sourceTypeLabel).toMatch(/샘플/);
    expect(card.recipeName).toBe('엄마 김치찌개');
    expect(card.ingredients).toContain('잘 익은 김치 2컵');
    expect(card.steps.join('\n')).toContain('김치를 먼저 볶아');
    expect(card.reviewNeeded.join('\n')).toContain('김치 염도');
  });
});
