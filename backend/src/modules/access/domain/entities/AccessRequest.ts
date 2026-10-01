import { AggregateRoot } from "../../../../shared/domain/entities/AggregateRoot";
import { EntityId } from "../../../../shared/domain/value-objects/EntityId";

import { AccessSubject } from "../value-objects/AccessSubject";

export type AccessRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

interface AccessRequestProps {
  subject: AccessSubject;
  applicationId: EntityId;

  requestedBy: AccessSubject;
  reason: string;

  status: AccessRequestStatus;

  requestedAt: Date;
  expiresAt?: Date;

  reviewedBy?: AccessSubject;
  reviewedAt?: Date;
  reviewReason?: string;

  cancelledBy?: AccessSubject;
  cancelledAt?: Date;
  cancelReason?: string;
}

export class AccessRequest extends AggregateRoot<AccessRequestProps> {
  private constructor(props: AccessRequestProps, id: EntityId) {
    super(props, id);
  }

  public static create(
    props: {
      subject: AccessSubject;
      applicationId: EntityId;

      requestedBy: AccessSubject;
      reason: string;

      requestedAt: Date;
      expiresAt?: Date;
    },
    id: EntityId,
  ): AccessRequest {
    const reason = props.reason.trim();

    if (!reason) {
      throw new Error("Access request reason cannot be empty.");
    }

    return new AccessRequest(
      {
        ...props,
        reason,
        status: "pending",
      },
      id,
    );
  }

  public static reconstitute(
    props: AccessRequestProps,
    id: EntityId,
  ): AccessRequest {
    return new AccessRequest(props, id);
  }

  public get subject(): AccessSubject {
    return this.props.subject;
  }

  public get applicationId(): EntityId {
    return this.props.applicationId;
  }

  public get requestedBy(): AccessSubject {
    return this.props.requestedBy;
  }

  public get reason(): string {
    return this.props.reason;
  }

  public get status(): AccessRequestStatus {
    return this.props.status;
  }

  public get requestedAt(): Date {
    return this.props.requestedAt;
  }

  public get expiresAt(): Date | undefined {
    return this.props.expiresAt;
  }

  public get reviewedBy(): AccessSubject | undefined {
    return this.props.reviewedBy;
  }

  public get reviewedAt(): Date | undefined {
    return this.props.reviewedAt;
  }

  public get reviewReason(): string | undefined {
    return this.props.reviewReason;
  }

  public get cancelledBy(): AccessSubject | undefined {
    return this.props.cancelledBy;
  }

  public get cancelledAt(): Date | undefined {
    return this.props.cancelledAt;
  }

  public get cancelReason(): string | undefined {
    return this.props.cancelReason;
  }

  public approve(reviewedBy: AccessSubject, reviewedAt: Date): void {
    if (this.props.status !== "pending") {
      return;
    }

    this.props.status = "approved";
    this.props.reviewedBy = reviewedBy;
    this.props.reviewedAt = reviewedAt;
  }

  public reject(
    reviewedBy: AccessSubject,
    reviewedAt: Date,
    reason?: string,
  ): void {
    if (this.props.status !== "pending") {
      return;
    }

    this.props.status = "rejected";
    this.props.reviewedBy = reviewedBy;
    this.props.reviewedAt = reviewedAt;
    this.props.reviewReason = reason?.trim() || undefined;
  }

  public cancel(
    cancelledBy: AccessSubject,
    cancelledAt: Date,
    reason?: string,
  ): void {
    if (this.props.status !== "pending") {
      return;
    }

    this.props.status = "cancelled";
    this.props.cancelledBy = cancelledBy;
    this.props.cancelledAt = cancelledAt;
    this.props.cancelReason = reason?.trim() || undefined;
  }
}
