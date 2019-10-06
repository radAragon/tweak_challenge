'use strict'
global.fetch = require('node-fetch')
const AWS = require('aws-sdk')
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
      UserPoolId: process.env.UserPoolId,
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
    console.log('Authenticate result', result)

    const accessToken = result.getIdToken().getJwtToken()

    const credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: process.env.IdentityPoolId,
      Logins: {
        [`cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.UserPoolId}`]: accessToken
      }
    })

    const refreshResult = await new Promise((resolve, reject) =>
      credentials.refresh(err => err ? reject(err) : resolve()))
    console.log('Refresh result', refreshResult)

    return success({
      accessToken
    })
  } catch (error) {
    return failure(error)
  }
}
