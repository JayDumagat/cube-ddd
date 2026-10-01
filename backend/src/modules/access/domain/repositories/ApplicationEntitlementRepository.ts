import type { PaginatedResult } from "../../../../shared/application/pagination/PaginatedResult";
import type { PaginationParams } from "../../../../shared/application/pagination/PaginationParams";
import type { Repository } from "../../../../shared/domain/repositories/Repository";
import type { EntityId } from "../../../../shared/domain/value-objects/EntityId";

import type { ApplicationEntitlement } from "../entities/ApplicationEntitlement";
import type { AccessSubject } from "../value-objects/AccessSubject";

export interface ApplicationEntitlementRepository
  extends Repository<ApplicationEntitlement>
{
  findById(
    id: EntityId,
  ): Promise<ApplicationEntitlement | null>;

  findActiveBySubjectAndApplication(
  subject: AccessSubject,
  applicationId: EntityId,
  at: Date,
): Promise<ApplicationEntitlement[]>;

findActiveBySubject(
  subject: AccessSubject,
  at: Date,
): Promise<ApplicationEntitlement[]>;

findActiveByPolicyAndSubject(
  policyId: EntityId,
  subject: AccessSubject,
  at: Date,
): Promise<ApplicationEntitlement | null>;

existsActive(
  subject: AccessSubject,
  applicationId: EntityId,
  at: Date,
): Promise<boolean>;

  findBySubject(
    subject: AccessSubject,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ApplicationEntitlement>>;
}