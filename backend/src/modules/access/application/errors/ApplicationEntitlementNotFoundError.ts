export class ApplicationEntitlementNotFoundError extends Error {
  constructor() {
    super("Active application entitlement was not found.");

    this.name = new.target.name;
  }
}