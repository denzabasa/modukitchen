import type { CollectionConfig } from 'payload'
import { getMediaStoragePath } from '../utilities/getMediaStoragePath'

export const Media: CollectionConfig = {
  slug: 'media',

  admin: {
    group: 'Content',
    useAsTitle: 'filename',
    defaultColumns: [
      'filename',
      'alt',
      'mimeType',
      'updatedAt',
    ],
  },

  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe the image for accessibility and screen readers.',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      admin: {
        description:
          'Optional caption displayed alongside the image.',
      },
    },
  ],

  upload: {
    staticDir: getMediaStoragePath(),
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
    ],

    adminThumbnail: 'thumbnail',

    focalPoint: true,

    crop: true,

    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        fit: 'cover',
        withoutEnlargement: true,
      },
      {
        name: 'card',
        width: 800,
        height: 600,
        fit: 'cover',
        withoutEnlargement: true,
      },
      {
        name: 'gallery',
        width: 1200,
        withoutEnlargement: true,
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        fit: 'cover',
        withoutEnlargement: true,
      },
    ],
  },

  timestamps: true,
}