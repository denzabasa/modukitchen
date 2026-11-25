import { describe, expect, it } from 'vitest'

import { slugify } from '@/utilities/slugify'

describe('slugify', () => {
  it('converts uppercase characters to lowercase', () => {
    expect(slugify('MODERN')).toBe('modern')
  })

  it('replaces spaces with hyphens', () => {
    expect(slugify('Modern Kitchen')).toBe('modern-kitchen')
  })

  it('removes leading and trailing whitespace', () => {
    expect(slugify('  Modern Kitchen  ')).toBe('modern-kitchen')
  })

  it('handles multiple consecutive spaces', () => {
    expect(slugify('Modern   Luxury   Kitchen')).toBe(
      'modern-luxury-kitchen',
    )
  })

  it('removes accents from characters', () => {
    expect(slugify('Café Inspired Kitchen')).toBe(
      'cafe-inspired-kitchen',
    )
  })

  it('handles special characters', () => {
    expect(slugify('Kitchen & Dining')).toBe('kitchen-dining')
  })

  it('handles underscores', () => {
    expect(slugify('modern_kitchen')).toBe('modern-kitchen')
  })

  it('collapses multiple hyphens', () => {
    expect(slugify('modern---kitchen')).toBe('modern-kitchen')
  })

  it('removes leading and trailing hyphens', () => {
    expect(slugify('--modern-kitchen--')).toBe('modern-kitchen')
  })

  it('preserves numbers', () => {
    expect(slugify('Kitchen Design 2026')).toBe(
      'kitchen-design-2026',
    )
  })

  it('preserves an already valid slug', () => {
    expect(slugify('modern-kitchen')).toBe('modern-kitchen')
  })

  it('returns an empty string for empty input', () => {
    expect(slugify('')).toBe('')
  })

  it('returns an empty string for whitespace-only input', () => {
    expect(slugify('   ')).toBe('')
  })

  it('returns an empty string for symbols-only input', () => {
    expect(slugify('!@#$%^&*')).toBe('')
  })

  it('handles combined transformations', () => {
    expect(slugify('  Café & MODERN Kitchen 2026!  ')).toBe(
      'cafe-modern-kitchen-2026',
    )
  })
})