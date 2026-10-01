import type { DomainEvent } from "./DomainEvent";

export interface DomainEventHandler<TEvent extends DomainEvent> {
  handle(event: TEvent): Promise<void>;
}