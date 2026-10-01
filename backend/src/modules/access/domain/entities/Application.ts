import { AggregateRoot } from "../../../../shared/domain/entities/AggregateRoot";
import { EntityId } from "../../../../shared/domain/value-objects/EntityId";
import { ApplicationCode } from "../value-objects/ApplicationCode";

export type ApplicationStatus = "active" | "inactive";

interface ApplicationProps {
  code: ApplicationCode;
  name: string;
  description?: string;
  status: ApplicationStatus;
}

export class Application extends AggregateRoot<ApplicationProps> {
  private constructor(
    props: ApplicationProps,
    id: EntityId,
  ) {
    super(props, id);
  }

  public static create(
    props: {
      code: ApplicationCode;
      name: string;
      description?: string;
    },
    id: EntityId,
  ): Application {
    return new Application(
      {
        ...props,
        status: "active",
      },
      id,
    );
  }

  public static reconstitute(
    props: ApplicationProps,
    id: EntityId,
  ): Application {
    return new Application(props, id);
  }

  public get code(): ApplicationCode {
    return this.props.code;
  }

  public get name(): string {
    return this.props.name;
  }

  public get description(): string | undefined {
    return this.props.description;
  }

  public get status(): ApplicationStatus {
    return this.props.status;
  }

  public activate(): void {
    this.props.status = "active";
  }

  public deactivate(): void {
    this.props.status = "inactive";
  }

  public rename(name: string): void {
    const normalized = name.trim();

    if (!normalized) {
      throw new Error("Application name cannot be empty.");
    }

    this.props.name = normalized;
  }

  public updateDescription(description?: string): void {
    this.props.description = description?.trim() || undefined;
  }
}