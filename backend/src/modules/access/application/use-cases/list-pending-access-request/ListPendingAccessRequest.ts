import type { UseCase } from "../../../../../shared/application/use-cases/UseCase";
import type { PaginatedResult } from "../../../../../shared/application/pagination/PaginatedResult";

import type { AccessRequestRepository } from "../../../domain/repositories/AccessRequestRepository";

interface ListPendingAccessRequestsInput {
  page: number;
  limit: number;
}

export interface PendingAccessRequestDto {
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
  requestedAt: Date;
  expiresAt?: Date;
}

type ListPendingAccessRequestsOutput =
  PaginatedResult<PendingAccessRequestDto>;

export class ListPendingAccessRequests
  implements
    UseCase<
      ListPendingAccessRequestsInput,
      ListPendingAccessRequestsOutput
    >
{
  constructor(
    private readonly accessRequestRepository: AccessRequestRepository,
  ) {}

  public async execute(
    input: ListPendingAccessRequestsInput,
  ): Promise<ListPendingAccessRequestsOutput> {
    const result =
      await this.accessRequestRepository.findPending({
        page: input.page,
        limit: input.limit,
      });

    return {
      ...result,

      items: result.items.map((request) => ({
        id: request.id.value,

        subject: {
          tenantId: request.subject.tenantId,
          objectId: request.subject.objectId,
        },

        applicationId:
          request.applicationId.value,

        requestedBy: {
          tenantId: request.requestedBy.tenantId,
          objectId: request.requestedBy.objectId,
        },

        reason: request.reason,
        requestedAt: request.requestedAt,
        expiresAt: request.expiresAt,
      })),
    };
  }
}