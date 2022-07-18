IMAGE_URL="777632128622.dkr.ecr.us-east-1.amazonaws.com/process-data"
AWS_ACCOUNT_ID="777632128622"
REGION="us-east-1"

aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

docker build -t $IMAGE_URL .

docker run $IMAGE_URL

