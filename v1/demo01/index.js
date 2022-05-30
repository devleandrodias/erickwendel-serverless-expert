async function handler(event, context) {
  console.log("Event: ", JSON.stringify(event, null, 2));
  console.log("Environment: ", JSON.stringify(process.env.ENV, null, 2));

  return {
    message: "Hello World! Updated...",
  };
}

module.exports = { handler };
