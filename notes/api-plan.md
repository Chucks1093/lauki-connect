# API Plan

## Endpoints

- `GET /api/health`
- `POST /api/connect-requests`
- `GET /api/connect-requests`
- `GET /api/connect-requests/:id/matches`
- `POST /api/feedback`

## First response shape

Each match should include:

- `id`
- `name`
- `role`
- `company`
- `location`
- `score`
- `reason`
- `introDraft`
