QUEUE_URL=$1

echo 'Sending message to queue...' $QUEUE_URL

aws \
  sqs send-message \
  --queue-url $QUEUE_URL \
  --message-body 'Hello, AWS SQS!'
  # --endpoint-url http://localhost:4576

# aws \
#   sqs receive-message \
#   --queue-url $QUEUE_URL \
#   --endpoint-url http://localhost:4576
