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

## Lesson 09: Payload Hooks and Automatic Slug Generation

### Learning Objectives

- Understand Payload document lifecycle hooks.
- Differentiate collection-level and field-level hooks.
- Implement reusable utility functions.
- Implement reusable higher-order hook functions.
- Understand unit testing and the testing pyramid.
- Understand the Arrange, Act, Assert testing pattern.

### Implementation

- Created src/utilities/slugify.ts.
- Created src/hooks/generateSlug.ts.
- Registered the beforeValidate hook in Categories.
- Implemented automatic slug generation.
- Preserved existing slugs during document updates.
- Supported manual slug overrides.
- Preserved slug format validation and uniqueness.

### Unit Testing

- Created vitest.unit.config.mts.
- Configured database-independent unit testing.
- Added test:unit and test:unit:watch scripts.
- Updated the main test command.
- Implemented 15 slug utility unit tests.

### Integration Testing

- Extended the Categories integration test suite.
- Added 8 automatic slug generation tests.
- Verified slug generation and persistence.
- Verified manual slug overrides.
- Verified duplicate slug rejection.
- Verified invalid generated slug rejection.

### Technical Challenges

#### TS2345 and TS2578

Payload's Local API requires a slug during normal
document creation at the TypeScript level.

Resolved by placing @ts-expect-error above the
payload.create() call in the intentional missing
slug test.

#### ESLint no-unused-expressions

An accidental trailing comma after the afterAll()
function introduced a JavaScript comma expression.

Resolved by removing the trailing comma.

### Testing Results

- Unit tests: 15 passed.
- Integration tests: 22 passed.
- TypeScript: No errors.
- ESLint: No errors or warnings.

### Key Learnings

- beforeValidate can populate fields before validation.
- Higher-order functions enable reusable hooks.
- Generated TypeScript types and runtime behaviour
  can have different input requirements.
- Existing slugs should be preserved to maintain URLs.
- Unit tests should not depend on external services.
- Integration tests verify connected system behaviour.

### Next Lesson

Lesson 10: Projects Collection and Entity Relationships.