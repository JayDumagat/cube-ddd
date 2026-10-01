import type { Repository as TypeOrmRepository } from "typeorm";

import type { PaginatedResult } from "../../../../../../shared/application/pagination/PaginatedResult";
import type { PaginationParams } from "../../../../../../shared/application/pagination/PaginationParams";
import type { EntityId } from "../../../../../../shared/domain/value-objects/EntityId";
import { AppDataSource } from "../../../../../../shared/infrastructure/database/data-source";

import type { ApplicationEntitlement } from "../../../../domain/entities/ApplicationEntitlement";
import type { ApplicationEntitlementRepository } from "../../../../domain/repositories/ApplicationEntitlementRepository";
import type { AccessSubject } from "../../../../domain/value-objects/AccessSubject";

import { ApplicationEntitlementOrmEntity } from "../entities/ApplicationEntitlementOrmEntity";
import { ApplicationEntitlementMapper } from "../mappers/ApplicationEntitlementMapper";

export class TypeOrmApplicationEntitlementRepository implements ApplicationEntitlementRepository {
  private readonly repository: TypeOrmRepository<ApplicationEntitlementOrmEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(
      ApplicationEntitlementOrmEntity,
    );
  }

  public async findById(id: EntityId): Promise<ApplicationEntitlement | null> {
    const entity = await this.repository.findOne({
      where: {
        id: id.value,
      },
    });

    return entity ? ApplicationEntitlementMapper.toDomain(entity) : null;
  }

  public async findActiveBySubjectAndApplication(
    subject: AccessSubject,
    applicationId: EntityId,
    at: Date,
  ): Promise<ApplicationEntitlement[]> {
    const entities = await this.repository
      .createQueryBuilder("entitlement")
      .where("entitlement.tenantId = :tenantId", {
        tenantId: subject.tenantId,
      })
      .andWhere("entitlement.objectId = :objectId", {
        objectId: subject.objectId,
      })
      .andWhere("entitlement.applicationId = :applicationId", {
        applicationId: applicationId.value,
      })
      .andWhere("entitlement.status = :status", {
        status: "active",
      })
      .andWhere(
        `(
    entitlement.expiresAt IS NULL
    OR entitlement.expiresAt > :at
  )`,
        { at },
      )
      .getMany();

    return entities.map(ApplicationEntitlementMapper.toDomain);
  }

  public async findActiveBySubject(
    subject: AccessSubject,
    at: Date,
  ): Promise<ApplicationEntitlement[]> {
    const entities = await this.repository
      .createQueryBuilder("entitlement")
      .where("entitlement.tenantId = :tenantId", {
        tenantId: subject.tenantId,
      })
      .andWhere("entitlement.objectId = :objectId", {
        objectId: subject.objectId,
      })
      .andWhere("entitlement.status = :status", {
        status: "active",
      })
      .andWhere(
  `(
    entitlement.expiresAt IS NULL
    OR entitlement.expiresAt > :at
  )`,
  { at },
)
      .getMany();

    return entities.map(ApplicationEntitlementMapper.toDomain);
  }

  public async findActiveByPolicyAndSubject(
    policyId: EntityId,
    subject: AccessSubject,
    at: Date,
  ): Promise<ApplicationEntitlement | null> {
    const entity = await this.repository
      .createQueryBuilder("entitlement")
      .where("entitlement.policyId = :policyId", {
        policyId: policyId.value,
      })
      .andWhere("entitlement.tenantId = :tenantId", {
        tenantId: subject.tenantId,
      })
      .andWhere("entitlement.objectId = :objectId", {
        objectId: subject.objectId,
      })
      .andWhere("entitlement.status = :status", {
        status: "active",
      })
      .andWhere(
  `(
    entitlement.expiresAt IS NULL
    OR entitlement.expiresAt > :at
  )`,
  { at },
)
      .getOne();

    return entity ? ApplicationEntitlementMapper.toDomain(entity) : null;
  }

  public async existsActive(
    subject: AccessSubject,
    applicationId: EntityId,
    at: Date,
  ): Promise<boolean> {
    const count = await this.repository
      .createQueryBuilder("entitlement")
      .where("entitlement.tenantId = :tenantId", {
        tenantId: subject.tenantId,
      })
      .andWhere("entitlement.objectId = :objectId", {
        objectId: subject.objectId,
      })
      .andWhere("entitlement.applicationId = :applicationId", {
        applicationId: applicationId.value,
      })
      .andWhere("entitlement.status = :status", {
        status: "active",
      })
      .andWhere(
  `(
    entitlement.expiresAt IS NULL
    OR entitlement.expiresAt > :at
  )`,
  { at },
)
      .getCount();

    return count > 0;
  }

  public async findBySubject(
    subject: AccessSubject,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ApplicationEntitlement>> {
    const skip = (pagination.page - 1) * pagination.limit;

    const [entities, total] = await this.repository.findAndCount({
      where: {
        tenantId: subject.tenantId,
        objectId: subject.objectId,
      },

      order: {
        grantedAt: "DESC",
      },

      skip,
      take: pagination.limit,
    });

    return {
      items: entities.map(ApplicationEntitlementMapper.toDomain),

      page: pagination.page,
      limit: pagination.limit,
      total,

      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  public async save(entitlement: ApplicationEntitlement): Promise<void> {
    const entity = ApplicationEntitlementMapper.toPersistence(entitlement);

    await this.repository.save(entity);
  }

  public async remove(entitlement: ApplicationEntitlement): Promise<void> {
    await this.repository.delete(entitlement.id.value);
  }
}
