async function handler(event, context) {
  console.log('Event', JSON.stringify(event, null, 2));
  console.log('Context', context)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello World from Lambda!',
    })
  }
}

module.exports = { handler }