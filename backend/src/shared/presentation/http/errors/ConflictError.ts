import { HttpError } from "./HttpError";

export class ConflictError extends HttpError {
  constructor(
    message = "Conflict",
    details?: unknown,
  ) {
    super(409, message, details);
  }
}