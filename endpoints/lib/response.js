exports.success = (body, statusCode = 200, headers) => {
  console.log('Success', { statusCode, body })
  return buildResponse(body, statusCode, headers)
}

exports.failure = (error, statusCode, headers) => {
  console.error(error)
  const errorStatusCode = statusCode || error.statusCode || 500
  return buildResponse({ error: error.message }, errorStatusCode, headers)
}

function buildResponse (body, statusCode, headers) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      ...headers
    },
    body: JSON.stringify(body)
  }
}
