'use strict'
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

exports.handler = async (event, context) => {
  console.log('Event', event)
  const { body } = event
  const { filename, image } = JSON.parse(body)
  const decodedImage = Buffer.from(image, 'base64')

  const result = await s3.upload({
    Body: decodedImage,
    Bucket: process.env.Bucket,
    Key: filename,
    ContentType: 'image/jpg'
  }).promise()

  console.log('Result', result)

  const response = {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*' // Required for CORS support to work
    }
  }

  console.log('Response', response)
  return response
}
