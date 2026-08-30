export interface CategoryStep {
  id: number;
  name: string;
  feelings: string[];
}

export const STEPS: CategoryStep[] = [
  {
    id: 1,
    name: 'Début',
    feelings: [
      'Enchanté de te rencontrer',
      "Tu m'intéresses",
      'J\'ai envie de te connaître',
      'Tu me plais',
      "J'ai envie de plus",
    ],
  },
  {
    id: 2,
    name: 'Découverte',
    feelings: [
      'On se découvre',
      'Bonne connexion',
      'On a beaucoup en commun',
      'Je veux te revoir',
      "Je commence à m'attacher",
    ],
  },
  {
    id: 3,
    name: 'Connexion',
    feelings: [
      'Attirance',
      'Complicité',
      'Confiance',
      'Connexion émotionnelle',
      'Je me sens bien avec toi',
    ],
  },
  {
    id: 4,
    name: 'Relation',
    feelings: [
      'Stable',
      'Complice',
      'Attaché',
      'Heureux ensemble',
      'Amoureux',
      'Très proche',
    ],
  },
  {
    id: 5,
    name: 'Tension',
    feelings: [
      'Quelque chose a changé',
      'Je doute',
      'Je suis frustré',
      "On s'éloigne",
      'On se comprend moins',
      'Je ne sais plus',
    ],
  },
  {
    id: 6,
    name: 'Séparé',
    feelings: [
      "Besoin d'espace",
      'En pause',
      'Séparés',
      'Rupture récente',
      'Je pense encore à toi',
      "Je veux passer à autre chose",
    ],
  },
  {
    id: 7,
    name: 'Après',
    feelings: [
      'Nostalgique',
      'Je regrette',
      'Je pardonne',
      'On reste amis',
      "Je suis passé à autre chose",
      'Je recommence ailleurs',
    ],
  },
];
