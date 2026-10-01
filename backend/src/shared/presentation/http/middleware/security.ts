import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

export const helmetMiddleware = helmet();

export const corsMiddleware = cors({
  origin: true,
  credentials: true,
});

export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});