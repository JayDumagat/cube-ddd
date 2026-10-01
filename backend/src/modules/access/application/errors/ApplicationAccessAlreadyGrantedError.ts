export class ApplicationAccessAlreadyGrantedError extends Error {
  constructor() {
    super("Application access has already been granted.");

    this.name = new.target.name;
  }
}