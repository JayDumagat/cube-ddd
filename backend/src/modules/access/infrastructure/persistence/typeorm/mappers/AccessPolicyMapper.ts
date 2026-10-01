import { EntityId } from "../../../../../../shared/domain/value-objects/EntityId";

import {
  AccessPolicy,
  type AccessPolicyStatus,
} from "../../../../domain/entities/AccessPolicy";
import { AccessCriteria } from "../../../../domain/value-objects/AccessCriteria";

import { AccessPolicyOrmEntity } from "../entities/AccessPolicyOrmEntity";

export class AccessPolicyMapper {
  public static toDomain(entity: AccessPolicyOrmEntity): AccessPolicy {
    return AccessPolicy.reconstitute(
      {
        name: entity.name,
        description: entity.description ?? undefined,

        applicationId: EntityId.create(entity.applicationId),

        criteria: AccessCriteria.create(entity.criteria),

        status: entity.status as AccessPolicyStatus,

        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
      EntityId.create(entity.id),
    );
  }

  public static toPersistence(policy: AccessPolicy): AccessPolicyOrmEntity {
    const entity = new AccessPolicyOrmEntity();

    entity.id = policy.id.value;
    entity.applicationId = policy.applicationId.value;

    entity.name = policy.name;
    entity.description = policy.description ?? null;

    entity.status = policy.status;

    entity.criteria = {
      departments: [...policy.criteria.departments],
      employeeLevels: [...policy.criteria.employeeLevels],
      jobFunctions: [...policy.criteria.jobFunctions],
      offices: [...policy.criteria.offices],
      employmentStatuses: [...policy.criteria.employmentStatuses],
    };

    entity.createdAt = policy.createdAt;
    entity.updatedAt = policy.updatedAt;

    return entity;
  }
}
