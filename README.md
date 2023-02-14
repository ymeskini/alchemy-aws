# Instruction

## Context

The aim of the test is to complete the code of 3 lambda functions.
You are supposed to take 2 hours for this test. You are free to take more time, if you want, please let me know if it's the case.

The test is purposefully built with libraries & technologies you may not know but we use a lot at Dialog.
There is no problem not finishing entirely the test. Your previous expertise on Serverless/Typescript/AWS will be taken into account when evaluating you.
You are free to add libraries, refactor code, create file, add tools if you want.

If the expected output seems not clear enough, I trust you to choose what seems best. If necessary, we will discuss the choices you made during debrief.

## Details

1. Get NFT collection details - Part 1

We want to expose a route to our users to search for NFTs contract.
In `src/functions/getNftCollectionDetails/index.ts`, we already declared the route and configure the lambda to be triggered by an HTTP event of type GET.
The contract address will be passed as a path parameter which will be available in `event.pathParameters` in `src/functions/getNftCollectionDetails/handler.ts`

The lambda should return (if possible) an object containing the collection name, the contract address, an image of the collection, 'ERC-721' or 'ERC-1155' according to the token type.

To get collection information you should use [Alchemy API](https://docs.alchemy.com/reference/getcontractmetadata). An API Key is available as env var (accessible with `process.env.ALCHEMY_API_KEY`).

2. Create NFT collection

The goal of this part is to create a simple POST route to create an nft collection resource with the following attributes in our DynamoDB table:

- contractAddress (required)
- collectionName
- image
- type ("ERC-721" or "ERC-1155")

3. Create NFT collection details - Part 2

Implement a new POST route to create a NFT collection in our DynamoDB table. The body should contain only a contractAddress and fetch other information from Alchemy :

- collectionName
- image
- type ("ERC-721" or "ERC-1155")

The response can contain only the contractAddress.

Your answer should be resilient to failure in Alchemy API.

## Submission

Please send a zip file of your code to louis@askdialog.com via google drive or wetransfer, or provide a branch with your name on the git repository you were invited to.

# Project detail

## Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Template features

### Deploy the project on AWS or develop locally

You have the choice between developing locally and/or deploying to AWS. If you chose to deploy your lambda functions to AWS, please share your API Gateway endpoint
when submitting the project.
To test locally or deploy your function, follow the instructions in Installation/deployment instructions.

### Database

The project contains a `docker-compose.yml` file with a AWS DynamoDB image to develop locally :

- If you chose to develop locally, you must run `docker-compose up` and then launch the script in `./create-table-locally.ts`.
- If you chose to deploy to AWS, the project uses [Lift](https://github.com/getlift/lift) to provision a DynamoDB table (nothing to be done on your side except `sls deploy`)

In `src/models`, you will find a simple `Collection` model built with [OneTable](https://doc.onetable.io/). You can use the exported `Collection` object to read/write data to DynamoDB - if you chose to deploy to AWS, you will have to remove the config passed to the DynamoDB client (line 6-11) and uncomment the line 38 to use the table name created automatically.

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── createCollection
│   │   │   ├── handler.ts      # `createCollection` lambda source code
│   │   │   ├── index.ts        # `createCollection` lambda Serverless configuration
│   │   │   ├── mock.json       # `createCollection` lambda input parameter, if any, for local invocation
│   │   │   └── schema.ts       # `createCollection` lambda input event JSON-Schema
│   │   ├── getNftCollectionDetails
│   │   │   ├── handler.ts      # `getNftCollectionDetails` lambda source code
│   │   │   ├── index.ts        # `getNftCollectionDetails` lambda Serverless configuration
│   │   │   ├── mock.json       # `getNftCollectionDetails` lambda input parameter, if any, for local invocation
│   │   │   └── schema.ts       # `getNftCollectionDetails` lambda input event JSON-Schema
│   │   │
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── apiGateway.ts       # API Gateway specific helpers
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│       └── lambda.ts           # Lambda middleware
│   └── models                  # OneTable models
│       └── collection.ts       # Collection model and OneTable initialization
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/gallium (v.16.x)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

### DynamoDB table name

If you deploy to AWS, you will need to give the correct `APP_TABLE_NAME` env var in `src/models/Collection.ts`. In `serverless.ts` uncomment line 20.
In `src/models/Collection.ts`, uncomment line 39.

### Locally

In order to test the getNftCollectionDetail function locally, run the following command:

- `npx sls invoke local -f createCollection --path src/functions/createCollection/mock.json` if you're using NPM
- `yarn sls invoke local -f getNftCollectionDetails --path src/functions/getNftCollectionDetails/mock.json` if you're using Yarn

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.

### Remotely

Copy and replace your `url` - found in Serverless `deploy` command output - and `contractAddress` parameter in the following `curl` command in your terminal or in Postman to test your newly deployed application.

```
curl --location --request POST 'http://localhost:8001/dev/collection' \
--header 'Content-Type: application/json' \
--data-raw '{
    "contractAddress": "0xAeab21694141bacc5214aef125128763bcae1a453e"
}'
```
