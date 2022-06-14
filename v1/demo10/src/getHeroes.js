"use strict";

module.exports.public = async (event) => {
  console.log("**Requesting PUBLIC route**", new Date().toISOString());

  return {
    statusCode: 200,
    body: JSON.stringify(
      [
        {
          id: 1,
          name: "Flash",
          power: "Speed",
        },
      ],
      null,
      2
    ),
  };
};

module.exports.private = async (event) => {
  console.log("**Requesting PRIVATE route**", new Date().toISOString());

  console.log({ User: JSON.parse(event.requestContext.authorizer.user) });

  return {
    statusCode: 200,
    body: JSON.stringify(
      [
        {
          id: 100,
          name: "Batman",
          power: "Rich",
        },
      ],
      null,
      2
    ),
  };
};
