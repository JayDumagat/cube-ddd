import type { UseCase } from "../../../../../shared/application/use-cases/UseCase";
import type { Clock } from "../../../../../shared/application/time/Clock";
import type { IdGenerator } from "../../../../../shared/domain/services/IdGenerator";
import { EntityId } from "../../../../../shared/domain/value-objects/EntityId";

import { ApplicationEntitlement } from "../../../domain/entities/ApplicationEntitlement";
import type { ApplicationEntitlementRepository } from "../../../domain/repositories/ApplicationEntitlementRepository";
import type { AccessPolicyRepository } from "../../../domain/repositories/AccessPolicyRepository";
import { AccessPolicyEvaluator } from "../../../domain/services/AccessPolicyEvaluator";
import { AccessSubject } from "../../../domain/value-objects/AccessSubject";
import { EmployeeAccessProfile } from "../../../domain/value-objects/EmployeeAccessProfile";

interface ReconcileEmployeeAccessInput {
  tenantId: string;
  objectId: string;

  profile: {
    department?: string;
    employeeLevel?: string;
    jobFunction?: string;
    office?: string;
    employmentStatus?: string;
  };
}

interface ReconcileEmployeeAccessOutput {
  granted: number;
  revoked: number;
}

export class ReconcileEmployeeAccess implements UseCase<
  ReconcileEmployeeAccessInput,
  ReconcileEmployeeAccessOutput
> {
  constructor(
    private readonly policyRepository: AccessPolicyRepository,
    private readonly entitlementRepository: ApplicationEntitlementRepository,
    private readonly policyEvaluator: AccessPolicyEvaluator,
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock,
  ) {}

  public async execute(
    input: ReconcileEmployeeAccessInput,
  ): Promise<ReconcileEmployeeAccessOutput> {
    const subject = AccessSubject.create(input.tenantId, input.objectId);

    const profile = EmployeeAccessProfile.create(input.profile);

    const policies = await this.policyRepository.findAllActive();

    const now = this.clock.now();

    let granted = 0;
    let revoked = 0;

    for (const policy of policies) {
      const matches = this.policyEvaluator.matches(policy, profile);

      const existingEntitlement =
        await this.entitlementRepository.findActiveByPolicyAndSubject(
          policy.id,
          subject,
          now,
        );

      if (matches && !existingEntitlement) {
        const entitlement = ApplicationEntitlement.create(
          {
            subject,
            applicationId: policy.applicationId,
            source: "policy",
            grantedAt: now,
            policyId: policy.id,
          },
          EntityId.create(this.idGenerator.generate()),
        );

        await this.entitlementRepository.save(entitlement);

        granted++;

        continue;
      }

      if (!matches && existingEntitlement) {
        existingEntitlement.revoke(
          now,
          undefined,
          "Employee no longer matches access policy.",
        );

        await this.entitlementRepository.save(existingEntitlement);

        revoked++;
      }
    }

    return {
      granted,
      revoked,
    };
  }
}
