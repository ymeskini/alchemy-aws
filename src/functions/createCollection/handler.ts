import { alchemy } from "@libs/alchemy";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyLogger } from "@libs/logger";
import { zHexAddress } from "@libs/utils";
import { validationMiddleware } from "@libs/validation-middleware";
import middy from "@middy/core";
import bodyParse from "@middy/http-json-body-parser";
import { Collection } from "src/models/Collection";
import { z } from "zod";

const eventSchema = z.object({
  body: z.object({
    contractAddress: zHexAddress,
  }),
});

export const main = middy<z.infer<typeof eventSchema>>()
  .use(middyLogger)
  .use(bodyParse())
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
    await Collection.create({
      contractAddress: nftMetadata.address,
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
