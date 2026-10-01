import { HttpError } from "./HttpError";

export class BadRequestError extends HttpError {
  constructor(
    message = "Bad request",
    details?: unknown,
  ) {
    super(400, message, details);
  }
}