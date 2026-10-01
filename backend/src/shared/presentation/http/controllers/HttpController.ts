import type {
  Request,
  Response,
  NextFunction,
} from "express";

import type {
  RequestSchema,
  ValidatedLocals,
} from "../types/ValidatedRequest";

export type HttpController<
  TSchema extends RequestSchema,
  TResponse = unknown,
> = (
  req: Request,
  res: Response<TResponse, ValidatedLocals<TSchema>>,
  next: NextFunction,
) => Promise<void> | void;