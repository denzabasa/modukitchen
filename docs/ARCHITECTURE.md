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

## Reusable Business Logic

### Utilities

Location: src/utilities

Pure functions that do not depend on Payload CMS
or external services.

Implemented utilities:

- slugify.ts: Converts strings into URL-friendly slugs.

### Hooks

Location: src/hooks

Reusable Payload lifecycle hooks.

Implemented hooks:

- generateSlug.ts: Automatically generates slugs
  from configurable source fields.

### Slug Generation Strategy

- Generate slugs during beforeValidate.
- Generate automatically when no slug is provided.
- Preserve existing slugs during document updates.
- Allow explicit manual slug overrides.
- Reject duplicate slugs within a collection.
- Validate the final slug format.
- Normalize accented Latin characters.
- Use lowercase ASCII letters, numbers and hyphens.

### Automated Testing Strategy

Unit tests:

- Configuration: vitest.unit.config.mts
- Directory: tests/unit
- Environment: Node.js
- No database dependency.

Integration tests:

- Configuration: vitest.config.mts
- Directory: tests/int
- Database: modukitchen_test

End-to-end tests:

- Configuration: playwright.config.ts
- Directory: tests/e2e
- Browser: Chromium

## Projects and Media Architecture

### Projects Collection

The Projects collection manages completed modular kitchen installations and portfolio content.

Key capabilities:

- Automatic slug generation
- Rich text descriptions
- Featured images
- Multiple gallery images
- Kitchen style relationships
- Kitchen layout relationships
- Project type relationships
- Featured project selection
- Drafts and publishing
- Content version history

### Media Collection

The Media collection manages reusable image assets with accessibility metadata, cropping and focal point support.

| Image variant | Dimensions |
|---|---|
| Thumbnail | 400 × 300 |
| Card | 800 × 600 |
| Gallery | 1200px wide, proportional height |
| Hero | 1920 × 1080 |

Images are processed using Sharp, with enlargement disabled.

### Media Storage

- Development: `media/`
- Automated testing: `tests/.tmp/media/`
- Production: Persistent object storage, to be implemented before deployment.

### Content Relationships

Projects reference Categories and Media through Payload relationship and upload fields.

Public project queries must enforce published content access restrictions. Server-side public queries using the Local API must explicitly disable access overrides.