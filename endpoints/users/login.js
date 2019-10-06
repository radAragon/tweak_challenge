'use strict'
global.fetch = require('node-fetch')
const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
const { success, failure } = require('../lib/response')

exports.handler = async (event, context) => {
  console.log('Event', event)
  try {
    const { body } = event
    const { email, password } = JSON.parse(body)

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: email,
      Password: password
    })

    const userPool = new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: process.env.PoolId,
      ClientId: process.env.ClientId
    })

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: email,
      Pool: userPool
    })

    const result = await new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: resolve,
        onFailure: reject
      })
    })
    console.log('Result', result)

    const accessToken = result.getIdToken().getJwtToken()

    return success({
      accessToken
    })
  } catch (error) {
    return failure(error)
  }
}
