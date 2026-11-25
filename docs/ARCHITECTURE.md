# ModuKitchen Architecture

## Application Architecture

ModuKitchen uses a unified Next.js and Payload CMS
application backed by PostgreSQL.

## Technology Stack

- Payload CMS
- Next.js App Router
- React
- TypeScript
- PostgreSQL
- Tailwind CSS
- Docker Compose
- Vitest
- Playwright
- pnpm

## Application Layers

### Frontend

Location: src/app/(frontend)

Responsible for public-facing pages, layouts,
components and customer interactions.

### CMS and API

Location: src/app/(payload)

Responsible for content administration, authentication,
REST APIs and GraphQL APIs.

### Content Model

Location: src/collections

Collections are defined using TypeScript and registered
in src/payload.config.ts.

### Database

PostgreSQL runs locally through Docker Compose.

- Development database: modukitchen
- Testing database: modukitchen_test

### Testing

Location: tests/

Integration tests use Vitest and the Payload Local API.
End-to-end tests use Playwright and Chromium.

## Implemented Collections

### Users

Responsible for authentication and CMS administration.

### Media

Responsible for uploaded media assets.

### Categories

Responsible for classifying kitchen designs and projects.

Fields:

- name
- slug
- description
- type
- isActive
- createdAt
- updatedAt

Category types:

- kitchen-style
- kitchen-layout
- project-type

Slugs are globally unique.

Anonymous users can only read active categories.
Authenticated users can manage categories.

Granular role-based permissions will be implemented
before production deployment.

## Architectural Principles

- Code-first configuration
- Type-safe development
- Separation of concerns
- Reusable components
- Isolated testing environments
- Incremental development
- Version-controlled content models