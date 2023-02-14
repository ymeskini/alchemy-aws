import {
  DynamoDBClient,
  CreateTableCommand,
  BillingMode,
  KeyType,
  ScalarAttributeType,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";

import { logger } from "./src/libs/logger";

const appTableName = "appTable";

const ddb = new DynamoDBClient({
  credentials: {
    accessKeyId: "fake-key",
    secretAccessKey: "fake-secret",
  },
  endpoint: "http://localhost:8001",
  region: "local",
});

(async function main() {
  logger.info("Setting up local DynamoDB tables");
  const existingTable = await ddb.send(new ListTablesCommand({}));
  if (
    existingTable.TableNames?.find((tableName) => appTableName === tableName)
  ) {
    logger.info(
      "DynamoDB Local - Table already exists: ${TableName}. Skipping.."
    );
    return;
  }

  const createTableCommand = new CreateTableCommand({
    AttributeDefinitions: [
      { AttributeName: "PK", AttributeType: ScalarAttributeType.S },
      { AttributeName: "SK", AttributeType: ScalarAttributeType.S },
    ],
    BillingMode: BillingMode.PAY_PER_REQUEST,
    TableName: "appTable",
    KeySchema: [
      { AttributeName: "PK", KeyType: KeyType.HASH },
      { AttributeName: "SK", KeyType: KeyType.RANGE },
    ],
  });
  const result = await ddb.send(createTableCommand);
  logger.info(result);
})();
