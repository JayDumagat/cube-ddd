import type { Server } from "node:http";
import type { DataSource } from "typeorm";

import { logger } from "../logging/logger";

interface GracefulShutdownOptions {
  server: Server;
  dataSource: DataSource;
}

export function registerGracefulShutdown({
  server,
  dataSource,
}: GracefulShutdownOptions): void {
  let isShuttingDown = false;

  const shutdown = async (signal: NodeJS.Signals) => {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;

    logger.info(`Received ${signal}. Shutting down.`);

    try {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });

      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }

      logger.info("Application shut down successfully");

      process.exit(0);
    } catch (error) {
      logger.error("Failed to shut down gracefully", {
        error,
      });

      process.exit(1);
    }
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}