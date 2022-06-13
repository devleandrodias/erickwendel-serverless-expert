// Poderia retornar usuários de um Dynamodb...

const privateUsers = async () => {
  return ["leandro@test.com", "thaisa@test.com", "beatriz@test.com"];
};

exports.private = privateUsers;
