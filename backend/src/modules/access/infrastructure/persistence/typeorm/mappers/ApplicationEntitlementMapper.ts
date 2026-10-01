import { EntityId } from "../../../../../../shared/domain/value-objects/EntityId";

import {
  ApplicationEntitlement,
  type EntitlementSource,
  type EntitlementStatus,
} from "../../../../domain/entities/ApplicationEntitlement";

import { AccessSubject } from "../../../../domain/value-objects/AccessSubject";

import { ApplicationEntitlementOrmEntity } from "../entities/ApplicationEntitlementOrmEntity";

export class ApplicationEntitlementMapper {
  public static toDomain(
    entity: ApplicationEntitlementOrmEntity,
  ): ApplicationEntitlement {
    return ApplicationEntitlement.reconstitute(
      {
        subject: AccessSubject.create(entity.tenantId, entity.objectId),

        applicationId: EntityId.create(entity.applicationId),

        status: entity.status as EntitlementStatus,
        source: entity.source as EntitlementSource,

        grantedAt: entity.grantedAt,
        expiresAt: entity.expiresAt ?? undefined,

        grantedBy:
          entity.grantedByTenantId && entity.grantedByObjectId
            ? AccessSubject.create(
                entity.grantedByTenantId,
                entity.grantedByObjectId,
              )
            : undefined,

        reason: entity.reason ?? undefined,

        policyId: entity.policyId
          ? EntityId.create(entity.policyId)
          : undefined,

        revokedAt: entity.revokedAt ?? undefined,

        revokedBy:
          entity.revokedByTenantId && entity.revokedByObjectId
            ? AccessSubject.create(
                entity.revokedByTenantId,
                entity.revokedByObjectId,
              )
            : undefined,

        revokeReason: entity.revokeReason ?? undefined,
      },
      EntityId.create(entity.id),
    );
  }

  public static toPersistence(
    entitlement: ApplicationEntitlement,
  ): ApplicationEntitlementOrmEntity {
    const entity = new ApplicationEntitlementOrmEntity();

    entity.id = entitlement.id.value;

    entity.applicationId = entitlement.applicationId.value;

    entity.tenantId = entitlement.subject.tenantId;

    entity.objectId = entitlement.subject.objectId;

    entity.status = entitlement.status;
    entity.source = entitlement.source;

    entity.grantedAt = entitlement.grantedAt;
    entity.expiresAt = entitlement.expiresAt ?? null;

    entity.grantedByTenantId = entitlement.grantedBy?.tenantId ?? null;

    entity.grantedByObjectId = entitlement.grantedBy?.objectId ?? null;

    entity.reason = entitlement.reason ?? null;

    entity.policyId = entitlement.policyId?.value ?? null;

    entity.revokedAt = entitlement.revokedAt ?? null;

    entity.revokedByTenantId = entitlement.revokedBy?.tenantId ?? null;

    entity.revokedByObjectId = entitlement.revokedBy?.objectId ?? null;

    entity.revokeReason = entitlement.revokeReason ?? null;

    return entity;
  }
}
