import { describe, expect, test } from 'bun:test'
import { slugify } from './helper'

describe('slugify', () => {
  test('converts text to lowercase', () => {
    const result = slugify('HELLO WORLD')
    expect(result).toStartWith('hello-world-')
  })

  test('replaces spaces with hyphens', () => {
    const result = slugify('hello world test')
    expect(result).toStartWith('hello-world-test-')
  })

  test('replaces & with -and-', () => {
    const result = slugify('bread & butter')
    expect(result).toStartWith('bread-and-butter-')
  })

  test('removes special characters', () => {
    const result = slugify('hello@world!test#123')
    expect(result).toStartWith('helloworld')
  })

  test('trims spaces from start and end', () => {
    const result = slugify('  hello world  ')
    expect(result).toStartWith('hello-world-')
  })

  test('generates unique slugs for same input', () => {
    const result1 = slugify('hello world')
    const result2 = slugify('hello world')
    expect(result1).not.toBe(result2)
  })
})
