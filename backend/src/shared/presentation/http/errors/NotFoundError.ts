import { HttpError } from "./HttpError";

export class NotFoundError extends HttpError {
  constructor(
    message = "Resource not found",
    details?: unknown,
  ) {
    super(404, message, details);
  }
}