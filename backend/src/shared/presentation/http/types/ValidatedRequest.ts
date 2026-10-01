import { z } from "zod";

export interface RequestSchema {
  body?: z.ZodType;
  params?: z.ZodType;
  query?: z.ZodType;
}

type InferSchema<T> = T extends z.ZodType
  ? z.infer<T>
  : undefined;

export type ValidatedRequest<TSchema extends RequestSchema> = {
  body: InferSchema<TSchema["body"]>;
  params: InferSchema<TSchema["params"]>;
  query: InferSchema<TSchema["query"]>;
};

export interface ValidatedLocals<TSchema extends RequestSchema> {
  validated: ValidatedRequest<TSchema>;
}