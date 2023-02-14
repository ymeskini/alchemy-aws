import { alchemy } from "@libs/alchemy";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyLogger } from "@libs/logger";
import { zHexAddress } from "@libs/utils";
import { validationMiddleware } from "@libs/validation-middleware";
import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";


const eventSchema = z.object({
  pathParameters: z.object({
    contractAddress: zHexAddress,
  }),
});

export const main = middy<
  z.infer<typeof eventSchema> & APIGatewayProxyEvent,
  APIGatewayProxyResult
>()
  .use(middyLogger)
  .use(
    validationMiddleware({
      eventSchema,
    })
  )
  .handler(async (event) => {
    const { pathParameters } = event;

    const nftMetadata = await alchemy.nft.getContractMetadata(
      pathParameters.contractAddress
    );

    if (!nftMetadata) {
      return formatJSONResponse(null, 404);
    }

    return formatJSONResponse(
      {
        body: {
          contractAddress: nftMetadata.address,
          type: nftMetadata.tokenType,
          collectionName: nftMetadata.name,
          logo: nftMetadata.openSea?.imageUrl,
        },
      },
      200
    );
  });
