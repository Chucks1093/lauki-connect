# Lauki Connect

Lauki Connect is a relationship-aware intro engine that helps people find the right collaborators, founders, operators, investors, and opportunities.

## Workspace

- `client/`: Vite + React frontend
- `server/`: Node.js + Express API

## Run

Database:

```bash
docker compose up -d postgres
```

Server:

```bash
cd server
pnpm install
pnpm prisma:generate
pnpm dev
```

Client:

```bash
cd client
pnpm install
pnpm dev
```

## Notes

- [Build sections](./notes/sections.md)
- [MVP](./notes/mvp.md)
- [Features](./notes/features.md)
- [API plan](./notes/api-plan.md)

