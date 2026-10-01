import pinoHttp from "pino-http";

import { pinoLogger } from "../../../infrastructure/logging/logger";

export const requestLogger = pinoHttp({
  logger: pinoLogger,
});