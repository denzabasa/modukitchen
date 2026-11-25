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

describe('Payload Local API', () => {
  beforeAll(async () => {
    assertTestDatabase()

    const { default: config } = await import('@/payload.config')

    payload = await getPayload({ config })
  })

  afterAll(async () => {
    if (payload) {
      await payload.destroy()
    }
  })

  it('uses the isolated test database', () => {
    expect(
      new URL(process.env.DATABASE_URL ?? '').pathname,
    ).toBe('/modukitchen_test')
  })

  it('can fetch users', async () => {
    const users = await payload.find({
      collection: 'users',
    })

    expect(users.docs).toBeInstanceOf(Array)
    expect(users.totalDocs).toBeGreaterThanOrEqual(0)
  })

  it('can fetch media', async () => {
    const media = await payload.find({
      collection: 'media',
    })

    expect(media.docs).toBeInstanceOf(Array)
    expect(media.totalDocs).toBeGreaterThanOrEqual(0)
  })
})
