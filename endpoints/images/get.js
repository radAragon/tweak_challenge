'use strict'
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

exports.handler = async (event, context) => {
  console.log('Event', event)
  const { pathParameters: { filename } } = event

  const result = await s3.getObject({
    Bucket: process.env.Bucket,
    Key: filename
  }).promise()

  console.log('Result', result)

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*' // Required for CORS support to work
    },
    body: JSON.stringify({
      image: result.Body.toString('base64')
    })
  }

  console.log('Response', response)
  return response
}