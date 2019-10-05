'use strict'
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

exports.handler = async (event, context) => {
  console.log(event)
  const { content } = event
  const decodedImage = Buffer.from(content, 'base64')

  const result = await s3.upload({
    Body: decodedImage,
    Bucket: process.env.Bucket,
    Key: 'teste.jpg'
  }).promise()

  console.log('Result', result)

  const response = {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*' // Required for CORS support to work
    }
  }

  return response
}
