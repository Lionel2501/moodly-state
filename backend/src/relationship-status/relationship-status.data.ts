export interface RelationshipStatusOption {
  id: number;
  slug: string;
  label: string;
}

// A single current value per (user, aboutUser) pair — unlike categories,
// there's no select/selected split: the same label is shown to whoever set
// it and to the contact it's about. Ids are stable/append-only, same rule
// as CATEGORIES — never renumber or reuse.
export const RELATIONSHIP_STATUSES: RelationshipStatusOption[] = [
  { id: 1, slug: 'juste_un_date', label: 'Juste un date' },
  { id: 2, slug: 'amitie', label: 'Amitié' },
  { id: 3, slug: 'amitie_et_plus', label: 'Amitié et plus' },
  { id: 4, slug: 'compromis', label: 'Compromis' },
  { id: 5, slug: 'couple', label: 'Couple' },
];
