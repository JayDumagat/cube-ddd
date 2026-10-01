import type { UseCase } from "../../../../../shared/application/use-cases/UseCase";
import type { PaginatedResult } from "../../../../../shared/application/pagination/PaginatedResult";
import type { Clock } from "../../../../../shared/application/time/Clock";

import type {
  EntitlementSource,
  EntitlementStatus,
} from "../../../domain/entities/ApplicationEntitlement";
import type { ApplicationEntitlementRepository } from "../../../domain/repositories/ApplicationEntitlementRepository";
import { AccessSubject } from "../../../domain/value-objects/AccessSubject";

interface ListEmployeeEntitlementsInput {
  tenantId: string;
  objectId: string;

  page: number;
  limit: number;
}

export interface EmployeeEntitlementDto {
  id: string;
  applicationId: string;

  status: EntitlementStatus;
  source: EntitlementSource;

  active: boolean;

  grantedAt: Date;
  expiresAt?: Date;

  grantedBy?: {
    tenantId: string;
    objectId: string;
  };

  reason?: string;
  policyId?: string;

  revokedAt?: Date;

  revokedBy?: {
    tenantId: string;
    objectId: string;
  };

  revokeReason?: string;
}

type ListEmployeeEntitlementsOutput =
  PaginatedResult<EmployeeEntitlementDto>;

export class ListEmployeeEntitlements
  implements
    UseCase<
      ListEmployeeEntitlementsInput,
      ListEmployeeEntitlementsOutput
    >
{
  constructor(
    private readonly entitlementRepository: ApplicationEntitlementRepository,
    private readonly clock: Clock,
  ) {}

  public async execute(
    input: ListEmployeeEntitlementsInput,
  ): Promise<ListEmployeeEntitlementsOutput> {
    const subject = AccessSubject.create(
      input.tenantId,
      input.objectId,
    );

    const result =
      await this.entitlementRepository.findBySubject(
        subject,
        {
          page: input.page,
          limit: input.limit,
        },
      );

    const now = this.clock.now();

    return {
      ...result,

      items: result.items.map((entitlement) => ({
        id: entitlement.id.value,
        applicationId: entitlement.applicationId.value,

        status: entitlement.status,
        source: entitlement.source,

        active: entitlement.isActive(now),

        grantedAt: entitlement.grantedAt,
        expiresAt: entitlement.expiresAt,

        grantedBy: entitlement.grantedBy
          ? {
              tenantId: entitlement.grantedBy.tenantId,
              objectId: entitlement.grantedBy.objectId,
            }
          : undefined,

        reason: entitlement.reason,

        policyId: entitlement.policyId?.value,

        revokedAt: entitlement.revokedAt,

        revokedBy: entitlement.revokedBy
          ? {
              tenantId: entitlement.revokedBy.tenantId,
              objectId: entitlement.revokedBy.objectId,
            }
          : undefined,

        revokeReason: entitlement.revokeReason,
      })),
    };
  }
}