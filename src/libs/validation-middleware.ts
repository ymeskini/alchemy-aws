import { ZodSchema } from "zod";
import middy from "@middy/core";
import { createError } from "@middy/util";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

type validationSchemas = {
  eventSchema: ZodSchema;
};

type DefaultMiddlewareFn = middy.MiddlewareFn<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
>;

type DefaultMiddleWareReturn = Promise<void>;

export const validationMiddleware = (
  schemas: validationSchemas
): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const { eventSchema } = schemas;

  const before: DefaultMiddlewareFn = async (
    request
  ): DefaultMiddleWareReturn => {
    try {
      await eventSchema.parseAsync(request.event);
    } catch (error) {
      throw createError(400, "Bad Request");
    }
  };

  return {
    before,
  };
};
