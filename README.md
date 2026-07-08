# AI Daily Notes

Fullstack demo app built with Next.js, TypeScript, Postgres, Prisma and
Tailwind CSS.

It shows a one-column AI news/blog homepage, post detail pages and light/dark
mode.

## Getting Started

Copy env values:

```bash
cp .env.example .env
```

Start Postgres:

```bash
docker compose up -d
```

Prepare the database:

```bash
npm run db:generate
npm run db:migrate
```

Run the app:

```bash
npm run dev
```

Open http://localhost:3000.
