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
export const CATEGORIES: Category[] = [
  { id: 1, slug: 'sympathie', selectLabel: 'Sympathie', selectedLabel: 'Je te trouve sympa' },
  { id: 2, slug: 'amistad', selectLabel: 'Amitié', selectedLabel: "J'aimerais être ton ami(e)" },
  { id: 3, slug: 'compania', selectLabel: 'Compagnie', selectedLabel: "J'aime passer du temps avec toi" },
  { id: 4, slug: 'cercania', selectLabel: 'Proximité', selectedLabel: 'Je me sens proche de toi' },
  { id: 5, slug: 'conexion', selectLabel: 'Connexion', selectedLabel: 'Je me sens connecté(e) à toi' },
  { id: 6, slug: 'interes', selectLabel: 'Intérêt', selectedLabel: 'Je pense à toi' },
  { id: 7, slug: 'extranar', selectLabel: 'Manque', selectedLabel: 'Tu me manques' },
  { id: 8, slug: 'atraccion', selectLabel: 'Attirance', selectedLabel: 'Je suis attiré(e) par toi' },
  { id: 9, slug: 'gusto', selectLabel: 'Tu me plais', selectedLabel: 'Tu me plais' },
  { id: 10, slug: 'sentimientos', selectLabel: 'Sentiments', selectedLabel: 'Des sentiments commencent à apparaître' },

  { id: 11, slug: 'dispo_ce_soir', selectLabel: 'Dispo ce soir ?', selectedLabel: 'Je suis dispo ce soir' },
  { id: 12, slug: 'on_se_voit', selectLabel: 'On se voit ?', selectedLabel: "J'aimerais te voir" },
  { id: 13, slug: 'tu_fais_quoi', selectLabel: 'Tu fais quoi ?', selectedLabel: "J'ai envie de passer un moment avec toi" },
  { id: 14, slug: 'un_verre', selectLabel: 'Un verre ?', selectedLabel: "Ça me dirait de boire un verre avec toi" },
  { id: 15, slug: 'on_se_retrouve', selectLabel: 'On se retrouve ?', selectedLabel: "J'aimerais qu'on se retrouve" },

  { id: 16, slug: 'bon_moment', selectLabel: 'Bon moment', selectedLabel: "J'ai passé un bon moment avec toi" },
  { id: 17, slug: 'a_refaire', selectLabel: 'À refaire', selectedLabel: "J'aimerais refaire ça avec toi" },
  { id: 18, slug: 'jai_aime', selectLabel: "J'ai aimé", selectedLabel: "J'ai vraiment aimé ce moment" },
  { id: 19, slug: 'merci_pour_ce_moment', selectLabel: 'Merci pour ce moment', selectedLabel: 'Merci pour ce moment' },
  { id: 20, slug: 'encore', selectLabel: 'Encore ?', selectedLabel: "J'aimerais recommencer" },

  { id: 21, slug: 'envie_de_te_parler', selectLabel: "J'ai envie de te parler", selectedLabel: "J'avais envie de te parler" },
  { id: 22, slug: 'un_petit_message', selectLabel: 'Un petit message', selectedLabel: "J'avais envie de t'écrire" },
  { id: 23, slug: 'donne_moi_de_tes_nouvelles', selectLabel: 'Donne-moi de tes nouvelles', selectedLabel: "J'aimerais avoir de tes nouvelles" },
  { id: 24, slug: 'on_parle', selectLabel: 'On parle ?', selectedLabel: "J'aimerais discuter avec toi" },
  { id: 25, slug: 'je_pense_a_toi_aujourdhui', selectLabel: "Je pense à toi aujourd'hui", selectedLabel: 'Je pensais à toi aujourd’hui' },

  { id: 26, slug: 'petit_coucou', selectLabel: 'Petit coucou', selectedLabel: 'Je voulais juste te faire un coucou' },
  { id: 27, slug: 'ca_te_dit', selectLabel: 'Ça te dit ?', selectedLabel: "Ça me dirait de faire quelque chose avec toi" },
  { id: 28, slug: 'partant', selectLabel: 'Partant(e) ?', selectedLabel: 'Je suis partant(e) pour te voir' },
  { id: 29, slug: 'a_bientot', selectLabel: 'À bientôt ?', selectedLabel: "J'aimerais te revoir bientôt" },
  { id: 30, slug: 'tu_me_dois_un_verre', selectLabel: 'Tu me dois un verre', selectedLabel: 'On se doit un verre 😏' },

  { id: 31, slug: 'tu_m_as_fait_sourire', selectLabel: "Tu m'as fait sourire", selectedLabel: "Tu m'as fait sourire aujourd'hui" },
  { id: 32, slug: 'ca_m_a_fait_plaisir', selectLabel: "Ça m'a fait plaisir", selectedLabel: "Ça m'a fait plaisir de te voir" },
  { id: 33, slug: 'tu_m_as_manque_aujourdhui', selectLabel: "Tu m'as manqué aujourd'hui", selectedLabel: "Tu m'as manqué aujourd'hui" },
  { id: 34, slug: 'jai_aime_te_voir', selectLabel: "J'ai aimé te voir", selectedLabel: "J'ai aimé passer du temps avec toi" },
  { id: 35, slug: 'belle_surprise', selectLabel: 'Belle surprise', selectedLabel: "Ça m'a fait plaisir de te retrouver" },
];
