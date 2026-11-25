import { config } from 'dotenv'
import path from 'node:path'

export function assertTestDatabase(): void {
  const databaseURL = process.env.DATABASE_URL

  if (!databaseURL) {
    throw new Error('DATABASE_URL is missing.')
  }

  const url = new URL(databaseURL)

  if (
    url.protocol !== 'postgresql:' ||
    url.hostname !== '127.0.0.1' ||
    url.port !== '5433' ||
    url.pathname !== '/modukitchen_test' ||
    url.search !== ''
  ) {
    throw new Error(
      'Unsafe database connection. Tests must use the local modukitchen_test database.',
    )
  }
}

export function loadTestEnvironment(): void {
  const result = config({
    path: path.resolve(process.cwd(), '.env.test'),
    override: true,
  })

  if (result.error) {
    throw new Error('Unable to load .env.test')
  }

  if (
    !result.parsed?.DATABASE_URL ||
    !result.parsed?.PAYLOAD_SECRET
  ) {
    throw new Error(
      '.env.test must define DATABASE_URL and PAYLOAD_SECRET.',
    )
  }

  assertTestDatabase()
}
