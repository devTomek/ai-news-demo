## AI Daily Notes

AI researches the latest news from the AI world and generates one post per day from those sources. The daily automation runs with Vercel Cron.

## Getting Started

Install dependencies:

```bash
npm i
```

Apply database migrations once for a fresh database:

```bash
npm run db:migrate
```

Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Local Postgres

Docker Compose is only needed if you want to run Postgres locally instead of using Neon:

```bash
docker compose up -d
```
