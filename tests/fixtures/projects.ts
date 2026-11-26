
import type { Payload } from 'payload'
import type { Project } from '@/payload-types'

import { assertTestDatabase } from '../helpers/testEnv'
import { createCategoryFixture } from './categories'
import { createTestImage } from './media'
import { createTestRichText } from './richText'

export async function createProjectFixture(
  payload: Payload,
  prefix: string,
) {
  assertTestDatabase()

  // Kitchen style categories.
  const modern = await createCategoryFixture(
    payload,
    prefix,
    {
      name: 'Modern',
      type: 'kitchen-style',
    },
  )

  const minimalist = await createCategoryFixture(
    payload,
    prefix,
    {
      name: 'Minimalist',
      type: 'kitchen-style',
    },
  )

  // Kitchen layout category.
  const layout = await createCategoryFixture(
    payload,
    prefix,
    {
      name: 'L-Shape',
      type: 'kitchen-layout',
    },
  )

  // Project type category.
  const projectType = await createCategoryFixture(
    payload,
    prefix,
    {
      name: 'Residential',
      type: 'project-type',
    },
  )

  // Featured image.
  const featuredImage = await payload.create({
    collection: 'media',
    data: {
      alt: `${prefix}-featured-image`,
    },
    file: await createTestImage(),
    overrideAccess: true,
  })

  // Gallery images.
  const galleryImageOne = await payload.create({
    collection: 'media',
    data: {
      alt: `${prefix}-gallery-image-one`,
    },
    file: await createTestImage(),
    overrideAccess: true,
  })

  const galleryImageTwo = await payload.create({
    collection: 'media',
    data: {
      alt: `${prefix}-gallery-image-two`,
    },
    file: await createTestImage(),
    overrideAccess: true,
  })

  // Default project data.
  const data = {
    title: `${prefix} Modern Kitchen`,
    slug: '',
    excerpt: 'A sample modular kitchen project.',
    description: createTestRichText(
      'A modern modular kitchen featuring oak cabinetry and premium finishes.',
    ),
    featuredImage: featuredImage.id,
    gallery: [
      {
        image: galleryImageOne.id,
        caption: 'Kitchen overview',
      },
      {
        image: galleryImageTwo.id,
        caption: 'Cabinet details',
      },
    ],
    kitchenStyles: [
      modern.id,
      minimalist.id,
    ],
    kitchenLayout: layout.id,
    projectType: projectType.id,
    location: 'Cebu City',
    completionDate: '2026-09-15T00:00:00.000Z',
    isFeatured: true,
    _status: 'published',
  } satisfies Omit<
    Project,
    'id' | 'createdAt' | 'updatedAt'
  >

  return {
    data,
    categories: {
      modern,
      minimalist,
      layout,
      projectType,
    },
    media: {
      featuredImage,
      galleryImageOne,
      galleryImageTwo,
    },
  }
}
