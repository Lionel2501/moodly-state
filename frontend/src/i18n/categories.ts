import { useTranslation } from 'react-i18next';
import { Category } from '../api/client';

// categoryId is stable across languages (and across the app's history — it
// never changes for existing records), so it's what lets us translate
// persisted states that only carry a numeric categoryId, not the
// category's slug. Ids removed from CATEGORIES are simply absent here too;
// stateCategoryName then falls back to the snapshotted name.
const CATEGORY_SLUGS_BY_ID: Record<number, string> = {
  1: 'sympathie',
  2: 'amistad',
  3: 'compania',
  4: 'cercania',
  5: 'conexion',
  6: 'interes',
  7: 'extranar',
  8: 'atraccion',
  9: 'gusto',
  10: 'sentimientos',
};

export function useCategoryTranslation() {
  const { t } = useTranslation();

  // Shown to the user generating/sending a kanjo (the picker).
  function categoryName(category: Pick<Category, 'slug' | 'selectLabel'>): string {
    return t(`kanjos.${category.slug}.select`, { defaultValue: category.selectLabel });
  }

  // Shown to the user discovering/receiving a kanjo. categoryId is null for
  // legacy records created before the category taxonomy was flattened and
  // whose stored text no longer maps to a known category — in that case
  // fallbackName (a snapshot of selectedLabel taken at creation time) is
  // shown as-is.
  function stateCategoryName(categoryId: number | null, fallbackName: string): string {
    const slug = categoryId ? CATEGORY_SLUGS_BY_ID[categoryId] : undefined;
    if (!slug) return fallbackName;
    return t(`kanjos.${slug}.selected`, { defaultValue: fallbackName });
  }

  return { categoryName, stateCategoryName };
}
