import pino from "pino";

import { env } from "../config/env";
import type { Logger } from "../../application/logging/Logger";

export const pinoLogger = pino({
  level: env.nodeEnv === "production" ? "info" : "debug",

  transport:
    env.nodeEnv === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});

export const logger: Logger = {
  debug(message, context) {
    pinoLogger.debug(context ?? {}, message);
  },

  info(message, context) {
    pinoLogger.info(context ?? {}, message);
  },

  warn(message, context) {
    pinoLogger.warn(context ?? {}, message);
  },

  error(message, context) {
    pinoLogger.error(context ?? {}, message);
  },
};