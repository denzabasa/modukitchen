import path from 'node:path'

export function getMediaStoragePath(): string {
  const databaseURL = process.env.DATABASE_URL

  const isTestDatabase =
    databaseURL &&
    new URL(databaseURL).pathname === '/modukitchen_test'

  if (isTestDatabase) {
    return path.resolve(
      process.cwd(),
      'tests',
      '.tmp',
      'media',
    )
  }

  return path.resolve(process.cwd(), 'media')
}