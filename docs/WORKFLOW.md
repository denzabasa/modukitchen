# Development Workflow

## Start Development

docker compose up -d
pnpm dev

## Quality Checks

pnpm check

## Generate Payload Types

pnpm generate:types

## Integration Testing

pnpm test:int

## End-to-End Testing

Stop the regular Next.js development server before
running Playwright.

pnpm test:e2e

## Run All Tests

pnpm test

## Production Build

pnpm build

## Database Safety

- Never execute automated tests against the
  development or production database.
- Use the isolated modukitchen_test database.
- Validate the database connection before testing.
- Clean up temporary test records.
- Never commit environment files or credentials.

## Git Workflow

- Complete one or two training lessons.
- Run quality checks and relevant tests.
- Update project documentation.
- Review staged changes.
- Commit using Conventional Commits.
- Push changes to GitHub.

## Commit Conventions

- feat: New functionality
- fix: Bug fixes
- docs: Documentation
- test: Automated tests
- refactor: Code restructuring
- chore: Maintenance

## Definition of Done

- Implementation completed.
- TypeScript checks passed.
- ESLint checks passed.
- Relevant automated tests passed.
- Documentation updated.
- Changes committed and pushed.

## Unit Testing

pnpm test:unit

Unit tests do not require PostgreSQL or a running
Next.js development server.

## Unit Testing Watch Mode

pnpm test:unit:watch

Automatically reruns unit tests when source files
or test files change.

## Complete Testing Pipeline

pnpm test

Execution order:

1. Unit tests
2. Integration tests
3. End-to-end tests

The pipeline stops when any testing stage fails.