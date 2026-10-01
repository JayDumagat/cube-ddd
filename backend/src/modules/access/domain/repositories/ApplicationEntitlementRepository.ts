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
  ): Promise<ApplicationEntitlement[]>;

  findActiveBySubject(
    subject: AccessSubject,
  ): Promise<ApplicationEntitlement[]>;

  findActiveByPolicyAndSubject(
    policyId: EntityId,
    subject: AccessSubject,
  ): Promise<ApplicationEntitlement | null>;

  existsActive(
    subject: AccessSubject,
    applicationId: EntityId,
  ): Promise<boolean>;
}