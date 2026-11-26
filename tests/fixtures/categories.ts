
import type { Payload } from 'payload'
import type { Category } from '@/payload-types'

import { assertTestDatabase } from '../helpers/testEnv'

type CategoryFixtureOptions = {
  name: string
  type: Category['type']
  isActive?: boolean
}

export async function createCategoryFixture(
  payload: Payload,
  prefix: string,
  options: CategoryFixtureOptions,
): Promise<Category> {
  assertTestDatabase()

  return payload.create({
    collection: 'categories',
    data: {
      name: `${prefix} ${options.name}`,
      slug: '',
      type: options.type,
      isActive: options.isActive ?? true,
    },
    overrideAccess: true,
  })
}
