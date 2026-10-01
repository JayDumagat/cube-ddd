import { HttpError } from "./HttpError";

export class ForbiddenError extends HttpError {
  constructor(
    message = "Forbidden",
    details?: unknown,
  ) {
    super(403, message, details);
  }
}