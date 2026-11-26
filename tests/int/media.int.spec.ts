
import path from 'node:path'
import { existsSync } from 'node:fs'
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
import { createTestImage } from '../fixtures/media'
import { getMediaStoragePath } from '@/utilities/getMediaStoragePath'

let payload: Payload

const prefix = `test-media-${randomUUID()}`

const storagePath = path.resolve(
  process.cwd(),
  'tests',
  '.tmp',
  'media',
)

describe('Media Collection', () => {
  beforeAll(async () => {
    assertTestDatabase()

    // Verify filesystem isolation before initializing Payload.
    expect(getMediaStoragePath()).toBe(storagePath)

    const { default: config } = await import('@/payload.config')

    payload = await getPayload({ config })
  })

  afterAll(async () => {
    if (!payload) return

    assertTestDatabase()

    try {
      await payload.delete({
        collection: 'media',
        where: {
          alt: {
            contains: prefix,
          },
        },
        overrideAccess: true,
      })
    } finally {
      await payload.destroy()
    }
  })

  it('uploads a valid JPEG image', async () => {
    const file = await createTestImage()

    const media = await payload.create({
      collection: 'media',
      data: {
        alt: `${prefix}-valid-image`,
        caption: 'A sample modular kitchen image.',
      },
      file,
      overrideAccess: true,
    })

    expect(media.id).toBeDefined()
    expect(media.alt).toBe(`${prefix}-valid-image`)
    expect(media.mimeType).toBe('image/jpeg')
    expect(media.filename).toBeDefined()
    expect(media.width).toBe(2400)
    expect(media.height).toBe(1600)
    expect(media.url).toBeTruthy()

    expect(
      existsSync(
        path.join(storagePath, media.filename!),
      ),
    ).toBe(true)
  })

  it('generates all configured image variants', async () => {
    const file = await createTestImage()

    const media = await payload.create({
      collection: 'media',
      data: {
        alt: `${prefix}-image-variants`,
      },
      file,
      overrideAccess: true,
    })

    const sizes = media.sizes

    expect(sizes?.thumbnail?.width).toBe(400)
    expect(sizes?.thumbnail?.height).toBe(300)

    expect(sizes?.card?.width).toBe(800)
    expect(sizes?.card?.height).toBe(600)

    expect(sizes?.gallery?.width).toBe(1200)
    expect(sizes?.gallery?.height).toBe(800)

    expect(sizes?.hero?.width).toBe(1920)
    expect(sizes?.hero?.height).toBe(1080)

    const variants = [
      sizes?.thumbnail,
      sizes?.card,
      sizes?.gallery,
      sizes?.hero,
    ]

    for (const variant of variants) {
      expect(variant?.filename).toBeTruthy()
      expect(variant?.url).toBeTruthy()

      expect(
        existsSync(
          path.join(storagePath, variant!.filename!),
        ),
      ).toBe(true)
    }
  })

  it('rejects uploads without alt text', async () => {
    const file = await createTestImage()

    await expect(
      payload.create({
        collection: 'media',
        data: {
          alt: '',
        },
        file,
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })

  it('rejects unsupported file types', async () => {
    const data = Buffer.from(
      'This is not a supported image.',
    )

    await expect(
      payload.create({
        collection: 'media',
        data: {
          alt: `${prefix}-unsupported-file`,
        },
        file: {
          data,
          name: `${prefix}.txt`,
          mimetype: 'text/plain',
          size: data.length,
        },
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })

  it('allows anonymous reads but denies anonymous uploads', async () => {
    const file = await createTestImage()

    const media = await payload.create({
      collection: 'media',
      data: {
        alt: `${prefix}-public-image`,
      },
      file,
      overrideAccess: true,
    })

    const result = await payload.findByID({
      collection: 'media',
      id: media.id,
      overrideAccess: false,
    })

    expect(result.id).toBe(media.id)

    const anonymousFile = await createTestImage()

    await expect(
      payload.create({
        collection: 'media',
        data: {
          alt: `${prefix}-anonymous-upload`,
        },
        file: anonymousFile,
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })
})
