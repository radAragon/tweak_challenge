/* global jest, describe, afterEach, test, expect */
const AWS = require('aws-sdk')
const { handler } = require('../upload')
const body = require('./payload')

jest.mock('aws-sdk')

describe('Handler images POST', () => {
  const username = 'testeman'
  const payload = {
    body: JSON.stringify(body),
    requestContext: {
      authorizer: {
        claims: {
          'cognito:username': username
        }
      }
    }
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should upload file to S3', async () => {
    const upload = jest.fn().mockReturnValue({ promise: jest.fn() })

    AWS.S3.mockImplementation(() => ({
      upload
    }))

    const response = await handler(payload)
    expect(upload).toHaveBeenCalled()
    expect(upload.mock.calls[0][0].Key).toBe(`${username}/${body.filename}`)
    expect(response.statusCode).toBe(204)
    expect(response.body).toBeUndefined()
  })

  test('should not upload file due to S3 error', async () => {
    const error = new Error('User already created')
    error.statusCode = 500
    const upload = jest.fn().mockReturnValue({ promise: jest.fn().mockRejectedValue(error) })

    AWS.S3.mockImplementation(() => ({
      upload
    }))

    const response = await handler(payload)
    expect(upload).toHaveBeenCalled()
    expect(response.statusCode).toBe(500)
    const expectedBody = { error: error.message }
    expect(response.body).toBe(JSON.stringify(expectedBody))
  })
})
