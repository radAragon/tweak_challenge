/* global jest, describe, afterEach, test, expect */
const AWS = require('aws-sdk')
const { handler } = require('../getImage')

jest.mock('aws-sdk')

describe('Handler images/{filename} GET', () => {
  const username = 'testeman'
  const filename = 'ducati.jpg'
  const payload = {
    pathParameters: {
      filename
    },
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

  test('should redirect to signed url from S3', async () => {
    const imageUrl = 'host/image?signed'
    const getSignedUrlPromise = jest.fn().mockResolvedValue(imageUrl)

    AWS.S3.mockImplementation(() => ({
      getSignedUrlPromise
    }))

    const response = await handler(payload)
    expect(getSignedUrlPromise).toHaveBeenCalled()
    expect(getSignedUrlPromise.mock.calls[0][1].Key).toBe(`${username}/${filename}`)
    expect(response.statusCode).toBe(301)
    expect(response.headers.Location).toBe(imageUrl)
  })

  test('should not find image and return 404', async () => {
    const error = new Error('File not found')
    error.statusCode = 404
    const getSignedUrlPromise = jest.fn().mockRejectedValue(error)

    AWS.S3.mockImplementation(() => ({
      getSignedUrlPromise
    }))

    const response = await handler(payload)
    expect(getSignedUrlPromise).toHaveBeenCalled()
    expect(response.statusCode).toBe(404)
    const expectedBody = { error: error.message }
    expect(response.body).toBe(JSON.stringify(expectedBody))
  })
})
