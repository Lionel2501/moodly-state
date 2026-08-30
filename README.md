# moodly state

SaaS où chaque utilisateur génère un "state" (une catégorie + une sous-catégorie
issues d'un parcours en 7 étapes) et obtient une URL courte et unique à partager :
`{BASE_URL}/{username}/{code}`. La personne qui ouvre cette URL voit uniquement la
catégorie et la sous-catégorie, sans avoir de compte.

## Stack

- `backend`: NestJS + Prisma + PostgreSQL (Neon), auth JWT en cookie httpOnly
- `frontend`: React + Vite + React Router

## Modèle

- `User`: id, username (unique, utilisé dans l'URL), email (unique), passwordHash
- `MoodState`: id, userId, code, stepId, stepName, feeling, createdAt
  - Contrainte unique sur `(userId, code)` : le code doit juste être unique **par
    utilisateur** (deux utilisateurs différents peuvent avoir le même code), car
    l'URL publique résout par la paire `(username, code)`.

## Flux

1. `/login` / `/register` — connexion ou création de compte.
2. `/` (protégée) — bouton **Generate** + liste des states déjà générés par
   l'utilisateur (catégorie, sous-catégorie, url à copier).
3. `/generate` (protégée) — liste des 7 catégories (Début, Découverte, Connexion,
   Relation, Tension, Séparé, Après).
4. `/generate/:stepId` (protégée) — liste des sous-catégories de la catégorie
   choisie. Cliquer sur une sous-catégorie :
   - crée le state côté backend (génère un code unique nanoid pour cet
     utilisateur),
   - retourne l'URL `{BASE_URL}/{username}/{code}`, prête à copier.
5. `/:username/:code` (publique, sans auth) — affiche la catégorie et la
   sous-catégorie du state correspondant.

## Installation

### 1. Base de données (Neon)

Crée un projet sur [neon.tech](https://neon.tech), récupère la connection string
Postgres et mets-la dans `backend/.env` (`DATABASE_URL`).

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# édite .env : DATABASE_URL (Neon), JWT_SECRET, BASE_URL, CORS_ORIGIN
npx prisma migrate dev --name init
npm run start:dev        # http://localhost:3000 (API sous /api)
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173, proxy /api -> :3000
```

`BASE_URL` dans `backend/.env` doit correspondre à l'origine du frontend (ou au
domaine final en prod) : c'est ce qui préfixe les URLs générées.

## Notes

- Les noms d'utilisateur sont restreints (regex `[a-z0-9_-]{3,24}`) et une liste de
  mots réservés (`login`, `generate`, `api`, ...) est bloquée à l'inscription pour
  qu'ils ne rentrent jamais en conflit avec une route de l'app
  (`backend/src/auth/reserved-usernames.ts`).
- Les catégories/sous-catégories sont définies une seule fois côté backend
  (`backend/src/categories/categories.data.ts`) et servies via `GET /api/categories`
  — le frontend ne les duplique pas.
