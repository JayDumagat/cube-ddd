import { AggregateRoot } from "../../../../shared/domain/entities/AggregateRoot";
import { EntityId } from "../../../../shared/domain/value-objects/EntityId";

import { AccessCriteria } from "../value-objects/AccessCriteria";

export type AccessPolicyStatus =
  | "active"
  | "inactive";

interface AccessPolicyProps {
  name: string;
  description?: string;

  applicationId: EntityId;
  criteria: AccessCriteria;

  status: AccessPolicyStatus;

  createdAt: Date;
  updatedAt: Date;
}

export class AccessPolicy extends AggregateRoot<AccessPolicyProps> {
  private constructor(
    props: AccessPolicyProps,
    id: EntityId,
  ) {
    super(props, id);
  }

  public static create(
    props: {
      name: string;
      description?: string;
      applicationId: EntityId;
      criteria: AccessCriteria;
      createdAt: Date;
    },
    id: EntityId,
  ): AccessPolicy {
    const name = props.name.trim();

    if (!name) {
      throw new Error(
        "Access policy name cannot be empty.",
      );
    }

    return new AccessPolicy(
      {
        name,
        description:
          props.description?.trim() || undefined,
        applicationId: props.applicationId,
        criteria: props.criteria,
        status: "active",
        createdAt: props.createdAt,
        updatedAt: props.createdAt,
      },
      id,
    );
  }

  public static reconstitute(
    props: AccessPolicyProps,
    id: EntityId,
  ): AccessPolicy {
    return new AccessPolicy(props, id);
  }

  public get name(): string {
    return this.props.name;
  }

  public get description(): string | undefined {
    return this.props.description;
  }

  public get applicationId(): EntityId {
    return this.props.applicationId;
  }

  public get criteria(): AccessCriteria {
    return this.props.criteria;
  }

  public get status(): AccessPolicyStatus {
    return this.props.status;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public activate(at: Date): void {
    this.props.status = "active";
    this.props.updatedAt = at;
  }

  public deactivate(at: Date): void {
    this.props.status = "inactive";
    this.props.updatedAt = at;
  }

  public changeCriteria(
    criteria: AccessCriteria,
    at: Date,
  ): void {
    this.props.criteria = criteria;
    this.props.updatedAt = at;
  }
}