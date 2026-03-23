# Lauki Connect

Lauki Connect is a relationship-aware intro engine that helps people find the right collaborators, founders, operators, investors, and opportunities.

## Workspace

This project is split into two apps:

- `client/`: Vite + React frontend
- `server/`: Node.js + Express API

## Why this setup

We are keeping the stack simple:

- Vite for a fast frontend workflow
- Node.js + Express for a clear API layer
- PostgreSQL for persistence
- Prisma for the database layer
- Docker Compose for local database setup

## MVP

The first version should let a user:

1. submit a connect request
2. receive ranked matches
3. see why each match is relevant
4. review a suggested intro message
5. leave feedback on result quality

## Run plan

Database:

```bash
docker compose up -d postgres
```

Server:

```bash
cd server
pnpm install
pnpm prisma:generate
pnpm prisma:push
pnpm dev
```

Client:

```bash
cd client
pnpm install
pnpm dev
```

## Notes

- [Project sections](./notes/sections.md)
- [MVP scope](./notes/mvp.md)
- [Feature map](./notes/features.md)
- [API plan](./notes/api-plan.md)
