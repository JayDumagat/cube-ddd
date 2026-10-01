export class ApplicationNotFoundError extends Error {
  constructor() {
    super("Application was not found.");

    this.name = new.target.name;
  }
}