import { AggregateRoot } from "../../../../shared/domain/entities/AggregateRoot";
import { EntityId } from "../../../../shared/domain/value-objects/EntityId";

import { AccessSubject } from "../value-objects/AccessSubject";

export type EntitlementStatus =
  | "active"
  | "revoked"
  | "expired";

export type EntitlementSource =
  | "manual"
  | "policy"
  | "access-package";

interface ApplicationEntitlementProps {
  subject: AccessSubject;
  applicationId: EntityId;

  status: EntitlementStatus;
  source: EntitlementSource;

  grantedAt: Date;
  expiresAt?: Date;

  grantedBy?: AccessSubject;
  reason?: string;
  policyId?: EntityId;

  revokedAt?: Date;
  revokedBy?: AccessSubject;
  revokeReason?: string;
}

export class ApplicationEntitlement extends AggregateRoot<ApplicationEntitlementProps> {
  private constructor(
    props: ApplicationEntitlementProps,
    id: EntityId,
  ) {
    super(props, id);
  }

  public static create(
    props: {
      subject: AccessSubject;
      applicationId: EntityId;
      source: EntitlementSource;

      grantedAt: Date;
      expiresAt?: Date;

      grantedBy?: AccessSubject;
      reason?: string;
      policyId?: EntityId;
    },
    id: EntityId,
  ): ApplicationEntitlement {
    return new ApplicationEntitlement(
      {
        ...props,
        status: "active",
        reason: props.reason?.trim() || undefined,
      },
      id,
    );
  }

  public static reconstitute(
    props: ApplicationEntitlementProps,
    id: EntityId,
  ): ApplicationEntitlement {
    return new ApplicationEntitlement(props, id);
  }

  public get subject(): AccessSubject {
    return this.props.subject;
  }

  public get applicationId(): EntityId {
    return this.props.applicationId;
  }

  public get status(): EntitlementStatus {
    return this.props.status;
  }

  public get source(): EntitlementSource {
    return this.props.source;
  }

  public get grantedAt(): Date {
    return this.props.grantedAt;
  }

  public get expiresAt(): Date | undefined {
    return this.props.expiresAt;
  }

  public get grantedBy(): AccessSubject | undefined {
    return this.props.grantedBy;
  }

  public get reason(): string | undefined {
    return this.props.reason;
  }

  public get policyId(): EntityId | undefined {
    return this.props.policyId;
  }

  public get revokedAt(): Date | undefined {
    return this.props.revokedAt;
  }

  public get revokedBy(): AccessSubject | undefined {
    return this.props.revokedBy;
  }

  public get revokeReason(): string | undefined {
    return this.props.revokeReason;
  }

  public revoke(
    at: Date,
    revokedBy?: AccessSubject,
    reason?: string,
  ): void {
    if (this.props.status !== "active") {
      return;
    }

    this.props.status = "revoked";
    this.props.revokedAt = at;
    this.props.revokedBy = revokedBy;
    this.props.revokeReason =
      reason?.trim() || undefined;
  }

  public expire(at: Date): void {
    if (this.props.status !== "active") {
      return;
    }

    this.props.status = "expired";
    this.props.expiresAt ??= at;
  }

  public isActive(at: Date): boolean {
    if (this.props.status !== "active") {
      return false;
    }

    if (
      this.props.expiresAt &&
      this.props.expiresAt <= at
    ) {
      return false;
    }

    return true;
  }
}