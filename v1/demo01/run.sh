# 1 - Passo criar arquivo de políticas de segurança
# 2 - Criar role de segurança na AWS

aws iam create-role \
  --role-name lambda-exemplo \
  --assume-role-policy-document file://politicas.json \
  | tee logs/role.log

# 3 - Criar um arquivo com conteúdo e zipa-lo

zip function.zip index.js

aws lambda create-function \
  --function-name hello-cli \
  --zip-file fileb://function.zip \
  --handler index.handler \
  --runtime nodejs12.x \
  --role arn:aws:iam::777632128622:role/lambda-exemplo \
  | tee logs/lambda-create.log

# 4 - Invoke a Lambda!

aws lambda invoke \
  --function-name hello-cli \
  --log-type Tail \
  logs/lambda-exec.log

# -- Atualizar, zipar

zip function.zip index.js

aws lambda update-function-code \
  --zip-file fileb://function.zip \
  --function-name hello-cli \
  --publish \
  | tee logs/lambda-update.log

# 5 - Remover recursos

aws lambda delete-function \
  --function-name hello-cli

aws iam delete-role \
  --role-name lambda-exemplo