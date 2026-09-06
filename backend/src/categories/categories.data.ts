export interface Category {
  id: number;
  slug: string;
  name: string;
}

// A single flat list of the emotional states a user can pick from — this
// used to be grouped into steps with sub-categories underneath, but that
// hierarchy was flattened into one list to be more understandable at a
// glance. Ids are stable across the app's history (they're persisted on
// created states), so existing entries must never be renumbered; only
// append new ones.
export const CATEGORIES: Category[] = [
  { id: 1, slug: 'want_to_know_you', name: 'Envie de te connaître plus' },
  { id: 2, slug: 'interested_in_you', name: "Tu m'intéresses" },
  { id: 3, slug: 'want_to_understand_you', name: 'Envie de mieux te comprendre' },
  { id: 4, slug: 'want_to_discover_you', name: 'Envie de découvrir qui tu es' },
  { id: 5, slug: 'feel_connected', name: 'Je me sens connecté à toi' },
  { id: 6, slug: 'feel_close_to_you', name: 'Je me sens proche de toi' },
  { id: 7, slug: 'want_to_spend_time_together', name: 'Envie de passer du temps avec toi' },
  { id: 8, slug: 'want_to_see_you_again', name: 'Envie de te revoir' },
  { id: 9, slug: 'want_to_be_friends', name: "J'aimerais être ton ami" },
  { id: 10, slug: 'want_to_keep_in_touch', name: 'Envie de garder contact' },
  { id: 11, slug: 'like_you', name: 'Tu me plais' },
  { id: 12, slug: 'feel_affection', name: "J'ai de l'affection pour toi" },
  { id: 13, slug: 'miss_you', name: 'Tu me manques' },
  { id: 14, slug: 'think_about_you', name: 'Je pense à toi' },
  { id: 15, slug: 'feel_attracted', name: 'Je suis attiré par toi' },
  { id: 16, slug: 'developing_feelings', name: 'Des sentiments commencent à apparaître' },
  { id: 17, slug: 'need_space', name: "Besoin d'espace" },
  { id: 18, slug: 'want_to_take_distance', name: 'Envie de prendre de la distance' },
  { id: 19, slug: 'want_to_slow_down', name: 'Envie de ralentir' },
  { id: 20, slug: 'not_ready', name: "Je ne suis pas prêt" },
  { id: 21, slug: 'uncertain', name: 'Je ne sais pas ce que je ressens' },
  { id: 22, slug: 'want_to_end_connection', name: 'Envie de mettre fin à la relation' },
];
