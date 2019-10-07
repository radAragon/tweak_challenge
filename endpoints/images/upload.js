'use strict'
const AWS = require('aws-sdk')
const { success, failure } = require('../lib/response')

exports.handler = async (event, context) => {
  console.log('Event', event)
  console.log('Authorizer', event.requestContext.authorizer)
  const s3 = new AWS.S3()

  try {
    const { body, requestContext: { authorizer: { claims } } } = event
    const { filename, contentType, image } = JSON.parse(body)
    const decodedImage = Buffer.from(image, 'base64')
    const username = claims['cognito:username']
    const Key = `${username}/${filename}`

    const result = await s3.upload({
      Body: decodedImage,
      Bucket: process.env.Bucket,
      Key,
      ContentType: contentType
    }).promise()

    console.log('Result', result)

    return success(undefined, 204)
  } catch (error) {
    return failure(error)
  }
}
