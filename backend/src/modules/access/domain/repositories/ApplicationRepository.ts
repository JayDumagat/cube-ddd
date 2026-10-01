import type { Repository } from "../../../../shared/domain/repositories/Repository";
import type { EntityId } from "../../../../shared/domain/value-objects/EntityId";

import type { Application } from "../entities/Application";
import type { ApplicationCode } from "../value-objects/ApplicationCode";

export interface ApplicationRepository
  extends Repository<Application>
{
  findById(
    id: EntityId,
  ): Promise<Application | null>;

  findByIds(
    ids: EntityId[],
  ): Promise<Application[]>;

  findByCode(
    code: ApplicationCode,
  ): Promise<Application | null>;

  existsByCode(
    code: ApplicationCode,
  ): Promise<boolean>;
}