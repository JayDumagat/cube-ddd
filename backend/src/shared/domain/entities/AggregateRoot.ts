import { Entity } from "./Entity";
import { EntityId } from "../value-objects/EntityId";
import { DomainEvent } from "../events/DomainEvent";

export abstract class AggregateRoot<TProps> extends Entity<TProps> {
  private readonly domainEvents: DomainEvent[] = [];

  protected constructor(
    props: TProps,
    id: EntityId,
  ) {
    super(props, id);
  }

  protected addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  public getDomainEvents(): readonly DomainEvent[] {
    return this.domainEvents;
  }

  public clearDomainEvents(): void {
    this.domainEvents.length = 0;
  }
}