'use strict'
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

exports.handler = async (event, context) => {
  console.log('Event', event)
  try {
    const { pathParameters: { filename } } = event

    const imageUrl = await s3.getSignedUrlPromise('getObject', {
      Bucket: process.env.Bucket,
      Key: filename,
      Expires: 60
    })

    console.log('Result', imageUrl)

    const response = {
      statusCode: 301,
      headers: {
        Location: imageUrl
      }
    }

    console.log('Response', response)
    return response
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*' // Required for CORS support to work
      },
      body: JSON.stringify({
        error: error.message
      })
    }
  }
}
