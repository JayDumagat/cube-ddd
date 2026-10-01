import type { UseCase } from "../../../../../shared/application/use-cases/UseCase";
import { Result } from "../../../../../shared/application/results/Result";
import type { Clock } from "../../../../../shared/application/time/Clock";
import type { IdGenerator } from "../../../../../shared/domain/services/IdGenerator";
import { EntityId } from "../../../../../shared/domain/value-objects/EntityId";

import { ApplicationEntitlement } from "../../../domain/entities/ApplicationEntitlement";
import type { ApplicationEntitlementRepository } from "../../../domain/repositories/ApplicationEntitlementRepository";
import type { AccessRequestRepository } from "../../../domain/repositories/AccessRequestRepository";
import { AccessSubject } from "../../../domain/value-objects/AccessSubject";

import { AccessRequestNotFoundError } from "../../errors/AccessRequestNotFoundError";
import { ApplicationAccessAlreadyGrantedError } from "../../errors/ApplicationAccessAlreadyGrantedError";

interface ApproveAccessRequestInput {
  requestId: string;

  approvedBy: {
    tenantId: string;
    objectId: string;
  };
}

type ApproveAccessRequestOutput = Result<
  ApplicationEntitlement,
  AccessRequestNotFoundError | ApplicationAccessAlreadyGrantedError
>;

export class ApproveAccessRequest
  implements
    UseCase<
      ApproveAccessRequestInput,
      ApproveAccessRequestOutput
    >
{
  constructor(
    private readonly accessRequestRepository: AccessRequestRepository,
    private readonly entitlementRepository: ApplicationEntitlementRepository,
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock,
  ) {}

  public async execute(
    input: ApproveAccessRequestInput,
  ): Promise<ApproveAccessRequestOutput> {
    const requestId = EntityId.create(
      input.requestId,
    );

    const now = this.clock.now();

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

    const alreadyHasAccess =
      await this.entitlementRepository.existsActive(
        request.subject,
        request.applicationId,
        now
      );

    if (alreadyHasAccess) {
      return Result.failure(
        new ApplicationAccessAlreadyGrantedError(),
      );
    }

    const approvedBy = AccessSubject.create(
      input.approvedBy.tenantId,
      input.approvedBy.objectId,
    );

    

    request.approve(
      approvedBy,
      now,
    );

    const entitlement =
      ApplicationEntitlement.create(
        {
          subject: request.subject,
          applicationId: request.applicationId,

          source: "manual",

          grantedAt: now,
          expiresAt: request.expiresAt,

          grantedBy: approvedBy,
          reason: request.reason,
        },
        EntityId.create(
          this.idGenerator.generate(),
        ),
      );

    await this.accessRequestRepository.save(
      request,
    );

    await this.entitlementRepository.save(
      entitlement,
    );

    return Result.success(entitlement);
  }
}