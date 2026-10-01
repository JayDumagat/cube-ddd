import type { Repository } from "../../../../shared/domain/repositories/Repository";
import type { EntityId } from "../../../../shared/domain/value-objects/EntityId";
import type { PaginatedResult } from "../../../../shared/application/pagination/PaginatedResult";
import type { PaginationParams } from "../../../../shared/application/pagination/PaginationParams";

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

  findBySubject(
    subject: AccessSubject,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<AccessRequest>>;

  findPending(
    pagination: PaginationParams,
  ): Promise<PaginatedResult<AccessRequest>>;

  existsPending(
    subject: AccessSubject,
    applicationId: EntityId,
  ): Promise<boolean>;
}
