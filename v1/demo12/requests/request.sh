HOST=http://localhost:3003

APIKEY=d41d8cd98f00b204e9800998ecf8427

curl --silent \
  -H "x-api-key: $APIKEY" \
  $HOST/dev/hello

# leandro@test.com: UXEh3fqvbI6alcZPE5qd13gttdcMHSj47yVBvqER
# thaisa@test.com: QNN7NjXXZC19FsIwWiN7t3dOLod4YwWBaa6LIjAy
# beatriz@test.com: qFdZmwHeMCaV3YEI8C4HC5DkOjgcn9qkaygR1wK6
# myPaidKey: DTf6dHYRWtBTKWcwaZOR4ZXwyUrq3Xr2Zxj78FP8
# leandro.paid@test.com: CeGMWoT0DU6uANxS7mnJ13hqAkOZYLaD83Zs6Vaa

echo "Press <CTRL + C> to exit"

while :
do
  curl --silent \
    -H "x-api-key: $APIKEY" \
    $HOST/dev/hello
done

curl --silent \
  -H "x-api-key: $APIKEY" \
  $HOST/dev/getUsagePlans \
  | tee logs/getUsagePlans.log

USAGE_PLAN_ID="mvya8j"
KEY_ID="z7i5v1z939"
API_KEY="qFdZmwHeMCaV3YEI8C4HC5DkOjgcn9qkaygR1wK6"
FROM="2022-06-12"
TO="2022-06-13"

curl --silent \
  "$HOST/dev/getUsagePlans?keyId=$KEY_ID&usagePlanId=$USAGE_PLAN_ID&from=$FROM&to=$TO" \
  | tee logs/usage.log

CUSTOMER_NAME="customer@test.com"
curl --silent \
  "$HOST/dev/addKey?name=$CUSTOMER_NAME&usagePlanId=$USAGE_PLAN_ID" \
  | tee logs/addKey.log

KEY_ID="a5k9hc1fuk"
API_KEY="MMPWbAxczg4Ij8cig0lI35MqCsCml7h06MNMu8vh"
