import { HttpError } from "./HttpError";

export class UnauthorizedError extends HttpError {
  constructor(
    message = "Unauthorized",
    details?: unknown,
  ) {
    super(401, message, details);
  }
}