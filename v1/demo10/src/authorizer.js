const jwt = require("jsonwebtoken");
const { buildIAMPolicy } = require("./lib/util");
const JWT_KEY = process.env.JWT_KEY;

const myRoles = {
  "heroes:list": "private",
};

const authorizeUser = (userScopes, methodArn) => {
  return userScopes.find((scope) => ~methodArn.indexOf(myRoles[scope]));
};

exports.handler = async (event) => {
  const token = event.authorizationToken;

  try {
    const decodedUser = jwt.verify(token, JWT_KEY);
    const user = decodedUser.user;
    const userId = user.username;

    const isAllowed = authorizeUser(user.scopes, event.methodArn);

    // dado que irá nas requests
    const authorizerContext = {
      user: JSON.stringify(user),
    };

    const policyDocument = buildIAMPolicy(
      userId,
      isAllowed ? "Allow" : "Deny",
      event.methodArn,
      authorizerContext
    );

    return policyDocument;
  } catch (error) {
    console.error("**ERROR**", error.stack);

    return {
      // 401 -> token inválido ou expirado
      // 403 -> token sem permissão para acessar a função
      statusCode: 401,
      body: "Unauthorized",
    };
  }
};
