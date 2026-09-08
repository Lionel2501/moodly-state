import { useTranslation } from 'react-i18next';
import { Category } from '../api/client';

// categoryId is stable across languages (and across the app's history — it
// never changes for existing records), so it's what lets us translate
// persisted states that only carry a numeric categoryId, not the
// category's slug. Ids removed from CATEGORIES are simply absent here too;
// stateCategoryName then falls back to the snapshotted name.
const CATEGORY_SLUGS_BY_ID: Record<number, string> = {
  1: 'amistad',
  2: 'sympathie',
  3: 'donne_moi_de_tes_nouvelles',
  4: 'un_verre',
  5: 'on_se_voit',
  6: 'tu_fais_quoi',
  7: 'petit_coucou',
  8: 'compania',
  9: 'merci_pour_ce_moment',
  10: 'gusto',
  11: 'dispo_ce_soir',
  12: 'atraccion',
  13: 'tu_me_plais',
  14: 'tu_m_as_manque_aujourdhui',
  15: 'je_pense_a_toi_aujourdhui',
  16: 'extranar',
};

export function useCategoryTranslation() {
  const { t } = useTranslation();

  // Shown to the user both when picking a kanjo to send and when
  // discovering/receiving one.
  function categoryName(category: Pick<Category, 'slug' | 'selectedLabel'>): string {
    return t(`kanjos.${category.slug}.selected`, { defaultValue: category.selectedLabel });
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
