export interface Category {
  id: number;
  slug: string;
  // Shown to the user who is generating/sending a kanjo (the picker).
  selectLabel: string;
  // Shown to the user who discovers/receives the kanjo (the reveal). This is
  // also what gets snapshotted onto a state at creation time (see
  // categoryName in states.service.ts / shared-states.service.ts), so it's
  // what a discoverer still sees for an old state even if this category is
  // later removed from the list below.
  selectedLabel: string;
  // How strongly this category signals emotional investment, on a 0-100
  // scale. Used by the frontend to tint the category with a shade of red —
  // 0 stays neutral, 100 is the deepest red.
  intensity: number;
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
  { id: 1, slug: 'sympathie', selectLabel: 'Sympathie', selectedLabel: 'Je te trouve sympa', intensity: 10 },
  { id: 2, slug: 'amistad', selectLabel: 'Amitié', selectedLabel: "J'aimerais être ton ami(e)", intensity: 15 },
  { id: 3, slug: 'compania', selectLabel: 'Compagnie', selectedLabel: "J'aime passer du temps avec toi", intensity: 15 },
  { id: 4, slug: 'cercania', selectLabel: 'Proximité', selectedLabel: 'Je me sens proche de toi', intensity: 5 },
  { id: 5, slug: 'conexion', selectLabel: 'Connexion', selectedLabel: 'Je me sens connecté(e) à toi', intensity: 5 },
  { id: 6, slug: 'interes', selectLabel: 'Intérêt', selectedLabel: 'Je pense à toi', intensity: 25 },
  { id: 7, slug: 'extranar', selectLabel: 'Manque', selectedLabel: 'Tu me manques', intensity: 40 },
  { id: 8, slug: 'atraccion', selectLabel: 'Attirance', selectedLabel: 'Je suis attiré(e) par toi', intensity: 20 },
  { id: 9, slug: 'gusto', selectLabel: 'Tu me plais', selectedLabel: 'Tu me plais', intensity: 30 },
  { id: 10, slug: 'sentimientos', selectLabel: 'Sentiments', selectedLabel: 'Des sentiments commencent à apparaître', intensity: 45 },
];
