import { getPayload } from 'payload'
import { assertTestDatabase } from './testEnv'

export const testUser = {
  email: 'test-admin@modukitchen.example',
  password: 'ModuKitchen-Test-Admin-2026',
}

export async function seedTestUser(): Promise<void> {
  assertTestDatabase()

  const { default: config } = await import(
    '../../src/payload.config.js'
  )

  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })

  await payload.create({
    collection: 'users',
    data: testUser,
  })
}

export async function cleanupTestUser(): Promise<void> {
  assertTestDatabase()

  const { default: config } = await import(
    '../../src/payload.config.js'
  )

  const payload = await getPayload({ config })

  try {
    await payload.delete({
      collection: 'users',
      where: {
        email: {
          equals: testUser.email,
        },
      },
    })
  } finally {
    await payload.destroy()
  }
}
