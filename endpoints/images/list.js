'use strict'
const AWS = require('aws-sdk')
const { success, failure } = require('../lib/response')
const s3 = new AWS.S3()

exports.handler = async (event, context) => {
  console.log('Event', event)
  console.log('Authorizer', event.requestContext.authorizer)

  try {
    const {
      headers: { Host },
      requestContext: {
        authorizer: { claims },
        path
      }
    } = event
    const username = claims['cognito:username']

    const result = await s3.listObjectsV2({
      Bucket: process.env.Bucket,
      Prefix: username
    }).promise()

    console.log('Result', result)

    const imagesList = result.Contents.map(object => {
      const filename = object.Key.split(`${username}/`)[1]
      const link = `https://${Host}${path}/${filename}`
      return { filename, link }
    })

    return success(imagesList)
  } catch (error) {
    return failure(error)
  }
}
