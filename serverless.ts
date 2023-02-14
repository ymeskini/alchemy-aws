import type { AWS } from '@serverless/typescript';
import { type Lift } from 'serverless-lift';

import * as functions from './src/functions';

const serverlessConfiguration: AWS & Lift = {
  service: 'test-technique',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-lift'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      // uncomment if deploying to AWS
      // APP_TABLE_NAME: '${construct:appTable.tableName}',
      ALCHEMY_API_KEY: 'swSHMDWJam8GmCpX7OGOw8ep-2iXTs-C',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  functions: functions,
  package: { individually: true },
  constructs: {
    appTable: {
      type: 'database/dynamodb-single-table',
      localSecondaryIndexes: false,
    },
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
