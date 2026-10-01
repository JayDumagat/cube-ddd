export class Result<T, E = Error> {
  private constructor(
    private readonly value?: T,
    private readonly error?: E,
  ) {}

  public static success<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(value);
  }

  public static failure<T, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(undefined, error);
  }

  public get isSuccess(): boolean {
    return this.error === undefined;
  }

  public get isFailure(): boolean {
    return !this.isSuccess;
  }

  public getValue(): T {
    if (this.isFailure) {
      throw new Error("Cannot get the value of a failed result.");
    }

    return this.value as T;
  }

  public getError(): E {
    if (this.isSuccess) {
      throw new Error("Cannot get the error of a successful result.");
    }

    return this.error as E;
  }
}