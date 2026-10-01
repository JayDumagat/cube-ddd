import type { UseCase } from "../../../../../shared/application/use-cases/UseCase";
import { Result } from "../../../../../shared/application/results/Result";
import type { Clock } from "../../../../../shared/application/time/Clock";
import type { IdGenerator } from "../../../../../shared/domain/services/IdGenerator";
import { EntityId } from "../../../../../shared/domain/value-objects/EntityId";

import {
  ApplicationEntitlement,
  type EntitlementSource,
} from "../../../domain/entities/ApplicationEntitlement";
import type { ApplicationEntitlementRepository } from "../../../domain/repositories/ApplicationEntitlementRepository";
import type { ApplicationRepository } from "../../../domain/repositories/ApplicationRepository";
import { AccessSubject } from "../../../domain/value-objects/AccessSubject";

import { ApplicationAccessAlreadyGrantedError } from "../../errors/ApplicationAccessAlreadyGrantedError";

interface GrantApplicationAccessInput {
  tenantId: string;
  objectId: string;

  applicationId: string;

  source: EntitlementSource;

  expiresAt?: Date;

  grantedBy?: {
    tenantId: string;
    objectId: string;
  };

  reason?: string;

  policyId?: string;
}

type GrantApplicationAccessOutput = Result<
  ApplicationEntitlement,
  ApplicationAccessAlreadyGrantedError | Error
>;

export class GrantApplicationAccess
  implements
    UseCase<
      GrantApplicationAccessInput,
      GrantApplicationAccessOutput
    >
{
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly entitlementRepository: ApplicationEntitlementRepository,
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock,
  ) {}

  public async execute(
    input: GrantApplicationAccessInput,
  ): Promise<GrantApplicationAccessOutput> {
    const subject = AccessSubject.create(
      input.tenantId,
      input.objectId,
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
        new Error("Application not found."),
      );
    }

    const alreadyGranted =
      await this.entitlementRepository.existsActive(
        subject,
        applicationId,
      );

    if (alreadyGranted) {
      return Result.failure(
        new ApplicationAccessAlreadyGrantedError(),
      );
    }

    const grantedBy = input.grantedBy
      ? AccessSubject.create(
          input.grantedBy.tenantId,
          input.grantedBy.objectId,
        )
      : undefined;

    const policyId = input.policyId
      ? EntityId.create(input.policyId)
      : undefined;

    const entitlement =
      ApplicationEntitlement.create(
        {
          subject,
          applicationId,
          source: input.source,

          grantedAt: this.clock.now(),
          expiresAt: input.expiresAt,

          grantedBy,
          reason: input.reason,
          policyId,
        },
        EntityId.create(
          this.idGenerator.generate(),
        ),
      );

    await this.entitlementRepository.save(
      entitlement,
    );

    return Result.success(entitlement);
  }
}