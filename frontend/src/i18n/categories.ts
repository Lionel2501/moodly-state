import { useTranslation } from 'react-i18next';
import { Category } from '../api/client';

// categoryId is stable across languages (and across the app's history — it
// never changes for existing records), so it's what lets us translate
// persisted states that only carry a numeric categoryId, not the
// category's slug.
const CATEGORY_SLUGS_BY_ID: Record<number, string> = {
  1: 'want_to_know_you',
  2: 'interested_in_you',
  3: 'want_to_understand_you',
  4: 'want_to_discover_you',
  5: 'feel_connected',
  6: 'feel_close_to_you',
  7: 'want_to_spend_time_together',
  8: 'want_to_see_you_again',
  9: 'want_to_be_friends',
  10: 'want_to_keep_in_touch',
  11: 'like_you',
  12: 'feel_affection',
  13: 'miss_you',
  14: 'think_about_you',
  15: 'feel_attracted',
  16: 'developing_feelings',
  17: 'need_space',
  18: 'want_to_take_distance',
  19: 'want_to_slow_down',
  20: 'not_ready',
  21: 'uncertain',
  22: 'want_to_end_connection',
};

export function useCategoryTranslation() {
  const { t } = useTranslation();

  function categoryName(category: Pick<Category, 'slug' | 'name'>): string {
    return t(`emotions.${category.slug}`, { defaultValue: category.name });
  }

  // For persisted states: categoryId is null for legacy records created
  // before the category taxonomy was flattened and whose stored text no
  // longer maps to a known category — in that case categoryName (a snapshot
  // taken at creation time) is shown as-is.
  function stateCategoryName(categoryId: number | null, fallbackName: string): string {
    const slug = categoryId ? CATEGORY_SLUGS_BY_ID[categoryId] : undefined;
    if (!slug) return fallbackName;
    return t(`emotions.${slug}`, { defaultValue: fallbackName });
  }

  return { categoryName, stateCategoryName };
}
