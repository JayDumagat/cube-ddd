import { ValueObject } from "../../../../shared/domain/value-objects/ValueObject";

interface ApplicationCodeProps {
  value: string;
}

export class ApplicationCode extends ValueObject<ApplicationCodeProps> {
  private constructor(props: ApplicationCodeProps) {
    super(props);
  }

  public static create(value: string): ApplicationCode {
    const normalized = value.trim().toUpperCase();

    if (!/^[A-Z0-9_-]{2,32}$/.test(normalized)) {
      throw new Error("Invalid application code.");
    }

    return new ApplicationCode({
      value: normalized,
    });
  }

  public get value(): string {
    return this.props.value;
  }

  public toString(): string {
    return this.props.value;
  }
}