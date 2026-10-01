import type { Repository as TypeOrmRepository } from "typeorm";

import { AppDataSource } from "../../../../../../shared/infrastructure/database/data-source";
import type { EntityId } from "../../../../../../shared/domain/value-objects/EntityId";

import type { ApplicationRepository } from "../../../../domain/repositories/ApplicationRepository";
import type { Application } from "../../../../domain/entities/Application";
import type { ApplicationCode } from "../../../../domain/value-objects/ApplicationCode";

import { ApplicationOrmEntity } from "../entities/ApplicationOrmEntity";
import { ApplicationMapper } from "../mappers/ApplicationMapper";

export class TypeOrmApplicationRepository implements ApplicationRepository {
  private readonly repository: TypeOrmRepository<ApplicationOrmEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ApplicationOrmEntity);
  }

  public async findById(id: EntityId): Promise<Application | null> {
    const entity = await this.repository.findOne({
      where: {
        id: id.value,
      },
    });

    return entity ? ApplicationMapper.toDomain(entity) : null;
  }

  public async findByIds(ids: EntityId[]): Promise<Application[]> {
    if (ids.length === 0) {
      return [];
    }

    const entities = await this.repository
      .createQueryBuilder("application")
      .where("application.id IN (:...ids)", {
        ids: ids.map((id) => id.value),
      })
      .getMany();

    return entities.map(ApplicationMapper.toDomain);
  }

  public async findByCode(code: ApplicationCode): Promise<Application | null> {
    const entity = await this.repository.findOne({
      where: {
        code: code.value,
      },
    });

    return entity ? ApplicationMapper.toDomain(entity) : null;
  }

  public async existsByCode(code: ApplicationCode): Promise<boolean> {
    return this.repository.exists({
      where: {
        code: code.value,
      },
    });
  }

  public async save(application: Application): Promise<void> {
    const entity = ApplicationMapper.toPersistence(application);

    await this.repository.save(entity);
  }

  public async remove(application: Application): Promise<void> {
    await this.repository.delete(application.id.value);
  }
}
