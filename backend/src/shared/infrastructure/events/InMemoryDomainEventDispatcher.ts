import type { DomainEventDispatcher } from "../../application/events/DomainEventDispatcher";
import type { DomainEvent } from "../../domain/events/DomainEvent";
import type { DomainEventHandler } from "../../domain/events/DomainEventHandler";

type Handler = DomainEventHandler<DomainEvent>;

export class InMemoryDomainEventDispatcher
  implements DomainEventDispatcher
{
  private readonly handlers = new Map<string, Handler[]>();

  public register<TEvent extends DomainEvent>(
    eventName: string,
    handler: DomainEventHandler<TEvent>,
  ): void {
    const handlers = this.handlers.get(eventName) ?? [];

    handlers.push(handler as Handler);

    this.handlers.set(eventName, handlers);
  }

  public async dispatch(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventName) ?? [];

    await Promise.all(
      handlers.map((handler) => handler.handle(event)),
    );
  }

  public async dispatchAll(
    events: readonly DomainEvent[],
  ): Promise<void> {
    for (const event of events) {
      await this.dispatch(event);
    }
  }
}

export const domainEventDispatcher =
  new InMemoryDomainEventDispatcher();