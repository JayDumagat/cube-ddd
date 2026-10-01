import type { RequestHandler } from "express";

import type {
  RequestSchema,
  ValidatedLocals,
  ValidatedRequest,
} from "../types/ValidatedRequest";

export function validateRequest<TSchema extends RequestSchema>(
  schema: TSchema,
): RequestHandler<
  Record<string, string>,
  unknown,
  unknown,
  Record<string, unknown>,
  ValidatedLocals<TSchema>
> {
  return (req, res, next) => {
    try {
      const validated = {
        body: schema.body?.parse(req.body),
        params: schema.params?.parse(req.params),
        query: schema.query?.parse(req.query),
      } as ValidatedRequest<TSchema>;

      res.locals.validated = validated;

      next();
    } catch (error) {
      next(error);
    }
  };
}