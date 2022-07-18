SSM_PREFIX="/prod/curso-serverless01"

IMAGE_URL=$(aws ssm get-parameter \
  --name "$SSM_PREFIX/ECS_PROCESS_DATA_IMAGE_URL" \
  --query "Parameter.Value" | jq -r
)

REGION=$(aws ssm get-parameter \
  --name "$SSM_PREFIX/REGION" \
  --query "Parameter.Value" | jq -r
)

AWS_ACCOUNT_ID="777632128622"

docker build -t $IMAGE_URL .

aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

docker run \
  -v ~/.aws/:/root/.aws \
  -e SURVEY_FILE='{"Bucket":"devleandrodias-bucket-001","Key":"survey_results_public.csv"}' \
  -e AWS_ENV_PATH="$SSM_PREFIX" \
  -e AWS_REGION="$REGION" \
  -t $IMAGE_URL

docker push $IMAGE_URL

 