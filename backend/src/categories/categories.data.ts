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

export const STEPS: CategoryStep[] = [
  {
    id: 1,
    slug: 'curiosity',
    name: 'Curiosité',
    description: 'Envie de découvrir davantage la personne.',
    emotions: [
      { key: 'want_to_know_you', label: 'Envie de te connaître plus' },
      { key: 'want_to_understand_you', label: 'Envie de mieux te comprendre' },
      { key: 'interested_in_you', label: "Tu m'intéresses" },
      { key: 'want_to_discover_you', label: 'Envie de découvrir qui tu es' },
    ],
  },
  {
    id: 2,
    slug: 'connection',
    name: 'Connexion',
    description: 'Sentiment de proximité ou envie de créer un lien.',
    emotions: [
      { key: 'feel_connected', label: 'Je me sens connecté à toi' },
      { key: 'feel_comfortable', label: 'Je me sens bien avec toi' },
      { key: 'feel_close_to_you', label: 'Je me sens proche de toi' },
      { key: 'want_to_build_a_connection', label: 'Envie de créer un lien' },
    ],
  },
  {
    id: 3,
    slug: 'affection',
    name: 'Affection',
    description: 'Attachement, affection ou intérêt émotionnel.',
    emotions: [
      { key: 'like_you', label: 'Tu me plais' },
      { key: 'feel_affection', label: "J'ai de l'affection pour toi" },
      { key: 'miss_you', label: 'Tu me manques' },
      { key: 'think_about_you', label: 'Je pense à toi' },
      { key: 'feel_attracted', label: 'Je suis attiré par toi' },
    ],
  },
  {
    id: 4,
    slug: 'proximity',
    name: 'Proximité',
    description: 'Envie de passer du temps ensemble ou de retrouver la personne.',
    emotions: [
      { key: 'want_to_see_you_again', label: 'Envie de te revoir' },
      { key: 'want_to_spend_time_together', label: 'Envie de passer du temps avec toi' },
      { key: 'want_to_talk', label: 'Envie de parler avec toi' },
      { key: 'want_to_meet', label: 'Envie de te rencontrer' },
    ],
  },
  {
    id: 5,
    slug: 'friendship',
    name: 'Amitié',
    description: "Envie d'établir ou de maintenir une relation amicale.",
    emotions: [
      { key: 'want_friendship', label: "Envie d'une amitié" },
      { key: 'want_to_be_friends', label: "J'aimerais être ton ami" },
      { key: 'want_to_keep_in_touch', label: 'Envie de garder contact' },
      { key: 'want_to_share', label: 'Envie de partager des choses avec toi' },
    ],
  },
  {
    id: 6,
    slug: 'romantic',
    name: 'Romantique',
    description: 'Attirance ou envie d\'explorer une relation romantique.',
    emotions: [
      { key: 'romantic_interest', label: 'Intérêt romantique' },
      { key: 'want_to_date', label: "Envie d'un rendez-vous" },
      { key: 'want_something_more', label: 'Envie de quelque chose de plus' },
      { key: 'developing_feelings', label: 'Des sentiments commencent à apparaître' },
    ],
  },
  {
    id: 7,
    slug: 'distance',
    name: 'Distance',
    description: 'Besoin de réduire, suspendre ou terminer la proximité.',
    emotions: [
      { key: 'need_space', label: "Besoin d'espace" },
      { key: 'want_to_take_distance', label: 'Envie de prendre de la distance' },
      { key: 'not_ready', label: "Je ne suis pas prêt" },
      { key: 'uncertain', label: 'Je ne sais pas ce que je ressens' },
      { key: 'want_to_slow_down', label: 'Envie de ralentir' },
      { key: 'want_to_end_connection', label: 'Envie de mettre fin à la relation' },
    ],
  },
];
