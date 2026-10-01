import type { UseCase } from "../../../../../shared/application/use-cases/UseCase";
import { Result } from "../../../../../shared/application/results/Result";
import type { Clock } from "../../../../../shared/application/time/Clock";
import type { IdGenerator } from "../../../../../shared/domain/services/IdGenerator";
import { EntityId } from "../../../../../shared/domain/value-objects/EntityId";

import { AccessRequest } from "../../../domain/entities/AccessRequest";
import type { ApplicationEntitlementRepository } from "../../../domain/repositories/ApplicationEntitlementRepository";
import type { ApplicationRepository } from "../../../domain/repositories/ApplicationRepository";
import type { AccessRequestRepository } from "../../../domain/repositories/AccessRequestRepository";
import { AccessSubject } from "../../../domain/value-objects/AccessSubject";

import { AccessRequestAlreadyPendingError } from "../../errors/AccessRequestAlreadyPendingError";
import { ApplicationAccessAlreadyGrantedError } from "../../errors/ApplicationAccessAlreadyGrantedError";
import { ApplicationNotFoundError } from "../../errors/ApplicationNotFoundError";

interface RequestApplicationAccessInput {
  tenantId: string;
  objectId: string;

  applicationId: string;

  requestedBy: {
    tenantId: string;
    objectId: string;
  };

  reason: string;

  expiresAt?: Date;
}

type RequestApplicationAccessOutput = Result<
  AccessRequest,
  | ApplicationNotFoundError
  | ApplicationAccessAlreadyGrantedError
  | AccessRequestAlreadyPendingError
>;

export class RequestApplicationAccess
  implements
    UseCase<
      RequestApplicationAccessInput,
      RequestApplicationAccessOutput
    >
{
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly entitlementRepository: ApplicationEntitlementRepository,
    private readonly accessRequestRepository: AccessRequestRepository,
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock,
  ) {}

  public async execute(
    input: RequestApplicationAccessInput,
  ): Promise<RequestApplicationAccessOutput> {
    const subject = AccessSubject.create(
      input.tenantId,
      input.objectId,
    );

    const requestedBy = AccessSubject.create(
      input.requestedBy.tenantId,
      input.requestedBy.objectId,
    );

    const applicationId = EntityId.create(
      input.applicationId,
    );

    const application =
      await this.applicationRepository.findById(
        applicationId,
      );

    if (!application) {
      return Result.failure(
        new ApplicationNotFoundError(),
      );
    }

    const alreadyHasAccess =
      await this.entitlementRepository.existsActive(
        subject,
        applicationId,
      );

    if (alreadyHasAccess) {
      return Result.failure(
        new ApplicationAccessAlreadyGrantedError(),
      );
    }

    const pendingRequestExists =
      await this.accessRequestRepository.existsPending(
        subject,
        applicationId,
      );

    if (pendingRequestExists) {
      return Result.failure(
        new AccessRequestAlreadyPendingError(),
      );
    }

    const request = AccessRequest.create(
      {
        subject,
        applicationId,
        requestedBy,
        reason: input.reason,
        requestedAt: this.clock.now(),
        expiresAt: input.expiresAt,
      },
      EntityId.create(
        this.idGenerator.generate(),
      ),
    );

    await this.accessRequestRepository.save(
      request,
    );

    return Result.success(request);
  }
}