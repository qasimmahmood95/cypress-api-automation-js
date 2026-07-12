# Cypress API Automation Framework

[![CI](https://github.com/qasimmahmood95/cypress-api-automation-js/actions/workflows/ci.yml/badge.svg)](https://github.com/qasimmahmood95/cypress-api-automation-js/actions/workflows/ci.yml)
[![Cypress](https://img.shields.io/badge/Cypress-13.x-17202C?logo=cypress&logoColor=white)](https://www.cypress.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A production-grade API test automation framework built with **Cypress** and **JavaScript**, testing the [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html) hotel booking API. It demonstrates the patterns I use for maintainable, trustworthy API suites: a service-object layer, JSON Schema contract validation, randomized test data builders, feature-scoped specs, and a CI pipeline with published HTML reports.

## Highlights

- **Service-object architecture** — every endpoint lives in one place (`cypress/support/api/`). Specs read as intent (`bookingService.createBooking(...)`), never as raw HTTP plumbing, and negative tests reuse the same services via a pass-through `options` object (`{ failOnStatusCode: false }`).
- **Contract testing with JSON Schema** — responses are validated structurally with [Ajv](https://ajv.js.org/) through a chainable custom command: `cy.request(...).validateSchema(bookingSchema)`. Catches breaking API changes that value assertions miss.
- **Randomized test data builders** — booking payloads are generated with [Faker](https://fakerjs.dev/) via a fluent builder (`new BookingBuilder().withFirstName('Updated').build()`), so tests never collide on shared static data and every field a test asserts on is pinned explicitly.
- **Independent, feature-scoped specs** — each test creates the data it needs; there is no ordering coupling. Specs are grouped by feature (`health/`, `auth/`, `booking/`) with dedicated positive and negative suites.
- **Hermetic CI with GitHub Actions** — every push to `main` and every pull request runs lint, format checks, and the full suite against a [restful-booker container](https://hub.docker.com/r/mwinteringham/restfulbooker) started as a job service, so merges are gated on deterministic runs that never depend on the public demo server. A nightly canary job exercises the live API as well. The mochawesome HTML report is uploaded as a build artifact on every run, pass or fail, and the latest `main` report is [published to GitHub Pages](https://qasimmahmood95.github.io/cypress-api-automation-js/).
- **Resilience against a flaky public API** — test retries are enabled for headless runs only (`retries: { runMode: 2, openMode: 0 }`), so local debugging still surfaces failures immediately.

## Project structure

```
├── .github/workflows/ci.yml        # Lint + test pipeline with report artifact
├── cypress/
│   ├── e2e/
│   │   ├── health/                 # /ping smoke check
│   │   ├── auth/                   # Token creation, invalid credentials
│   │   └── booking/                # CRUD + negative/authorization scenarios
│   ├── fixtures/                   # Static negative-path test data
│   └── support/
│       ├── api/                    # Service objects (auth, booking)
│       ├── builders/               # Faker-powered payload builders
│       ├── schemas/                # JSON Schema API contracts
│       ├── utils/                  # Ajv schema validator
│       ├── commands.js             # cy.validateSchema custom command
│       ├── constants.js            # Named HTTP status codes
│       └── e2e.js                  # Support entry point
├── cypress.config.js               # Base URL, retries, env, reporter
├── cypress.env.json.example        # Template for local env overrides
└── eslint.config.mjs               # ESLint flat config + Cypress plugin
```

## Test coverage

| Suite                    | Scenarios                                                                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `health-check.cy.js`     | API availability via `/ping`                                                                                                             |
| `auth.cy.js`             | Token issuance (schema-validated), invalid credential rejection                                                                          |
| `booking-crud.cy.js`     | List ids, filter by guest name, create (contract + echo assertions), read, full update (PUT), partial update (PATCH), delete + 404 check |
| `booking-negative.cy.js` | Missing/invalid payload fields, missing/invalid/absent auth tokens, non-existent resource handling                                       |

Where the demo API deviates from REST conventions (e.g. `201` on successful DELETE, `200` with a `reason` body for bad credentials), the tests assert the actual documented behaviour and carry a comment explaining the quirk — tests should document reality, not aspiration.

## Getting started

**Prerequisites:** Node.js 22 (pinned in `.nvmrc`); anything ≥ 18 works

```bash
git clone https://github.com/qasimmahmood95/cypress-api-automation-js.git
cd cypress-api-automation-js
npm ci
npm test
```

### Scripts

| Command                | What it does                                 |
| ---------------------- | -------------------------------------------- |
| `npm test`             | Run the full API suite headlessly            |
| `npm run test:chrome`  | Full suite in Chrome                         |
| `npm run test:smoke`   | Health-check suite only                      |
| `npm run test:auth`    | Auth suite only                              |
| `npm run test:booking` | Booking CRUD + negative suites               |
| `npm run cy:open`      | Open the Cypress runner for interactive runs |
| `npm run lint`         | ESLint (with Cypress plugin)                 |
| `npm run lint:fix`     | ESLint with autofix                          |
| `npm run format`       | Prettier write                               |
| `npm run format:check` | Prettier check (CI-enforced)                 |

### Configuration

| Setting      | Default                                | Override                        |
| ------------ | -------------------------------------- | ------------------------------- |
| Base URL     | `https://restful-booker.herokuapp.com` | `CYPRESS_BASE_URL` env variable |
| API username | `admin` (public demo credential)       | `CYPRESS_apiUsername`           |
| API password | `password123` (public demo credential) | `CYPRESS_apiPassword`           |

Secrets never belong in the repo — the defaults here are the API's published demo credentials; real environments should inject credentials via environment variables or a git-ignored `cypress.env.json` (copy `cypress.env.json.example` to get started).

## Reporting

Every headless run generates a self-contained HTML report (pass/fail charts, per-test timings and error detail) at `cypress/reports/index.html` via [cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter). In CI the report is uploaded as the `mochawesome-report` artifact on every run — including failures, which is when you need it most — and the latest `main` run's report is published live at **[qasimmahmood95.github.io/cypress-api-automation-js](https://qasimmahmood95.github.io/cypress-api-automation-js/)**.

## Design decisions

- **Service objects over "page objects"** — API tests have no pages; modelling endpoints as services keeps the abstraction honest and gives negative tests the same vocabulary as positive ones.
- **Schema validation as a custom command** — chaining `.validateSchema(...)` off `cy.request` keeps contract checks one line per call site and impossible to forget.
- **Builders over fixtures for happy paths** — random data exposes hidden coupling and enables parallel-safe runs; fixtures are reserved for deliberately malformed negative-path payloads.
- **Hermetic gating, live canary** — PRs are gated on a containerized API instance (deterministic, always available); the shared public instance is only exercised by the nightly canary, so third-party flakiness can never block a merge.
- **Committed lockfile + `npm ci`** — reproducible dependency trees locally and in CI.

## License

[MIT](LICENSE)
