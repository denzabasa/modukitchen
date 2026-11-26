import type { CollectionConfig } from 'payload'

import { generateSlug } from '../hooks/generateSlug'

export const Projects: CollectionConfig = {
  slug: 'projects',

  labels: {
    singular: 'Project',
    plural: 'Projects',
  },

  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'kitchenLayout',
      'isFeatured',
      '_status',
      'updatedAt',
    ],
  },

  access: {
    read: ({ req: { user } }) => {
      if (user) return true

      return {
        _status: {
          equals: 'published',
        },
      }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },

  hooks: {
    beforeValidate: [generateSlug('title')],
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: (value: unknown) => {
        if (typeof value !== 'string') {
          return 'Slug must be a string.'
        }

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
          return 'Use lowercase letters, numbers and hyphens only.'
        }

        return true
      },
      admin: {
        position: 'sidebar',
        description:
          'Automatically generated from the title if left empty.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 300,
      admin: {
        description:
          'A short summary displayed on project listing cards.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'Primary image used on project cards and detail pages.',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      labels: {
        singular: 'Gallery Image',
        plural: 'Gallery Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'kitchenStyles',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
      filterOptions: {
        type: {
          equals: 'kitchen-style',
        },
        isActive: {
          equals: true,
        },
      },
    },
    {
      name: 'kitchenLayout',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      filterOptions: {
        type: {
          equals: 'kitchen-layout',
        },
        isActive: {
          equals: true,
        },
      },
    },
    {
      name: 'projectType',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      filterOptions: {
        type: {
          equals: 'project-type',
        },
        isActive: {
          equals: true,
        },
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'City or general location of the project.',
      },
    },
    {
      name: 'completionDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd MMM yyyy',
        },
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Feature this project in selected areas of the website.',
      },
    },
  ],

  versions: {
    drafts: true,
    maxPerDoc: 20,
  },

  timestamps: true,
}