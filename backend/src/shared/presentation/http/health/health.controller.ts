import type { RequestHandler } from "express";

import { AppDataSource } from "../../../infrastructure/database/data-source";

export const healthCheck: RequestHandler = (_req, res) => {
  res.status(200).json({
    data: {
      status: "ok",
    },
  });
};

export const readinessCheck: RequestHandler = async (_req, res) => {
  const databaseReady = AppDataSource.isInitialized;

  if (!databaseReady) {
    res.status(503).json({
      error: {
        message: "Service unavailable",
        details: {
          database: "not ready",
        },
      },
    });

    return;
  }

  try {
    await AppDataSource.query("SELECT 1");

    res.status(200).json({
      data: {
        status: "ready",
        database: "connected",
      },
    });
  } catch {
    res.status(503).json({
      error: {
        message: "Service unavailable",
        details: {
          database: "unavailable",
        },
      },
    });
  }
};