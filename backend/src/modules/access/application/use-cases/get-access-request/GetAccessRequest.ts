import type { UseCase } from "../../../../../shared/application/use-cases/UseCase";
import { Result } from "../../../../../shared/application/results/Result";
import { EntityId } from "../../../../../shared/domain/value-objects/EntityId";

import type { AccessRequestStatus } from "../../../domain/entities/AccessRequest";
import type { AccessRequestRepository } from "../../../domain/repositories/AccessRequestRepository";

import { AccessRequestNotFoundError } from "../../errors/AccessRequestNotFoundError";

interface GetAccessRequestInput {
  requestId: string;
}

export interface AccessRequestDto {
  id: string;

  subject: {
    tenantId: string;
    objectId: string;
  };

  applicationId: string;

  requestedBy: {
    tenantId: string;
    objectId: string;
  };

  reason: string;
  status: AccessRequestStatus;

  requestedAt: Date;
  expiresAt?: Date;

  reviewedBy?: {
    tenantId: string;
    objectId: string;
  };

  reviewedAt?: Date;
  reviewReason?: string;

  cancelledBy?: {
    tenantId: string;
    objectId: string;
  };

  cancelledAt?: Date;
  cancelReason?: string;
}

type GetAccessRequestOutput = Result<
  AccessRequestDto,
  AccessRequestNotFoundError
>;

export class GetAccessRequest
  implements
    UseCase<
      GetAccessRequestInput,
      GetAccessRequestOutput
    >
{
  constructor(
    private readonly accessRequestRepository: AccessRequestRepository,
  ) {}

  public async execute(
    input: GetAccessRequestInput,
  ): Promise<GetAccessRequestOutput> {
    const request =
      await this.accessRequestRepository.findById(
        EntityId.create(input.requestId),
      );

    if (!request) {
      return Result.failure(
        new AccessRequestNotFoundError(),
      );
    }

    return Result.success({
      id: request.id.value,

      subject: {
        tenantId: request.subject.tenantId,
        objectId: request.subject.objectId,
      },

      applicationId: request.applicationId.value,

      requestedBy: {
        tenantId: request.requestedBy.tenantId,
        objectId: request.requestedBy.objectId,
      },

      reason: request.reason,
      status: request.status,

      requestedAt: request.requestedAt,
      expiresAt: request.expiresAt,

      reviewedBy: request.reviewedBy
        ? {
            tenantId: request.reviewedBy.tenantId,
            objectId: request.reviewedBy.objectId,
          }
        : undefined,

      reviewedAt: request.reviewedAt,
      reviewReason: request.reviewReason,

      cancelledBy: request.cancelledBy
        ? {
            tenantId: request.cancelledBy.tenantId,
            objectId: request.cancelledBy.objectId,
          }
        : undefined,

      cancelledAt: request.cancelledAt,
      cancelReason: request.cancelReason,
    });
  }
}