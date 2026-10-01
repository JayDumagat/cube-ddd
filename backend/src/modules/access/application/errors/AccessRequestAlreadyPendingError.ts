export class AccessRequestAlreadyPendingError extends Error {
  constructor() {
    super(
      "A pending access request already exists for this application.",
    );

    this.name = new.target.name;
  }
}