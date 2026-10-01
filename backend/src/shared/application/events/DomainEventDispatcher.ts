import type { DomainEvent } from "../../domain/events/DomainEvent";
import type { DomainEventHandler } from "../../domain/events/DomainEventHandler";

export interface DomainEventDispatcher {
  register<TEvent extends DomainEvent>(
    eventName: string,
    handler: DomainEventHandler<TEvent>,
  ): void;

  dispatch(event: DomainEvent): Promise<void>;

  dispatchAll(events: readonly DomainEvent[]): Promise<void>;
}