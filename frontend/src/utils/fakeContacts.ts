import { ContactKanjoDto } from '../api/client';

// Dev-only preview data — lets the two-pane contacts/history layout be
// evaluated with a realistic multi-entry history before the backend
// actually keeps one (today a new kanjo to the same person overwrites
// the previous row, so real accounts rarely have more than one per side).
const FAKE_CONTACTS = [
  { username: 'lea_martin' },
  { username: 'noah92' },
  { username: 'sofia_b' },
  { username: 'mehdi_k' },
  { username: 'clara_d' },
];

const FAKE_CATEGORIES = [
  { id: 1, name: 'Je te trouve sympa' },
  { id: 2, name: "J'aimerais être ton ami(e)" },
  { id: 6, name: 'Je pense à toi' },
  { id: 16, name: 'J’ai passé un bon moment avec toi' },
  { id: 21, name: "J'avais envie de te parler" },
  { id: 26, name: 'Je voulais juste te faire un coucou' },
  { id: 31, name: "Tu m'as fait sourire aujourd'hui" },
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export function generateFakeContacts(): ContactKanjoDto[] {
  const entries: ContactKanjoDto[] = [];

  FAKE_CONTACTS.forEach((contact, contactIndex) => {
    const userId = `fake-user-${contactIndex}`;
    const historyLength = randomInt(2, 5);
    let daySeed = randomInt(0, 2);

    for (let i = 0; i < historyLength; i++) {
      const direction: 'sent' | 'received' = Math.random() > 0.45 ? 'sent' : 'received';
      const category = pick(FAKE_CATEGORIES);
      daySeed += randomInt(1, 6);

      entries.push({
        id: `fake-${contactIndex}-${i}`,
        user: { id: userId, username: contact.username },
        categoryId: category.id,
        categoryName: category.name,
        direction,
        checked: direction === 'sent' ? Math.random() > 0.3 : undefined,
        createdAt: daysAgo(daySeed),
        url: `https://kanjoo.vercel.app/${contact.username}/fake${contactIndex}${i}`,
      });
    }
  });

  entries.push({
    id: 'fake-unknown-0',
    user: null,
    categoryId: FAKE_CATEGORIES[0].id,
    categoryName: FAKE_CATEGORIES[0].name,
    direction: 'sent',
    checked: false,
    createdAt: daysAgo(1),
    url: 'https://kanjoo.vercel.app/me/fakeunknown0',
  });

  return entries;
}
