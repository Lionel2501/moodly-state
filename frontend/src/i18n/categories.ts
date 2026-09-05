import { useTranslation } from 'react-i18next';
import { CategoryEmotion, Step } from '../api/client';

// stepId is stable across languages (and across the app's history — it never
// changes for existing records), so it's what lets us translate persisted
// states that only carry a numeric stepId, not the step's slug.
const STEP_SLUGS_BY_ID: Record<number, string> = {
  1: 'debut',
  2: 'rapprochement',
  3: 'relation',
  4: 'distance',
};

export function useCategoryTranslation() {
  const { t } = useTranslation();

  function stepName(step: Pick<Step, 'slug' | 'name'>): string {
    return t(`categories.${step.slug}.name`, { defaultValue: step.name });
  }

  function stepDescription(step: Pick<Step, 'slug' | 'description'>): string {
    return t(`categories.${step.slug}.description`, { defaultValue: step.description });
  }

  function emotionLabel(emotion: Pick<CategoryEmotion, 'key' | 'label'>): string {
    return t(`emotions.${emotion.key}`, { defaultValue: emotion.label });
  }

  // For persisted states: `feeling` is either a canonical emotion key (new
  // records) or a raw French label (records created before translations
  // existed) — in both cases t() falls back to the value itself when it
  // isn't a known key, so old records keep displaying their original text.
  function stateFeeling(feeling: string): string {
    return t(`emotions.${feeling}`, { defaultValue: feeling });
  }

  function stateStepName(stepId: number, fallbackName: string): string {
    const slug = STEP_SLUGS_BY_ID[stepId];
    if (!slug) return fallbackName;
    return t(`categories.${slug}.name`, { defaultValue: fallbackName });
  }

  return { stepName, stepDescription, emotionLabel, stateFeeling, stateStepName };
}
