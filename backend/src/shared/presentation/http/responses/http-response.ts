import type { Response } from "express";

import type {
  HttpSuccessResponse,
  HttpSuccessResponseWithMeta,
} from "./HttpResponse";

export function ok<T>(
  res: Response,
  data: T,
): void {
  res.status(200).json({
    data,
  } satisfies HttpSuccessResponse<T>);
}

export function created<T>(
  res: Response,
  data: T,
): void {
  res.status(201).json({
    data,
  } satisfies HttpSuccessResponse<T>);
}

export function withMeta<T, TMeta>(
  res: Response,
  data: T,
  meta: TMeta,
): void {
  res.status(200).json({
    data,
    meta,
  } satisfies HttpSuccessResponseWithMeta<T, TMeta>);
}

export function noContent(res: Response): void {
  res.status(204).send();
}