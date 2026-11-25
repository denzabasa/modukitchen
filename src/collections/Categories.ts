import type { CollectionConfig } from 'payload'
import { generateSlug } from '../hooks/generateSlug'

export const Categories: CollectionConfig = {
  slug: 'categories',

  labels: {
    singular: 'Category',
    plural: 'Categories',
  },

  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: [
      'name',
      'type',
      'isActive',
      'updatedAt',
    ],
  },

  access: {
    read: ({ req: { user } }) => {
      if (user) {
        return true
      }

      return {
        isActive: {
          equals: true,
        },
      }
    },

    create: ({ req: { user } }) => Boolean(user),

    update: ({ req: { user } }) => Boolean(user),

    delete: ({ req: { user } }) => Boolean(user),
  },

  hooks: {
    beforeValidate: [
      generateSlug('name'),
    ],
  },

  fields: [
    {
      name: 'name',
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
        description:
          'Automatically generated from the name if left empty. You may also enter a custom slug.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Kitchen Style',
          value: 'kitchen-style',
        },
        {
          label: 'Kitchen Layout',
          value: 'kitchen-layout',
        },
        {
          label: 'Project Type',
          value: 'project-type',
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],

  timestamps: true,
}
