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
  11: 'dispo_ce_soir',
  12: 'on_se_voit',
  13: 'tu_fais_quoi',
  14: 'un_verre',
  15: 'on_se_retrouve',
  16: 'bon_moment',
  17: 'a_refaire',
  18: 'jai_aime',
  19: 'merci_pour_ce_moment',
  20: 'encore',
  21: 'envie_de_te_parler',
  22: 'un_petit_message',
  23: 'donne_moi_de_tes_nouvelles',
  24: 'on_parle',
  25: 'je_pense_a_toi_aujourdhui',
  26: 'petit_coucou',
  27: 'ca_te_dit',
  28: 'partant',
  29: 'a_bientot',
  30: 'tu_me_dois_un_verre',
  31: 'tu_m_as_fait_sourire',
  32: 'ca_m_a_fait_plaisir',
  33: 'tu_m_as_manque_aujourdhui',
  34: 'jai_aime_te_voir',
  35: 'belle_surprise',
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
