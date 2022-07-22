aws --version

ROLE_NAME=lambda-demo-role
NODEJS_VERSION=nodejs16.x
FUNCTION_NAME=hello-cli

mkdir -p logs

aws iam create-role \
  --role-name $ROLE_NAME \
  --assume-role-policy-document file://policies.json \
  | tee logs/1.create-role.json

POLICY_ARN=$(cat logs/1.create-role.json | jq -r .Role.Arn)

zip function.zip index.js

aws lambda create-function \
  --function-name $FUNCTION_NAME \
  --zip-file fileb://function.zip \
  --handler index.handler \
  --runtime $NODEJS_VERSION \
  --role $POLICY_ARN \
  | tee logs/2.create-function.json

zip function.zip index.js

aws lambda update-function-code \
  --zip-file fileb://function.zip \
  --function-name $FUNCTION_NAME \
  --publish \
  | tee logs/3.update-function-code.json

aws lambda invoke \
  --function-name $FUNCTION_NAME logs/4.lambda-exec.log \
  --log-type Tail \
  --query 'LogResult' \
  --cli-binary-format raw-in-base64-out \
  --payload '{"name":"Leandro Dias"}' \
  --output text | base64 -d

aws lambda delete-function \
  --function-name $FUNCTION_NAME

aws iam delete-role \
  --role-name $ROLE_NAME