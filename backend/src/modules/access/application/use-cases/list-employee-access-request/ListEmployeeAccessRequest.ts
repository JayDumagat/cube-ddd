import type { UseCase } from "../../../../../shared/application/use-cases/UseCase";
import type { PaginatedResult } from "../../../../../shared/application/pagination/PaginatedResult";

import type { AccessRequestRepository } from "../../../domain/repositories/AccessRequestRepository";
import { AccessSubject } from "../../../domain/value-objects/AccessSubject";
import type { AccessRequestStatus } from "../../../domain/entities/AccessRequest";

interface ListEmployeeAccessRequestsInput {
  tenantId: string;
  objectId: string;

  page: number;
  limit: number;
}

export interface EmployeeAccessRequestDto {
  id: string;
  applicationId: string;

  status: AccessRequestStatus;

  requestedBy: {
    tenantId: string;
    objectId: string;
  };

  reason: string;

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

type ListEmployeeAccessRequestsOutput =
  PaginatedResult<EmployeeAccessRequestDto>;

export class ListEmployeeAccessRequests
  implements
    UseCase<
      ListEmployeeAccessRequestsInput,
      ListEmployeeAccessRequestsOutput
    >
{
  constructor(
    private readonly accessRequestRepository: AccessRequestRepository,
  ) {}

  public async execute(
    input: ListEmployeeAccessRequestsInput,
  ): Promise<ListEmployeeAccessRequestsOutput> {
    const subject = AccessSubject.create(
      input.tenantId,
      input.objectId,
    );

    const result =
      await this.accessRequestRepository.findBySubject(
        subject,
        {
          page: input.page,
          limit: input.limit,
        },
      );

    return {
      ...result,

      items: result.items.map((request) => ({
        id: request.id.value,
        applicationId: request.applicationId.value,

        status: request.status,

        requestedBy: {
          tenantId: request.requestedBy.tenantId,
          objectId: request.requestedBy.objectId,
        },

        reason: request.reason,

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
      })),
    };
  }
}