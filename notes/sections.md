# Lauki Connect Build Sections

This file breaks the full build into clear sections with concrete steps. The goal is to make execution straightforward from setup to demo.

## Section 1: Project Foundation

Purpose:
Set up the workspace so the app can run locally and grow cleanly.

Steps:
1. create the root project structure
2. add separate `client` and `server` apps
3. add root `README.md`
4. add root `docker-compose.yml` for Postgres
5. add `.gitignore`
6. define package managers and scripts
7. confirm both apps can install dependencies
8. confirm both apps can build successfully

Deliverable:
A working local workspace with Vite frontend, Node.js backend, and Docker Postgres.

## Section 2: Product Flow Definition

Purpose:
Define exactly what the app does before building too much logic.

Steps:
1. define the main user of the app
2. define the main problem the user is trying to solve
3. define the main input the user submits
4. define the output the app should return
5. define what makes a match useful
6. define the first success metric for the MVP
7. define the shortest demo flow from input to result

Deliverable:
A locked MVP flow for requests, matches, intros, and feedback.

## Section 3: Data Model and Persistence

Purpose:
Create the data backbone of the app.

Steps:
1. design Prisma models for requests, matches, intro suggestions, and feedback
2. add the models to `server/prisma/schema.prisma`
3. create the database connection layer
4. run `prisma generate`
5. push the schema to the local Postgres database
6. test basic create and read operations
7. make sure the database structure supports future Lauki integration

Deliverable:
A working database schema that can persist app data.

## Section 4: Backend API

Purpose:
Build the Node.js API that powers the product.

Steps:
1. set up the Express app and shared middleware
2. add a health route
3. add a route to create a connect request
4. validate request input with Zod
5. add a route to list saved requests
6. add a route to fetch matches for a request
7. add a route to submit feedback
8. standardize API response shapes
9. add basic error handling
10. verify all routes work locally

Deliverable:
A stable API for request creation, match retrieval, and feedback.

## Section 5: Lauki Integration Layer

Purpose:
Create a clean boundary for Lauki-powered matching.

Steps:
1. define the adapter interface for Lauki data access
2. start with a mock adapter for local development
3. define what data is needed from Lauki
4. map Lauki entities into local match candidate types
5. add a place for profile, relationship, and context data
6. structure the code so the mock adapter can be swapped later
7. prepare the code for a real Lauki integration

Deliverable:
A reusable Lauki adapter boundary with mock data first and real integration later.

## Section 6: Matching and Ranking Engine

Purpose:
Turn raw candidate data into ranked recommendations.

Steps:
1. define the candidate match shape
2. create scoring rules for relevance
3. add scoring rules for role alignment
4. add scoring rules for geography or market context
5. add scoring rules for mutual context or network proximity
6. sort matches by score
7. generate a short explanation for each match
8. generate a suggested intro angle
9. handle low-quality or low-confidence results
10. return a clean ranked list to the API

Deliverable:
A ranking engine that explains why each recommendation appears.

## Section 7: Frontend App Shell

Purpose:
Build the main product surface in Vite.

Steps:
1. set up the React app entry point
2. add routing
3. create a shared app shell layout
4. create the landing page
5. create the dashboard page
6. create the new request page
7. create the results page
8. create the match detail page
9. add shared styling and layout rules
10. make sure the app works on desktop and mobile

Deliverable:
A usable frontend shell with the main pages in place.

## Section 8: Request Submission Flow

Purpose:
Let users submit what they need and get a real response.

Steps:
1. build the request form UI
2. collect goal, requester, and optional filters
3. validate client-side inputs
4. submit the form to the backend
5. handle loading and error states
6. store the created request id
7. redirect the user to the results screen
8. confirm the backend response is rendered correctly

Deliverable:
A working request flow from form input to match results.

## Section 9: Match Results Experience

Purpose:
Show the recommendations in a way that is easy to understand and act on.

Steps:
1. fetch matches for a saved request
2. build reusable match cards
3. show score, summary, and reasoning
4. show suggested intro direction
5. link each result to a detail screen
6. add empty states
7. add failure states
8. make sure result ordering is clear
9. make the results easy to scan quickly

Deliverable:
A readable results experience that demonstrates the app clearly.

## Section 10: Match Detail and Intro Suggestion

Purpose:
Expand a single recommendation into something actionable.

Steps:
1. create the match detail screen
2. show the full explanation for the match
3. show key profile and context details
4. show the recommended intro angle
5. show a suggested message draft
6. add status labels such as `new`, `reviewed`, or `contacted`
7. prepare the structure for future Telegram or email actions

Deliverable:
A match detail view that turns ranking output into action.

## Section 11: Feedback Loop

Purpose:
Capture whether the recommendations are actually useful.

Steps:
1. add feedback controls on results or detail views
2. support positive and negative feedback
3. send feedback events to the backend
4. store feedback in the database
5. relate feedback back to the request and match
6. prepare the scoring layer to use this signal later
7. track what recommendations perform well

Deliverable:
A stored feedback loop that can improve ranking over time.

## Section 12: Demo Readiness

Purpose:
Make the project presentable for Lauki and easy to understand fast.

Steps:
1. clean up naming across the app
2. remove temporary placeholder content that is no longer needed
3. make the landing page explain the product clearly
4. prepare seeded mock scenarios for demo requests
5. test the full flow end to end
6. confirm setup instructions are accurate
7. prepare short launch copy
8. prepare a short product explanation
9. prepare screenshots or a quick walkthrough

Deliverable:
A demo-ready build with a clear story and working product flow.

## Section 13: Post-MVP Expansion

Purpose:
Capture what comes after the first working version.

Steps:
1. replace the mock Lauki adapter with a real integration
2. add filters for industry, region, and role
3. add authentication if needed
4. add Telegram or email handoff
5. add saved history and search
6. add relationship strength or trust distance scoring
7. add team collaboration features
8. add analytics around intro outcomes

Deliverable:
A roadmap for turning the MVP into a stronger product.
