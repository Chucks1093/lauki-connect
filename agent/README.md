# Lauki Connect Agent

This workspace is the Cloudflare agent runtime for `lauki-connect`.

It is intentionally narrower than `text-wallet-learn`:

- profile discovery
- candidate ranking
- structured search responses

not:

- generic chat
- market tooling
- trade execution

## What Lives Here

- Cloudflare Worker entrypoint
- Durable Object profile search agent
- profile search tool layer
- `/search` HTTP endpoint for the app

## Current Shape

The app can call this worker with:

```http
POST /search
Content-Type: application/json

{ "query": "base investor for creator tools", "limit": 6 }
```

and receive ranked profile candidates back.

## Run Later

1. install dependencies in `agent/`
2. copy `.dev.vars.example` to `.dev.vars`
3. run `pnpm dev`

This worker is meant to sit beside:

- `client/`
- `server/`

where:

- `server/` owns auth and saved matches
- `agent/` owns profile discovery orchestration
