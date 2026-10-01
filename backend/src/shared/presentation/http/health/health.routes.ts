import { Router } from "express";

import {
  healthCheck,
  readinessCheck,
} from "./health.controller";

export const healthRouter = Router();

healthRouter.get("/health", healthCheck);
healthRouter.get("/ready", readinessCheck);