
import { randomUUID } from 'node:crypto'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import { ValidationError } from 'payload'
import { slugify } from '@/utilities/slugify'
import { createCategoryFixture } from '../fixtures/categories'

import {
  describe,
  it,
  beforeAll,
  afterAll,
  expect,
} from 'vitest'

import { assertTestDatabase } from '../helpers/testEnv'
import { createProjectFixture } from '../fixtures/projects'

let payload: Payload

let fixture: Awaited<
  ReturnType<typeof createProjectFixture>
>

const prefix = `test-project-${randomUUID()}`

describe('Projects Collection', () => {
  beforeAll(async () => {
    assertTestDatabase()

    const { default: config } = await import(
      '@/payload.config'
    )

    payload = await getPayload({ config })

    fixture = await createProjectFixture(
      payload,
      prefix,
    )
  }, 30_000)

  afterAll(async () => {
    if (!payload) return

    assertTestDatabase()

    try {
      // Delete projects first.
      await payload.delete({
        collection: 'projects',
        where: {
          title: {
            contains: prefix,
          },
        },
        overrideAccess: true,
      })

      // Delete dependent media documents.
      await payload.delete({
        collection: 'media',
        where: {
          alt: {
            contains: prefix,
          },
        },
        overrideAccess: true,
      })

      // Delete dependent category documents.
      await payload.delete({
        collection: 'categories',
        where: {
          name: {
            contains: prefix,
          },
        },
        overrideAccess: true,
      })
    } finally {
      await payload.destroy()
    }
  }, 30_000)

  it('creates all required project dependencies', () => {
    expect(fixture.categories.modern.id).toBeDefined()
    expect(fixture.categories.minimalist.id).toBeDefined()
    expect(fixture.categories.layout.id).toBeDefined()
    expect(fixture.categories.projectType.id).toBeDefined()

    expect(fixture.categories.modern.type).toBe(
      'kitchen-style',
    )

    expect(fixture.categories.layout.type).toBe(
      'kitchen-layout',
    )

    expect(fixture.categories.projectType.type).toBe(
      'project-type',
    )

    expect(fixture.media.featuredImage.id).toBeDefined()
    expect(fixture.media.galleryImageOne.id).toBeDefined()
    expect(fixture.media.galleryImageTwo.id).toBeDefined()

    expect(fixture.data.kitchenStyles).toHaveLength(2)
    expect(fixture.data.gallery).toHaveLength(2)

    expect(fixture.data.featuredImage).toBe(
      fixture.media.featuredImage.id,
    )
  })

  describe('Project Creation and Validation', () => {
    it('creates a valid published project', async () => {
      const project = await payload.create({
        collection: 'projects',
        data: {
          ...fixture.data,
          title: `${prefix} Valid Project`,
        },
        draft: false,
        depth: 0,
        overrideAccess: true,
      })

      expect(project.id).toBeDefined()

      expect(project.title).toBe(
        `${prefix} Valid Project`,
      )

      expect(project.excerpt).toBe(
        fixture.data.excerpt,
      )

      expect(project.description).toEqual(
        fixture.data.description,
      )

      expect(project._status).toBe('published')
      expect(project.isFeatured).toBe(true)

      expect(project.featuredImage).toBe(
        fixture.media.featuredImage.id,
      )

      expect(project.createdAt).toBeTruthy()
      expect(project.updatedAt).toBeTruthy()
    })

    it('automatically generates a slug from the title', async () => {
      const title = `${prefix} Café Inspired Kitchen`

      const project = await payload.create({
        collection: 'projects',
        data: {
          ...fixture.data,
          title,
          slug: '',
          isFeatured: undefined,
        },
        draft: false,
        overrideAccess: true,
      })

      expect(project.slug).toBe(slugify(title))

      expect(project.slug).toBe(
        `${prefix}-cafe-inspired-kitchen`,
      )

      expect(project.isFeatured).toBe(false)
    })

    it('rejects a published project without a title', async () => {
      await expect(
        payload.create({
          collection: 'projects',
          data: {
            ...fixture.data,
            title: '',
            slug: `${prefix}-missing-title`,
          },
          draft: false,
          overrideAccess: true,
        }),
      ).rejects.toThrow(ValidationError)
    })

    it('rejects an excerpt longer than 300 characters', async () => {
      await expect(
        payload.create({
          collection: 'projects',
          data: {
            ...fixture.data,
            title: `${prefix} Long Excerpt`,
            excerpt: 'a'.repeat(301),
          },
          draft: false,
          overrideAccess: true,
        }),
      ).rejects.toMatchObject({
        data: {
          errors: expect.arrayContaining([
            expect.objectContaining({
              path: 'excerpt',
            }),
          ]),
        },
      })
    })

    it('rejects duplicate project slugs', async () => {
      const slug = `${prefix}-duplicate-slug`

      await payload.create({
        collection: 'projects',
        data: {
          ...fixture.data,
          title: `${prefix} First Duplicate`,
          slug,
        },
        draft: false,
        overrideAccess: true,
      })

      await expect(
        payload.create({
          collection: 'projects',
          data: {
            ...fixture.data,
            title: `${prefix} Second Duplicate`,
            slug,
          },
          draft: false,
          overrideAccess: true,
        }),
      ).rejects.toThrow(ValidationError)
    })
  })

  describe('Entity Relationships', () => {
    it('returns relationship IDs when depth is zero', async () => {
      const project = await payload.create({
        collection: 'projects',
        data: {
          ...fixture.data,
          title: `${prefix} Relationship IDs`,
        },
        draft: false,
        depth: 0,
        overrideAccess: true,
      })

      expect(project.featuredImage).toBe(
        fixture.media.featuredImage.id,
      )

      expect(project.kitchenStyles).toEqual([
        fixture.categories.modern.id,
        fixture.categories.minimalist.id,
      ])

      expect(project.kitchenLayout).toBe(
        fixture.categories.layout.id,
      )

      expect(project.projectType).toBe(
        fixture.categories.projectType.id,
      )

      expect(project.gallery?.[0]?.image).toBe(
        fixture.media.galleryImageOne.id,
      )

      expect(project.gallery?.[1]?.image).toBe(
        fixture.media.galleryImageTwo.id,
      )
    })

    it('populates related documents when depth is one', async () => {
      const project = await payload.create({
        collection: 'projects',
        data: {
          ...fixture.data,
          title: `${prefix} Populated Relationships`,
        },
        draft: false,
        depth: 0,
        overrideAccess: true,
      })

      const result = await payload.findByID({
        collection: 'projects',
        id: project.id,
        depth: 1,
        overrideAccess: true,
      })

      expect(result.featuredImage).toMatchObject({
        id: fixture.media.featuredImage.id,
        alt: fixture.media.featuredImage.alt,
        mimeType: 'image/jpeg',
      })

      expect(result.kitchenStyles).toEqual([
        expect.objectContaining({
          id: fixture.categories.modern.id,
          type: 'kitchen-style',
        }),
        expect.objectContaining({
          id: fixture.categories.minimalist.id,
          type: 'kitchen-style',
        }),
      ])

      expect(result.kitchenLayout).toMatchObject({
        id: fixture.categories.layout.id,
        type: 'kitchen-layout',
      })

      expect(result.projectType).toMatchObject({
        id: fixture.categories.projectType.id,
        type: 'project-type',
      })

      expect(result.gallery?.[0]?.image).toMatchObject({
        id: fixture.media.galleryImageOne.id,
      })

      expect(result.gallery?.[1]?.image).toMatchObject({
        id: fixture.media.galleryImageTwo.id,
      })
    })

    it('rejects categories with an incorrect relationship type', async () => {
      await expect(
        payload.create({
          collection: 'projects',
          data: {
            ...fixture.data,
            title: `${prefix} Invalid Category Type`,
            kitchenStyles: [
              fixture.categories.layout.id,
            ],
          },
          draft: false,
          overrideAccess: true,
        }),
      ).rejects.toMatchObject({
        data: {
          errors: expect.arrayContaining([
            expect.objectContaining({
              path: 'kitchenStyles',
            }),
          ]),
        },
      })
    })

    it('rejects inactive categories', async () => {
      const inactiveCategory = await createCategoryFixture(
        payload,
        prefix,
        {
          name: 'Inactive Kitchen Style',
          type: 'kitchen-style',
          isActive: false,
        },
      )

      expect(inactiveCategory.isActive).toBe(false)

      await expect(
        payload.create({
          collection: 'projects',
          data: {
            ...fixture.data,
            title: `${prefix} Inactive Category`,
            kitchenStyles: [
              inactiveCategory.id,
            ],
          },
          draft: false,
          overrideAccess: true,
        }),
      ).rejects.toMatchObject({
        data: {
          errors: expect.arrayContaining([
            expect.objectContaining({
              path: 'kitchenStyles',
            }),
          ]),
        },
      })
    })

    it('rejects references to nonexistent categories', async () => {
      const temporaryCategory = await createCategoryFixture(
        payload,
        prefix,
        {
          name: 'Temporary Kitchen Style',
          type: 'kitchen-style',
        },
      )

      await payload.delete({
        collection: 'categories',
        id: temporaryCategory.id,
        overrideAccess: true,
      })

      await expect(
        payload.create({
          collection: 'projects',
          data: {
            ...fixture.data,
            title: `${prefix} Nonexistent Category`,
            kitchenStyles: [
              temporaryCategory.id,
            ],
          },
          draft: false,
          overrideAccess: true,
        }),
      ).rejects.toThrow(ValidationError)
    })
  })

})
