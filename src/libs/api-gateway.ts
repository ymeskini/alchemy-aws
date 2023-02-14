import { APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";

export const defaultJSONResponseSchema = z.object({
  statusCode: z.number(),
});

export const formatJSONResponse = <T>(
  response: T,
  statusCode: number
): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify(response),
  };
};
