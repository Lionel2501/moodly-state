export interface Category {
  id: number;
  slug: string;
  // Shown to the user who is generating/sending a kanjo (the picker).
  //
  // These labels are the app's French defaults, not a generic/neutral value:
  // they double as (1) the categoryName snapshotted onto a state at creation
  // time — a state needs one fixed piece of text forever, so it's taken in
  // the app's default language — and (2) the i18next defaultValue used if a
  // `kanjos.<slug>.select`/`.selected` key is ever missing from a locale
  // file. The actual per-language labels users see live in
  // frontend/src/i18n/locales/{fr,en,es}.ts, keyed by slug — the fr.ts
  // entries intentionally duplicate the values below; keep both in sync when
  // editing either one.
  selectLabel: string;
  // Shown to the user who discovers/receives the kanjo (the reveal). This is
  // also what gets snapshotted onto a state at creation time (see
  // categoryName in states.service.ts / shared-states.service.ts), so it's
  // what a discoverer still sees for an old state even if this category is
  // later removed from the list below.
  selectedLabel: string;
}

// A single flat list of the emotional states a user can pick from — this
// used to be grouped into steps with sub-categories underneath, but that
// hierarchy was flattened into one list to be more understandable at a
// glance. Ids are stable across the app's history (they're persisted on
// created states), so existing entries must never be renumbered or reused;
// only append new ones. Categories that no longer make sense are removed
// from this list rather than renumbered — old states just keep showing
// their snapshotted selectedLabel (see stateCategoryName).
// Display order was hand-picked (see PR discussion) and no longer follows
// id order — ids stay stable/append-only per the rule above, but this array
// is free to be reordered for presentation.
export const CATEGORIES: Category[] = [
  { id: 1, slug: 'amistad', selectLabel: 'Amitié', selectedLabel: "J'aimerais être ton ami(e)" },
  { id: 2, slug: 'sympathie', selectLabel: 'Sympathie', selectedLabel: 'Je te trouve sympa' },
  { id: 3, slug: 'donne_moi_de_tes_nouvelles', selectLabel: 'Donne-moi de tes nouvelles', selectedLabel: "J'aimerais avoir de tes nouvelles" },
  { id: 4, slug: 'un_verre', selectLabel: 'Un verre ?', selectedLabel: "Ça me dirait de boire un verre avec toi" },
  { id: 5, slug: 'on_se_voit', selectLabel: 'On se voit ?', selectedLabel: "J'aimerais te voir" },
  { id: 6, slug: 'tu_fais_quoi', selectLabel: 'Tu fais quoi ?', selectedLabel: "J'ai envie de passer un moment avec toi" },
  { id: 7, slug: 'petit_coucou', selectLabel: 'Petit coucou', selectedLabel: 'Je voulais juste te faire un coucou' },
  { id: 8, slug: 'compania', selectLabel: 'Compagnie', selectedLabel: "J'aime passer du temps avec toi" },
  { id: 9, slug: 'merci_pour_ce_moment', selectLabel: 'Merci pour ce moment', selectedLabel: 'Merci pour ce moment' },
  { id: 10, slug: 'gusto', selectLabel: 'Tu me plais', selectedLabel: 'Tu me plais' },
  { id: 11, slug: 'dispo_ce_soir', selectLabel: 'Dispo ce soir ?', selectedLabel: 'Je suis dispo ce soir' },
  { id: 12, slug: 'atraccion', selectLabel: 'Attirance', selectedLabel: 'Je suis attiré(e) par toi' },
  { id: 14, slug: 'tu_m_as_manque_aujourdhui', selectLabel: "Tu m'as manqué aujourd'hui", selectedLabel: "Tu m'as manqué aujourd'hui" },
  { id: 15, slug: 'je_pense_a_toi_aujourdhui', selectLabel: "Je pense à toi aujourd'hui", selectedLabel: 'Je pensais à toi aujourd’hui' },
  { id: 16, slug: 'extranar', selectLabel: 'Manque', selectedLabel: 'Tu me manques' },
];
