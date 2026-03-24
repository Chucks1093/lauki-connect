# Lauki Connect Build Sections

This file breaks the build into vertical slices from start to finish.

Current product rule:
- this is our own intro and discovery engine
- we are not waiting on a Lauki API
- we own profile search, ranking, saved matches, and future data ingestion

## Build Rule

Each section should ship a working user-visible flow, not just backend or frontend code in isolation.

For every section, we should aim to complete:
1. UI
2. API
3. persistence if needed
4. happy-path test
5. error-state test
6. short manual demo check

## Product Frame

Lauki Connect helps people find the right investor, builder, operator, partner, or opportunity for what they are working on.

Core loop:
1. user describes what they need
2. app searches profiles
3. app ranks the best matches
4. app explains why they fit
5. user saves profiles or reaches out directly

## Parallel Base Track

Purpose:
Add Base-native identity and credibility without forcing core search logic onchain.

Rule:
- keep search and ranking in the normal app
- use Base for wallet identity and future reputation signals
- do not move search logic onchain
- do not add gas costs to normal app usage

Best first Base feature:
wallet sign-in + Base builder profile

## Section 1: Workspace Foundation

Purpose:
Set up the repo so both apps can run locally and we can iterate safely.

Steps:
1. keep a separate `client` and `server`
2. use Vite + React for the client
3. use Next.js for the server
4. connect the server to Supabase directly
5. add root documentation
6. confirm both apps build
7. confirm the client can talk to the server
8. confirm the server health route works

Deliverable:
A working local workspace with a Vite frontend and a Next.js server.

Test check:
- frontend loads locally
- server responds locally
- `GET /api/health` works from the frontend

## Section 2: Wallet Auth Slice

Purpose:
Use Base wallet sign-in as the app identity layer.

Steps:
1. add nonce route
2. add verify route
3. add session route
4. add logout route
5. verify signed message server-side
6. store session in cookie
7. show sign-in state in the header
8. show connected wallet state in the header

Deliverable:
A user can sign in with a Base wallet and the app can read that session.

Test check:
- user can sign in
- valid signature creates session
- invalid signature is rejected
- logout clears session

## Section 3: Search Slice

Purpose:
Let the user search directly from the landing page without creating a connect-request record.

Steps:
1. define the profile search request shape
2. define the profile result shape
3. add `POST /api/profiles/search`
4. wire landing search input to the endpoint
5. add loading, success, and failure states
6. support quick prompts in the landing page

Deliverable:
A user can search from the landing page and get ranked profile matches back immediately.

Test check:
- valid search returns results
- invalid search shows clear error
- landing page stays on the root route

## Section 4: Match Card Slice

Purpose:
Make search results easy to scan and compare.

Steps:
1. design the profile card layout
2. show name, role, company, score, and reason
3. make the result cards consistent with the landing page style
4. make save action visible on each card
5. support empty and loading states

Deliverable:
Polished result cards that feel like a real product surface.

Test check:
- result cards render in ranked order
- card content is readable and consistent
- save action is visible and clear

## Section 5: Saved Matches Slice

Purpose:
Let users keep the best profiles for later.

Steps:
1. define the saved profile model
2. add Supabase migration for saved profiles
3. add `GET /api/profiles/saved`
4. add `POST /api/profiles/saved`
5. add `DELETE /api/profiles/saved/:profileId`
6. build the dashboard as a saved matches page

Deliverable:
Authenticated users can save and revisit profile matches.

Test check:
- signed-in user can save a profile
- saved profile appears on dashboard
- remove action works correctly

## Section 6: Profile Detail Slice

Purpose:
Turn a search result into something the user can inspect before reaching out.

Steps:
1. create a profile detail screen
2. show full reason and fit context
3. show public profile links if available
4. show a suggested intro angle
5. show public contact path if available

Deliverable:
A profile detail view that helps users decide whether to reach out.

Test check:
- user can open a profile detail view
- detail content matches the selected result

## Section 7: Ranking Improvement Slice

Purpose:
Improve the quality of search results beyond simple keyword overlap.

Steps:
1. improve scoring for role alignment
2. improve scoring for geography
3. improve scoring for stage or market relevance
4. improve scoring for Base ecosystem alignment
5. improve explanation text so it reflects the score

Deliverable:
Better ranking with more believable explanations.

Test check:
- same searches produce more sensible ordering
- weak matches are easier to spot

## Section 8: Real Data Slice

Purpose:
Replace mock profiles with real profile data.

Steps:
1. decide the first real data source
2. define ingestion format
3. store normalized profiles in Supabase
4. search local stored profiles instead of only mock data
5. add source metadata and freshness data

Deliverable:
Search is backed by real profile data, not only mock profiles.

Test check:
- ingested profiles are searchable
- search still responds fast
- ranking works on real records

## Section 9: Enrichment Slice

Purpose:
Make profiles more useful by adding public identity and context.

Steps:
1. add Base wallet identity where available
2. add Basenames or ENS if available
3. add Farcaster or GitHub links if available
4. show public signals on the profile card or detail view

Deliverable:
Richer profiles with stronger credibility and context.

Test check:
- enriched data appears cleanly
- missing enrichment does not break the UI

## Section 10: Demo Readiness Slice

Purpose:
Make the product coherent and easy to show.

Steps:
1. clean all stale request-era language
2. tighten empty states
3. tighten save flow messaging
4. confirm auth flow is stable
5. confirm search flow is stable
6. confirm dashboard flow is stable

Deliverable:
A demo-ready MVP that clearly shows the product value.

Test check:
- new user can understand the app quickly
- search, save, and revisit flow works cleanly
