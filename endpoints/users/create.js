'use strict'
const AWS = require('aws-sdk')
const { success, failure } = require('../lib/response')

exports.handler = async (event, context) => {
  console.log('Event', event)
  const cognitoISP = new AWS.CognitoIdentityServiceProvider()

  try {
    const { body } = event
    const { email, password } = JSON.parse(body)

    await cognitoISP.signUp({
      ClientId: process.env.ClientId,
      Password: password,
      Username: email
    }).promise()

    await cognitoISP.adminConfirmSignUp({
      UserPoolId: process.env.PoolId,
      Username: email
    }).promise()

    return success({
      status: 'User created'
    })
  } catch (error) {
    return failure(error)
  }
}
