import { Table } from "dynamodb-onetable";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import Dynamo from "dynamodb-onetable/Dynamo";
import { NftTokenType } from "alchemy-sdk";

const ddb = new DynamoDBClient({
  credentials: {
    accessKeyId: "fake-key",
    secretAccessKey: "fake-secret",
  },
  endpoint: "http://localhost:8001",
  region: "local",
});

const MySchema = {
  format: "onetable:1.1.0",
  version: "0.0.1",
  indexes: {
    primary: { hash: "PK", sort: "SK" },
  },
  models: {
    Collection: {
      PK: { type: String, value: "${_type}" },
      SK: { type: String, value: "${contractAddress}" },
      contractAddress: { type: String, required: true },
      collectionName: { type: String },
      logo: { type: String },
      type: { type: String, enum: Object.values(NftTokenType) },
    },
  },
  params: {
    isoDates: true,
    timestamps: true,
  },
};

const table = new Table({
  client: new Dynamo({ client: ddb }),
  name: "appTable",
  partial: false,
  // if you deploy to AWS
  // name: process.env.APP_TABLE_NAME,
  schema: MySchema,
});

export const Collection = table.getModel("Collection");
