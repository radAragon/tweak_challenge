'use strict'
const AWS = require('aws-sdk')
const { success, failure } = require('../lib/response')
const s3 = new AWS.S3()

exports.handler = async (event, context) => {
  console.log('Event', event)
  try {
    const { body } = event
    const { filename, contentType, image } = JSON.parse(body)
    const decodedImage = Buffer.from(image, 'base64')

    const result = await s3.upload({
      Body: decodedImage,
      Bucket: process.env.Bucket,
      Key: filename,
      ContentType: contentType
    }).promise()

    console.log('Result', result)

    return success(undefined, 204)
  } catch (error) {
    return failure(error)
  }
}
