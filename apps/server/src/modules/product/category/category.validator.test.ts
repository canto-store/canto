import { describe, expect, test, mock } from 'bun:test'
import { CategoryValidator } from './category.validator'
import { Request, Response } from 'express'
import AppError from '../../../utils/appError'

const mockResponse = () => ({}) as Response

const mockNext = () => mock(() => {})

describe('CategoryValidator', () => {
  describe('validateCreate', () => {
    test('passes validation with valid data', () => {
      const req = {
        body: {
          name: 'Electronics',
          aspect: 'SQUARE',
        },
      } as Request

      const res = mockResponse()
      const next = mockNext()

      CategoryValidator.validateCreate(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(req.body).toEqual({
        name: 'Electronics',
        aspect: 'SQUARE',
      })
    })

    test('passes validation with all optional fields', () => {
      const req = {
        body: {
          name: 'Electronics',
          aspect: 'RECTANGLE',
          description: 'Electronic devices',
          image: 'https://example.com/image.jpg',
          parentId: 1,
          coming_soon: true,
        },
      } as Request

      const res = mockResponse()
      const next = mockNext()

      CategoryValidator.validateCreate(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(req.body).toEqual({
        name: 'Electronics',
        aspect: 'RECTANGLE',
        description: 'Electronic devices',
        image: 'https://example.com/image.jpg',
        parentId: 1,
        coming_soon: true,
      })
    })

    test('throws AppError when name is missing', () => {
      const req = {
        body: {
          aspect: 'SQUARE',
        },
      } as Request

      const res = mockResponse()
      const next = mockNext()

      expect(() => CategoryValidator.validateCreate(req, res, next)).toThrow(
        AppError
      )
      expect(next).not.toHaveBeenCalled()
    })

    test('throws AppError when name is empty', () => {
      const req = {
        body: {
          name: '',
          aspect: 'SQUARE',
        },
      } as Request

      const res = mockResponse()
      const next = mockNext()

      expect(() => CategoryValidator.validateCreate(req, res, next)).toThrow(
        AppError
      )
      expect(next).not.toHaveBeenCalled()
    })

    test('throws AppError when aspect is missing', () => {
      const req = {
        body: {
          name: 'Electronics',
        },
      } as Request

      const res = mockResponse()
      const next = mockNext()

      expect(() => CategoryValidator.validateCreate(req, res, next)).toThrow(
        AppError
      )
      expect(next).not.toHaveBeenCalled()
    })

    test('throws AppError when aspect is invalid', () => {
      const req = {
        body: {
          name: 'Electronics',
          aspect: 'INVALID',
        },
      } as Request

      const res = mockResponse()
      const next = mockNext()

      expect(() => CategoryValidator.validateCreate(req, res, next)).toThrow(
        AppError
      )
      expect(next).not.toHaveBeenCalled()
    })

    test('error has status code 400', () => {
      const req = {
        body: {},
      } as Request

      const res = mockResponse()
      const next = mockNext()

      try {
        CategoryValidator.validateCreate(req, res, next)
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
        expect((error as AppError).statusCode).toBe(400)
      }
    })
  })

  describe('validateUpdate', () => {
    test('passes validation with valid partial data', () => {
      const req = {
        body: {
          id: 1,
          name: 'Updated Electronics',
        },
      } as unknown as Request

      const res = mockResponse()
      const next = mockNext()

      CategoryValidator.validateUpdate(req, res, next)

      expect(next).toHaveBeenCalled()
    })

    test('passes validation with only aspect', () => {
      const req = {
        body: {
          id: 1,
          aspect: 'RECTANGLE',
        },
      } as unknown as Request

      const res = mockResponse()
      const next = mockNext()

      CategoryValidator.validateUpdate(req, res, next)

      expect(next).toHaveBeenCalled()
    })

    test('passes validation with empty body (only id from params)', () => {
      const req = {
        body: {
          id: 3,
        },
      } as unknown as Request

      const res = mockResponse()
      const next = mockNext()

      CategoryValidator.validateUpdate(req, res, next)

      expect(next).toHaveBeenCalled()
    })

    test('throws AppError when aspect is invalid', () => {
      const req = {
        body: {
          aspect: 'INVALID',
          id: 1,
        },
      } as unknown as Request

      const res = mockResponse()
      const next = mockNext()

      expect(() => CategoryValidator.validateUpdate(req, res, next)).toThrow(
        AppError
      )
      expect(next).not.toHaveBeenCalled()
    })

    test('throws AppError when id is not a valid number', () => {
      const req = {
        body: {
          name: 'Test',
          id: 'invalid',
        },
      } as unknown as Request

      const res = mockResponse()
      const next = mockNext()

      expect(() => CategoryValidator.validateUpdate(req, res, next)).toThrow(
        AppError
      )
      expect(next).not.toHaveBeenCalled()
    })
  })
})
