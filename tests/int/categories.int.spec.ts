import { randomUUID } from 'node:crypto'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import {
  describe,
  it,
  beforeAll,
  afterAll,
  expect,
} from 'vitest'

import { assertTestDatabase } from '../helpers/testEnv'

let payload: Payload

const prefix = `test-category-${randomUUID()}`

describe('Categories Collection', () => {
  beforeAll(async () => {
    assertTestDatabase()

    const { default: config } = await import(
      '@/payload.config'
    )

    payload = await getPayload({ config })
  })

  afterAll(async () => {
    if (!payload) return

    assertTestDatabase()

    try {
      await payload.delete({
        collection: 'categories',
        where: {
          slug: {
            contains: prefix,
          },
        },
        overrideAccess: true,
      })
    } finally {
      await payload.destroy()
    }
  })

  it('can create a category', async () => {
    const category = await payload.create({
      collection: 'categories',
      data: {
        name: 'Test Modern',
        slug: `${prefix}-modern`,
        type: 'kitchen-style',
        isActive: true,
      },
    })

    expect(category.id).toBeDefined()
    expect(category.name).toBe('Test Modern')
    expect(category.slug).toBe(`${prefix}-modern`)
    expect(category.type).toBe('kitchen-style')
    expect(category.isActive).toBe(true)
  })

  it('rejects a missing name', async () => {
    await expect(
      payload.create({
        collection: 'categories',
        data: {
          name: '',
          slug: `${prefix}-missing-name`,
          type: 'kitchen-style',
        },
      }),
    ).rejects.toThrow()
  })

  it('rejects an invalid slug', async () => {
    await expect(
      payload.create({
        collection: 'categories',
        data: {
          name: 'Invalid Slug',
          slug: `${prefix}-Invalid Slug`,
          type: 'kitchen-style',
        },
      }),
    ).rejects.toThrow()
  })

  it('rejects duplicate slugs', async () => {
    const slug = `${prefix}-duplicate`

    await payload.create({
      collection: 'categories',
      data: {
        name: 'Original Category',
        slug,
        type: 'kitchen-style',
      },
    })

    await expect(
      payload.create({
        collection: 'categories',
        data: {
          name: 'Duplicate Category',
          slug,
          type: 'project-type',
        },
      }),
    ).rejects.toThrow()
  })

  it('rejects an unsupported category type', async () => {
    await expect(
      payload.create({
        collection: 'categories',
        data: {
          name: 'Invalid Type',
          slug: `${prefix}-invalid-type`,
          // @ts-expect-error Intentionally testing invalid input
          type: 'unsupported-type',
        },
      }),
    ).rejects.toThrow()
  })

  it('defaults isActive to true', async () => {
    const category = await payload.create({
      collection: 'categories',
      data: {
        name: 'Default Active',
        slug: `${prefix}-default-active`,
        type: 'kitchen-style',
      },
    })

    expect(category.isActive).toBe(true)
  })

  it('can filter categories by type', async () => {
    await payload.create({
      collection: 'categories',
      data: {
        name: 'Test Galley',
        slug: `${prefix}-filter-layout`,
        type: 'kitchen-layout',
      },
    })

    await payload.create({
      collection: 'categories',
      data: {
        name: 'Test Residential',
        slug: `${prefix}-filter-project`,
        type: 'project-type',
      },
    })

    const result = await payload.find({
      collection: 'categories',
      where: {
        and: [
          {
            slug: {
              contains: `${prefix}-filter-`,
            },
          },
          {
            type: {
              equals: 'kitchen-layout',
            },
          },
        ],
      },
    })

    expect(result.totalDocs).toBe(1)
    expect(result.docs[0].type).toBe('kitchen-layout')
  })

  it('hides inactive categories from anonymous users', async () => {
    const active = await payload.create({
      collection: 'categories',
      data: {
        name: 'Public Category',
        slug: `${prefix}-access-active`,
        type: 'kitchen-style',
        isActive: true,
      },
    })

    const inactive = await payload.create({
      collection: 'categories',
      data: {
        name: 'Hidden Category',
        slug: `${prefix}-access-inactive`,
        type: 'kitchen-style',
        isActive: false,
      },
    })

    const result = await payload.find({
      collection: 'categories',
      overrideAccess: false,
      where: {
        id: {
          in: [active.id, inactive.id],
        },
      },
    })

    expect(result.totalDocs).toBe(1)
    expect(result.docs[0].id).toBe(active.id)
  })

  it('prevents anonymous users from creating categories', async () => {
    await expect(
      payload.create({
        collection: 'categories',
        overrideAccess: false,
        data: {
          name: 'Unauthorised Category',
          slug: `${prefix}-unauthorised`,
          type: 'kitchen-style',
        },
      }),
    ).rejects.toThrow()
  })

  it('can update a category', async () => {
    const category = await payload.create({
      collection: 'categories',
      data: {
        name: 'Before Update',
        slug: `${prefix}-update`,
        type: 'kitchen-style',
      },
    })

    const updated = await payload.update({
      collection: 'categories',
      id: category.id,
      data: {
        name: 'After Update',
        isActive: false,
      },
    })

    expect(updated.name).toBe('After Update')
    expect(updated.isActive).toBe(false)
  })

  it('can delete a category', async () => {
    const category = await payload.create({
      collection: 'categories',
      data: {
        name: 'Category to Delete',
        slug: `${prefix}-delete`,
        type: 'project-type',
      },
    })

    await payload.delete({
      collection: 'categories',
      id: category.id,
    })

    const result = await payload.find({
      collection: 'categories',
      where: {
        id: {
          equals: category.id,
        },
      },
    })

    expect(result.totalDocs).toBe(0)
  })
})