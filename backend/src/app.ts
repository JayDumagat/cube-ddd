import express from "express";

import { apiV1Router } from "./routes";

import { healthRouter } from "./shared/presentation/http/health/health.routes";
import { requestLogger } from "./shared/presentation/http/middleware/request-logger";
import {
  helmetMiddleware,
  corsMiddleware,
  rateLimitMiddleware,
} from "./shared/presentation/http/middleware/security";
import { notFoundHandler } from "./shared/presentation/http/middleware/not-found";
import { errorHandler } from "./shared/presentation/http/middleware/error-handler";

const app = express();

app.use(requestLogger);

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(rateLimitMiddleware);

app.use(express.json());

app.use(healthRouter);

app.use("/api/v1", apiV1Router);

app.get("/", (_req, res) => {
  res.json({
    data: {
      message: "API is running",
    },
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;