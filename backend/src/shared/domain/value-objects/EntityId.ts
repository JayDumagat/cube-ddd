import { ValueObject } from "./ValueObject";

interface EntityIdProps {
  value: string;
}

export class EntityId extends ValueObject<EntityIdProps> {
  private constructor(props: EntityIdProps) {
    super(props);
  }

  public static create(value: string): EntityId {
    if (!value.trim()) {
      throw new Error("Entity ID cannot be empty.");
    }

    return new EntityId({
      value,
    });
  }

  public get value(): string {
    return this.props.value;
  }

  public toString(): string {
    return this.props.value;
  }
}