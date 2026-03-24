# Lauki Connect Build Sections

This file breaks the build into vertical slices from start to finish.

The goal is to build one feature at a time, test it through the frontend, and only then move to the next feature.

## Build Rule

Each section should ship a working user-visible flow, not just backend or frontend code in isolation.

For every section, we should aim to complete:

1. UI
2. API
3. persistence if needed
4. happy-path test
5. error-state test
6. short manual demo check

That means we should avoid building the whole backend first and the whole frontend later.

## Section 1: Workspace Foundation

Purpose:
Set up the repo so both apps can run locally and we can iterate safely.

Steps:
1. create the root project structure
2. add separate `client` and `server` apps
3. add root `README.md`
4. add root `docker-compose.yml` for Postgres
5. add `.gitignore`
6. define package managers and scripts
7. install dependencies for both apps
8. confirm both apps build
9. add a basic health check route on the server
10. add a basic frontend shell that can talk to the server

Deliverable:
A working local workspace with Vite frontend, Node.js backend, and Docker Postgres.

Test check:
- frontend loads locally
- backend responds locally
- `GET /api/health` works from the frontend

## Section 2: Product Contract

Purpose:
Lock the MVP before building too much behavior.

Steps:
1. define the main user of the app
2. define the main problem they are trying to solve
3. define the exact request input fields for MVP
4. define the exact output fields for a match
5. define what makes a match useful
6. define the first success metric for the MVP
7. define the shortest demo flow from request to result
8. write 3 to 5 sample requests we can use throughout development
9. define what we mean by `good enough` for the first ranking pass

Deliverable:
A locked MVP contract for requests, matches, intro suggestions, and feedback.

Test check:
- every later feature can be checked against these inputs, outputs, and demo scenarios

## Section 3: Request Submission Slice

Purpose:
Build the first real feature: submit a request from the frontend and save it.

Steps:
1. design the `ConnectRequest` model
2. add the model to `server/prisma/schema.prisma`
3. create the database connection layer
4. run `prisma generate`
5. push the schema to local Postgres
6. add `POST /api/connect-requests`
7. validate request input with Zod
8. build the request form UI
9. collect goal, requester, and optional filters
10. submit the form from the frontend
11. handle loading, success, and error states
12. show a confirmation state or redirect after creation

Deliverable:
A working request flow from form input to a saved request record.

Test check:
- user can submit a request from the UI
- request is saved in the database
- invalid input shows clear errors

## Section 4: First Match Results Slice

Purpose:
Return and display the first ranked matches using mock Lauki data.

Steps:
1. define the Lauki adapter interface
2. start with a mock adapter for local development
3. define the candidate match shape
4. implement a simple ranking function
5. add explanation generation for each match
6. add intro draft generation for each match
7. add `GET /api/connect-requests/:id/matches`
8. build the results page in the frontend
9. fetch matches for the created request
10. show score, reason, and intro draft
11. handle empty and failure states

Deliverable:
A user can submit a request and see ranked matches with explanations.

Test check:
- seeded mock candidates return deterministic results
- results render in the frontend in ranked order
- empty state and API failure state are visible and understandable

## Section 5: Match Detail Slice

Purpose:
Turn a ranked result into something the user can inspect and act on.

Steps:
1. persist candidate matches if needed for later actions
2. create the match detail screen
3. show the full explanation for the match
4. show key profile and context details
5. show the recommended intro angle
6. show the suggested intro message
7. add simple match status labels such as `new`, `reviewed`, or `contacted`
8. link each result card to the detail page

Deliverable:
A match detail view that makes each recommendation actionable.

Test check:
- clicking a result opens the correct detail view
- detail data matches what was shown in results
- status labels render correctly

## Section 6: Feedback Slice

Purpose:
Capture whether the recommendations are useful.

Steps:
1. design the `FeedbackEvent` model
2. store feedback against the request and optional match
3. add `POST /api/feedback`
4. add feedback controls on result cards or detail view
5. support positive and negative feedback
6. support an optional note
7. show success and failure states in the frontend

Deliverable:
A working feedback loop with stored feedback events.

Test check:
- feedback can be submitted from the UI
- feedback is saved correctly
- repeated feedback behavior is defined and handled clearly

## Section 7: Request History Slice

Purpose:
Make past requests and their results easy to revisit.

Steps:
1. add `GET /api/connect-requests`
2. build the dashboard page
3. list saved requests with useful metadata
4. allow navigation back into results for an old request
5. show empty state for a new user
6. keep the data shape simple and fast to scan

Deliverable:
A basic dashboard with saved request history.

Test check:
- old requests appear after creation
- user can reopen previous results
- empty dashboard state is clear

## Section 8: Ranking Improvement Slice

Purpose:
Improve match quality beyond the first simple scoring pass.

Steps:
1. add scoring rules for role alignment
2. add scoring rules for geography or market context
3. add scoring rules for trust distance or network proximity
4. add scoring rules for mutual context
5. add recency or freshness where relevant
6. handle low-confidence results
7. refine explanation text so the reasons reflect the scoring logic
8. compare improved scoring against the sample requests from Section 2

Deliverable:
A stronger ranking engine with more believable reasons.

Test check:
- ranking changes are visible on known sample requests
- explanation text stays aligned with actual scoring behavior
- weak matches are clearly identified

## Section 9: Lauki Integration Slice

Purpose:
Prepare the system to swap mock data for real Lauki-backed retrieval.

Steps:
1. define exactly what data is needed from Lauki
2. map Lauki entities into local candidate types
3. isolate all external integration code behind the adapter boundary
4. add configuration for mock versus live mode
5. add fallback behavior if live Lauki data is unavailable
6. verify the API contract does not need to change when the adapter changes

Deliverable:
A clean Lauki adapter boundary with mock data first and live integration ready later.

Test check:
- mock mode still works reliably
- live adapter can be introduced without rewriting the frontend

## Section 10: Action Workflow Slice

Purpose:
Move from recommendation to outreach.

Steps:
1. define the first handoff action for MVP or near-MVP
2. start with a simple action such as copy intro text or mark as contacted
3. prepare the structure for future Telegram or email actions
4. track outcome states such as `intro sent`, `accepted`, `replied`, or `converted`
5. make sure action history is visible in the UI

Deliverable:
A basic action layer that helps users follow through on a match.

Test check:
- user can take at least one clear follow-up action from the frontend
- outcome state changes are saved and visible

## Section 11: Quality and Demo Readiness

Purpose:
Make the product stable, understandable, and easy to demo.

Steps:
1. clean up naming across the app
2. remove old placeholders and dead code
3. prepare seeded mock scenarios for demos
4. test the full flow end to end
5. verify setup instructions are accurate
6. make the landing page explain the product clearly
7. prepare short launch copy
8. prepare screenshots or a short walkthrough

Deliverable:
A demo-ready MVP that clearly shows the value of Lauki Connect.

Test check:
- a new user can understand the product quickly
- the full request to result flow works without manual fixes
- demo scenarios are reliable and repeatable

## Recommended Build Order Summary

Build in this order:

1. foundation
2. product contract
3. request submission
4. first match results
5. match detail
6. feedback
7. request history
8. ranking improvements
9. Lauki integration
10. action workflow
11. demo readiness

This order keeps the project user-visible at every step and makes it easier to test one feature at a time through the frontend.
