'use strict'
const AWS = require('aws-sdk')
const { success, failure } = require('../lib/response')

exports.handler = async (event, context) => {
  console.log('Event', event)
  console.log('Authorizer', event.requestContext.authorizer)
  const s3 = new AWS.S3()

  try {
    const {
      pathParameters: { filename },
      requestContext: { authorizer: { claims } }
    } = event
    const username = claims['cognito:username']
    const Key = `${username}/${filename}`

    const imageUrl = await s3.getSignedUrlPromise('getObject', {
      Bucket: process.env.Bucket,
      Key,
      Expires: 60
    })

    console.log('Result', imageUrl)

    return success(undefined, 301, { Location: imageUrl })
  } catch (error) {
    return failure(error)
  }
}
