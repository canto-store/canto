import { describe, expect, test } from 'bun:test'
import { slugify } from './helper'

describe('slugify', () => {
  test('converts text to lowercase', () => {
    const result = slugify('HELLO WORLD')
    expect(result).toMatch(/^hello-world-[a-z0-9]{6}$/i)
  })

  test('replaces spaces with hyphens', () => {
    const result = slugify('hello world test')
    expect(result).toMatch(/^hello-world-test-[a-z0-9_-]{6}$/i)
  })

  test('replaces & with -and-', () => {
    const result = slugify('bread & butter')
    expect(result).toMatch(/^bread-and-butter-[a-z0-9_-]{6}$/i)
  })

  test('removes special characters', () => {
    const result = slugify('hello@world!test#123')
    expect(result).toMatch(/^helloworld/)
  })

  test('replaces multiple hyphens with single hyphen', () => {
    const result = slugify('hello   world')
    expect(result).toMatch(/^hello-world-[a-z0-9_-]{6}$/i)
  })

  test('trims hyphens from start and end', () => {
    const result = slugify('  hello world  ')
    expect(result).toMatch(/^hello-world-[a-z0-9_-]{6}$/i)
    expect(result).not.toMatch(/^-/)
  })

  test('appends a 6-character unique identifier', () => {
    const result = slugify('test')
    const parts = result.split('-')
    expect(parts[1]).toHaveLength(6)
  })

  test('generates unique slugs for same input', () => {
    const result1 = slugify('hello world')
    const result2 = slugify('hello world')
    expect(result1).not.toBe(result2)
  })

  test('handles empty string', () => {
    expect(() => slugify('')).toThrowError('Input text cannot be empty')
  })

  test('handles string with only special characters', () => {
    const result = slugify('!@#$%^&*()')
    expect(result).toMatch(/and-[a-z0-9_-]{6}$/i)
  })
})
