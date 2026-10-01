import type { UseCase } from "../../../../../shared/application/use-cases/UseCase";
import { Result } from "../../../../../shared/application/results/Result";
import type { Clock } from "../../../../../shared/application/time/Clock";
import { EntityId } from "../../../../../shared/domain/value-objects/EntityId";

import type { ApplicationEntitlementRepository } from "../../../domain/repositories/ApplicationEntitlementRepository";
import { AccessSubject } from "../../../domain/value-objects/AccessSubject";

import { ApplicationEntitlementNotFoundError } from "../../errors/ApplicationEntitlementNotFoundError";

interface RevokeApplicationAccessInput {
  entitlementId: string;

  tenantId: string;
  objectId: string;

  revokedBy?: {
    tenantId: string;
    objectId: string;
  };

  reason?: string;
}

type RevokeApplicationAccessOutput = Result<
  void,
  ApplicationEntitlementNotFoundError
>;

export class RevokeApplicationAccess
  implements
    UseCase<
      RevokeApplicationAccessInput,
      RevokeApplicationAccessOutput
    >
{
  constructor(
    private readonly entitlementRepository: ApplicationEntitlementRepository,
    private readonly clock: Clock,
  ) {}

  public async execute(
    input: RevokeApplicationAccessInput,
  ): Promise<RevokeApplicationAccessOutput> {
    const entitlementId = EntityId.create(
      input.entitlementId,
    );

    const subject = AccessSubject.create(
      input.tenantId,
      input.objectId,
    );

    const entitlement =
      await this.entitlementRepository.findById(
        entitlementId,
      );

    if (
      !entitlement ||
      entitlement.status !== "active" ||
      !entitlement.subject.equals(subject)
    ) {
      return Result.failure(
        new ApplicationEntitlementNotFoundError(),
      );
    }

    const revokedBy = input.revokedBy
      ? AccessSubject.create(
          input.revokedBy.tenantId,
          input.revokedBy.objectId,
        )
      : undefined;

    entitlement.revoke(
      this.clock.now(),
      revokedBy,
      input.reason,
    );

    await this.entitlementRepository.save(
      entitlement,
    );

    return Result.success(undefined);
  }
}