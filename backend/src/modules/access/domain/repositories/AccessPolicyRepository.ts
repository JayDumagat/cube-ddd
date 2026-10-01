import type { Repository } from "../../../../shared/domain/repositories/Repository";
import type { EntityId } from "../../../../shared/domain/value-objects/EntityId";

import type { AccessPolicy } from "../entities/AccessPolicy";

export interface AccessPolicyRepository
  extends Repository<AccessPolicy>
{
  findById(
    id: EntityId,
  ): Promise<AccessPolicy | null>;

  findActiveByApplication(
    applicationId: EntityId,
  ): Promise<AccessPolicy[]>;

  findAllActive(): Promise<AccessPolicy[]>;
}