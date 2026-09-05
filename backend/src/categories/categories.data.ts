export interface CategoryEmotion {
  key: string;
  label: string;
}

export interface CategoryStep {
  id: number;
  slug: string;
  name: string;
  description: string;
  emotions: CategoryEmotion[];
}

// Four stages of a relationship's timeline, each holding the emotions that
// belong to that stage's level of affection — from the first spark to
// needing distance.
export const STEPS: CategoryStep[] = [
  {
    id: 1,
    slug: 'debut',
    name: 'Début',
    description: 'Le tout début — curiosité et première étincelle.',
    emotions: [
      { key: 'want_to_know_you', label: 'Envie de te connaître plus' },
      { key: 'interested_in_you', label: "Tu m'intéresses" },
      { key: 'want_to_understand_you', label: 'Envie de mieux te comprendre' },
      { key: 'want_to_discover_you', label: 'Envie de découvrir qui tu es' },
    ],
  },
  {
    id: 2,
    slug: 'rapprochement',
    name: 'Rapprochement',
    description: 'On se rapproche — connexion, complicité, envie de se voir.',
    emotions: [
      { key: 'feel_connected', label: 'Je me sens connecté à toi' },
      { key: 'feel_close_to_you', label: 'Je me sens proche de toi' },
      { key: 'want_to_spend_time_together', label: 'Envie de passer du temps avec toi' },
      { key: 'want_to_see_you_again', label: 'Envie de te revoir' },
      { key: 'want_to_be_friends', label: "J'aimerais être ton ami" },
      { key: 'want_to_keep_in_touch', label: 'Envie de garder contact' },
    ],
  },
  {
    id: 3,
    slug: 'relation',
    name: 'Relation',
    description: "La relation s'installe — affection, attachement, sentiments.",
    emotions: [
      { key: 'like_you', label: 'Tu me plais' },
      { key: 'feel_affection', label: "J'ai de l'affection pour toi" },
      { key: 'miss_you', label: 'Tu me manques' },
      { key: 'think_about_you', label: 'Je pense à toi' },
      { key: 'feel_attracted', label: 'Je suis attiré par toi' },
      { key: 'developing_feelings', label: 'Des sentiments commencent à apparaître' },
    ],
  },
  {
    id: 4,
    slug: 'distance',
    name: 'Distance',
    description: 'Besoin de prendre du recul, de ralentir ou de mettre fin.',
    emotions: [
      { key: 'need_space', label: "Besoin d'espace" },
      { key: 'want_to_take_distance', label: 'Envie de prendre de la distance' },
      { key: 'want_to_slow_down', label: 'Envie de ralentir' },
      { key: 'not_ready', label: "Je ne suis pas prêt" },
      { key: 'uncertain', label: 'Je ne sais pas ce que je ressens' },
      { key: 'want_to_end_connection', label: 'Envie de mettre fin à la relation' },
    ],
  },
];
