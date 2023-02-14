import { createLogger, transports } from "winston";
import inputOutputLogger from '@middy/input-output-logger'

export const logger = createLogger({
    transports: [new transports.Console()]
});

export const middyLogger = inputOutputLogger({
    logger: (message) => logger.info(message),
    awsContext: true,
});