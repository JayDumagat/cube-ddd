import type { UseCase } from "../../../../../shared/application/use-cases/UseCase";
import type { Clock } from "../../../../../shared/application/time/Clock";
import { EntityId } from "../../../../../shared/domain/value-objects/EntityId";

import type { ApplicationEntitlementRepository } from "../../../domain/repositories/ApplicationEntitlementRepository";
import { AccessSubject } from "../../../domain/value-objects/AccessSubject";

interface CheckApplicationAccessInput {
  tenantId: string;
  objectId: string;
  applicationId: string;
}

interface CheckApplicationAccessOutput {
  allowed: boolean;
}

export class CheckApplicationAccess
  implements
    UseCase<
      CheckApplicationAccessInput,
      CheckApplicationAccessOutput
    >
{
  constructor(
    private readonly entitlementRepository: ApplicationEntitlementRepository,
    private readonly clock: Clock,
  ) {}

  public async execute(
    input: CheckApplicationAccessInput,
  ): Promise<CheckApplicationAccessOutput> {
    const subject = AccessSubject.create(
      input.tenantId,
      input.objectId,
    );

    const now = this.clock.now();

    const applicationId = EntityId.create(
      input.applicationId,
    );


    const entitlements =
      await this.entitlementRepository.findActiveBySubjectAndApplication(
        subject,
        applicationId,
        now
      );

    const allowed = entitlements.some((entitlement) =>
      entitlement.isActive(now),
    );

    return {
      allowed,
    };
  }
}