import type { UseCase } from "../../../../../shared/application/use-cases/UseCase";
import { Result } from "../../../../../shared/application/results/Result";
import type { Clock } from "../../../../../shared/application/time/Clock";
import { EntityId } from "../../../../../shared/domain/value-objects/EntityId";

import type { AccessRequestRepository } from "../../../domain/repositories/AccessRequestRepository";
import { AccessSubject } from "../../../domain/value-objects/AccessSubject";

import { AccessRequestNotFoundError } from "../../errors/AccessRequestNotFoundError";

interface CancelAccessRequestInput {
  requestId: string;

  cancelledBy: {
    tenantId: string;
    objectId: string;
  };

  reason?: string;
}

type CancelAccessRequestOutput = Result<
  void,
  AccessRequestNotFoundError
>;

export class CancelAccessRequest
  implements
    UseCase<
      CancelAccessRequestInput,
      CancelAccessRequestOutput
    >
{
  constructor(
    private readonly accessRequestRepository: AccessRequestRepository,
    private readonly clock: Clock,
  ) {}

  public async execute(
    input: CancelAccessRequestInput,
  ): Promise<CancelAccessRequestOutput> {
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

    const cancelledBy = AccessSubject.create(
      input.cancelledBy.tenantId,
      input.cancelledBy.objectId,
    );

    request.cancel(
      cancelledBy,
      this.clock.now(),
      input.reason,
    );

    await this.accessRequestRepository.save(
      request,
    );

    return Result.success(undefined);
  }
}