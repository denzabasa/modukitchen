# ModuKitchen Training Log

## Lessons 01–07: Development Foundation

Status: Completed

### Accomplishments

- Configured Node.js and pnpm.
- Configured PostgreSQL using Docker Compose.
- Installed Payload CMS with Next.js.
- Established the Tailwind CSS design system.
- Configured TypeScript and ESLint.
- Created an isolated PostgreSQL test database.
- Implemented database safety guards.
- Configured Vitest and Playwright.
- Passed 3 integration tests and 7 E2E tests.
- Verified the production build.
- Configured separate personal SSH credentials.
- Established the GitHub repository.

## Lesson 08: Collections and Content Modelling

Date: 2026-11-25

### Learning Objectives

- Understand Payload's code-first content modelling.
- Define and register custom collections.
- Configure field types and validation.
- Implement collection-level access control.
- Generate TypeScript interfaces.
- Explore REST and Local APIs.
- Write automated collection integration tests.

### Implementation

- Created the Categories collection.
- Configured three category types:
  - Kitchen Style
  - Kitchen Layout
  - Project Type
- Implemented unique, URL-friendly slugs.
- Implemented active and inactive category visibility.
- Created six sample category records.
- Verified REST API filtering, sorting and pagination.
- Inspected the generated PostgreSQL schema.

### Technical Challenges

- TypeScript TS7006: implicit any in validation callback.
- TypeScript TS2345: unknown value passed to regex.

### Solutions

- Explicitly typed the validation input as unknown.
- Implemented type narrowing using typeof.
- Preserved TypeScript strict-mode configuration.

### Testing Results

- Core API integration tests: 3 passed.
- Categories integration tests: 11 passed.
- Total integration tests: 14 passed.
- Integration test duration: 3.76 seconds.

### Key Learnings

- Payload collections are defined using TypeScript.
- REST APIs are generated automatically.
- PostgreSQL schemas reflect collection configurations.
- Local API operations bypass access control by default.
- Access restrictions require overrideAccess: false
  when testing as an anonymous user.
- Automated tests should use isolated databases and
  independent test records.

### Next Lesson

Lesson 09: Payload Hooks and Automatic Slug Generation.