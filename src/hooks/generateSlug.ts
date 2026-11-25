import type { CollectionBeforeValidateHook } from 'payload'

import { slugify } from '../utilities/slugify'

/**
 * Generates a slug from a source field when no slug
 * has been provided.
 *
 * Existing slugs are preserved during updates.
 */
export const generateSlug = (
  sourceField: string = 'name',
  slugField: string = 'slug',
): CollectionBeforeValidateHook => {
  return ({ data, originalDoc, operation }) => {
    if (!data) {
      return data
    }

    const providedSlug = data[slugField]

    // Preserve explicitly provided slugs.
    if (
      typeof providedSlug === 'string' &&
      providedSlug.trim().length > 0
    ) {
      return data
    }

    // Preserve existing slugs during updates.
    if (operation === 'update') {
      const existingSlug = originalDoc?.[slugField]

      if (
        typeof existingSlug === 'string' &&
        existingSlug.length > 0
      ) {
        return {
          ...data,
          [slugField]: existingSlug,
        }
      }
    }

    const sourceValue =
      data[sourceField] ?? originalDoc?.[sourceField]

    if (typeof sourceValue !== 'string') {
      return data
    }

    return {
      ...data,
      [slugField]: slugify(sourceValue),
    }
  }
}