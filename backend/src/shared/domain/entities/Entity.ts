import { EntityId } from "../value-objects/EntityId";

export abstract class Entity<TProps> {
  protected readonly props: TProps;

  public readonly id: EntityId;

  protected constructor(
    props: TProps,
    id: EntityId,
  ) {
    this.props = props;
    this.id = id;
  }

  public equals(entity?: Entity<TProps>): boolean {
    if (!entity) {
      return false;
    }

    if (entity === this) {
      return true;
    }

    return this.id.equals(entity.id);
  }
}