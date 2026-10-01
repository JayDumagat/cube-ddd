import type { Repository } from "../../../../shared/domain/repositories/Repository";
import type { EntityId } from "../../../../shared/domain/value-objects/EntityId";

import type { AccessRequest } from "../entities/AccessRequest";
import type { AccessSubject } from "../value-objects/AccessSubject";

export interface AccessRequestRepository
  extends Repository<AccessRequest>
{
  findById(
    id: EntityId,
  ): Promise<AccessRequest | null>;

  findPendingBySubjectAndApplication(
    subject: AccessSubject,
    applicationId: EntityId,
  ): Promise<AccessRequest | null>;

  findPendingBySubject(
    subject: AccessSubject,
  ): Promise<AccessRequest[]>;

  existsPending(
    subject: AccessSubject,
    applicationId: EntityId,
  ): Promise<boolean>;
}