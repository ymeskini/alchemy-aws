import { alchemy } from "@libs/alchemy";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyLogger } from "@libs/logger";
import { zHexAddress } from "@libs/utils";
import { validationMiddleware } from "@libs/validation-middleware";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Collection } from "src/models/Collection";
import { z } from "zod";

const eventSchema = z.object({
  body: z.object({
    contractAddress: zHexAddress,
  }),
});

export const main = middy<
  z.infer<typeof eventSchema> & APIGatewayProxyEvent,
  APIGatewayProxyResult
>()
  .use(bodyParser())
  .use(middyLogger)
  .use(
    validationMiddleware({
      eventSchema,
    })
  )
  .handler(async (event) => {
    const { body } = event;

    const nftMetadata = await alchemy.nft.getContractMetadata(
      body.contractAddress
    );

    if (!nftMetadata) {
      return formatJSONResponse(null, 404);
    }

    await Collection.create({
      contractAddress: body.contractAddress,
      collectionName: nftMetadata.name,
      logo: nftMetadata.openSea?.imageUrl,
      type: nftMetadata.tokenType,
    });

    return formatJSONResponse(
      {
        body: {
          contractAddress: nftMetadata.address,
        },
      },
      200
    );
  });
