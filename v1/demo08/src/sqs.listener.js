class Handler {
  async main(event) {
    const [{ body, messageId }] = event.Records;

    const item = JSON.parse(body);

    console.log(
      "***EVENT",
      JSON.stringify(
        {
          item,
          messageId,
          at: new Date().toISOString(),
        },
        null,
        2
      )
    );

    try {
      return {
        statusCode: 200,
        body: "Hello SQS!",
      };
    } catch (err) {
      console.log("***ERROR***", err);
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  }
}

const handler = new Handler();

module.exports = handler.main.bind(handler);
