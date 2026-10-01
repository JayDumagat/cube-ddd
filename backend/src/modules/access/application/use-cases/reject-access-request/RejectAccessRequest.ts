import type { UseCase } from "../../../../../shared/application/use-cases/UseCase";
import { Result } from "../../../../../shared/application/results/Result";
import type { Clock } from "../../../../../shared/application/time/Clock";
import { EntityId } from "../../../../../shared/domain/value-objects/EntityId";

import type { AccessRequestRepository } from "../../../domain/repositories/AccessRequestRepository";
import { AccessSubject } from "../../../domain/value-objects/AccessSubject";

import { AccessRequestNotFoundError } from "../../errors/AccessRequestNotFoundError";

interface RejectAccessRequestInput {
  requestId: string;

  rejectedBy: {
    tenantId: string;
    objectId: string;
  };

  reason?: string;
}

type RejectAccessRequestOutput = Result<
  void,
  AccessRequestNotFoundError
>;

export class RejectAccessRequest
  implements
    UseCase<
      RejectAccessRequestInput,
      RejectAccessRequestOutput
    >
{
  constructor(
    private readonly accessRequestRepository: AccessRequestRepository,
    private readonly clock: Clock,
  ) {}

  public async execute(
    input: RejectAccessRequestInput,
  ): Promise<RejectAccessRequestOutput> {
    const requestId = EntityId.create(
      input.requestId,
    );

    const request =
      await this.accessRequestRepository.findById(
        requestId,
      );

    if (
      !request ||
      request.status !== "pending"
    ) {
      return Result.failure(
        new AccessRequestNotFoundError(),
      );
    }

    const rejectedBy = AccessSubject.create(
      input.rejectedBy.tenantId,
      input.rejectedBy.objectId,
    );

    request.reject(
      rejectedBy,
      this.clock.now(),
      input.reason,
    );

    await this.accessRequestRepository.save(
      request,
    );

    return Result.success(undefined);
  }
}