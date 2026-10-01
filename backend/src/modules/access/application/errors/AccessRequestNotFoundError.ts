export class AccessRequestNotFoundError extends Error {
  constructor() {
    super("Pending access request was not found.");

    this.name = new.target.name;
  }
}