const ssmPrefix = "/prod/curso-serverless01";

const variables = {
  ECS_TASK_DEFINITION: {
    value: "process-data:2",
    type: "String",
  },
  ECS_CLUSTER_NAME: {
    value: "curso-serverless",
    type: "String",
  },
  ECS_TASK_LAUNCH_TYPE: {
    value: "FARGATE",
    type: "String",
  },
  ECS_TASK_COUNT: {
    value: "1",
    type: "String",
  },
  ECS_TASK_PLATFORM_VERSION: {
    value: "LATEST",
    type: "String",
  },
  ECS_TASK_CONTAINER_NAME: {
    value: "process-data",
    type: "String",
  },
  ECS_TASK_CONTAINER_FILE_ENV_NAME: {
    value: "SURVEY_FILE",
    type: "String",
  },
  ECS_TASK_SUBNETS: {
    value: ["subnet-00fe7530941633728", "subnet-0855e4769eb314c49"].join(","),
    type: "StringList",
  },
  ECS_TASK_SECURITY_GROUPS: {
    value: ["sg-0552dffc8bdd75d15"].join(","),
    type: "StringList",
  },
  ECS_TASK_ASSIGN_PUBLIC_IP: {
    value: "ENABLED",
    type: "String",
  },
  ECS_PROCESS_DATA_IMAGE_URL: {
    value: "777632128622.dkr.ecr.us-east-1.amazonaws.com/process-data",
    type: "String",
  },
  BUCKET_REPORTS: {
    value: "reports",
    type: "String",
  },
  LOG_GROUP_NAME: {
    value: "/ecs/curso-serverless01",
    type: "String",
  },
  SSM_PREFIX: {
    value: ssmPrefix,
    type: "String",
  },
  BUCKET_SURVEYS: {
    value: "devleandrodias-bucket-001",
    type: "String",
  },
  REGION: {
    value: "us-east-1",
    type: "String",
  },
  SES_EMAIL_FROM: {
    value: "leandrodbdias@gmail.com",
    type: "String",
  },
  SES_EMAIL_TO: {
    value: "leandrodbdias@gmail.com",
    type: "String",
  },
};

module.exports = {
  variables,
  ssmPrefix,
};
