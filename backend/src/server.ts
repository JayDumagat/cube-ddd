import app from "./app";

import { env } from "./shared/infrastructure/config/env";
import { AppDataSource } from "./shared/infrastructure/database/data-source";
import { registerGracefulShutdown } from "./shared/infrastructure/lifecycle/graceful-shutdown";
import { logger } from "./shared/infrastructure/logging/logger";

async function bootstrap() {
  try {
    await AppDataSource.initialize();

    logger.info("Database connected");

    const server = app.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    });

    registerGracefulShutdown({
      server,
      dataSource: AppDataSource,
    });
  } catch (error) {
    logger.error("Failed to start application", {
      error,
    });

    process.exit(1);
  }
}

void bootstrap();