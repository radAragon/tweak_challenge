/* global jest, describe, afterEach, test, expect */
const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
const { handler } = require('../login')

jest.mock('amazon-cognito-identity-js')

describe('Handler users/login POST', () => {
  const payload = {
    body: JSON.stringify({
      email: 'teste',
      password: 'pass'
    })
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should login existent user', async () => {
    const accessToken = 'jwt'
    const getJwtToken = jest.fn().mockReturnValue(accessToken)
    const authenticateUser = jest.fn().mockImplementation((param1, param2) => {
      return param2.onSuccess({
        getIdToken: () => ({
          getJwtToken
        })
      })
    })

    AmazonCognitoIdentity.CognitoUser.mockImplementation(() => ({
      authenticateUser
    }))

    const response = await handler(payload)
    expect(authenticateUser).toHaveBeenCalled()
    expect(getJwtToken).toHaveBeenCalled()
    expect(response.statusCode).toBe(200)
    const expectedBody = { accessToken }
    expect(response.body).toBe(JSON.stringify(expectedBody))
  })

  test('should not login, user doesn\'t exist', async () => {
    const error = new Error('User doesn\'t exist')
    error.statusCode = 400

    const authenticateUser = jest.fn().mockImplementation((param1, param2) => {
      return param2.onFailure(error)
    })

    AmazonCognitoIdentity.CognitoUser.mockImplementation(() => ({
      authenticateUser
    }))

    const response = await handler(payload)
    expect(authenticateUser).toHaveBeenCalled()
    expect(response.statusCode).toBe(400)
    const expectedBody = { error: error.message }
    expect(response.body).toBe(JSON.stringify(expectedBody))
  })
})
