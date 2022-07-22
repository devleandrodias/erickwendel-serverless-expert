# Create a new bucket
aws s3api create-bucket \
  --bucket devleandro-hello-bucket \
  --region us-east-1

# Upload a file to the bucket
aws s3 cp hello.txt s3://devleandro-hello-bucket/hello.txt

# Download the file from the bucket
aws s3 cp s3://devleandro-hello-bucket/hello.txt output.txt

# Delete files from the bucket
aws s3 rm s3://devleandro-hello-bucket --recursive

# Delete the current bucket
aws s3api delete-bucket \
  --bucket devleandro-hello-bucket \
  --region us-east-1