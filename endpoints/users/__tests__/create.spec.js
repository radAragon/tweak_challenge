/* global jest, describe, afterEach, test, expect */
const AWS = require('aws-sdk')
const { handler } = require('../create')

jest.mock('aws-sdk')

describe('Handler users POST', () => {
  const payload = {
    body: JSON.stringify({
      email: 'teste',
      password: 'pass'
    })
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should create new user', async () => {
    const signUp = jest.fn().mockReturnValue({ promise: jest.fn() })
    const adminConfirmSignUp = jest.fn().mockReturnValue({ promise: jest.fn() })

    AWS.CognitoIdentityServiceProvider.mockImplementation(() => ({
      signUp, adminConfirmSignUp
    }))

    const response = await handler(payload)
    expect(signUp).toHaveBeenCalled()
    expect(adminConfirmSignUp).toHaveBeenCalled()
    expect(response.statusCode).toBe(200)
    const expectedBody = { status: 'User created' }
    expect(response.body).toBe(JSON.stringify(expectedBody))
  })

  test('should not create, user already exist', async () => {
    const error = 'User already created'
    const signUp = jest.fn().mockReturnValue({ promise: jest.fn().mockRejectedValue(new Error(error)) })
    const adminConfirmSignUp = jest.fn().mockReturnValue({ promise: jest.fn() })

    AWS.CognitoIdentityServiceProvider.mockImplementation(() => ({
      signUp, adminConfirmSignUp
    }))

    const response = await handler(payload)
    expect(signUp).toHaveBeenCalled()
    expect(adminConfirmSignUp).not.toHaveBeenCalled()
    const expectedBody = { error }
    expect(response.body).toBe(JSON.stringify(expectedBody))
  })
})
