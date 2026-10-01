import { EntityId } from "../../../../../../shared/domain/value-objects/EntityId";

import { Application } from "../../../../domain/entities/Application";
import { ApplicationCode } from "../../../../domain/value-objects/ApplicationCode";

import { ApplicationOrmEntity } from "../entities/ApplicationOrmEntity";

export class ApplicationMapper {
  public static toDomain(
    entity: ApplicationOrmEntity,
  ): Application {
    return Application.reconstitute(
      {
        code: ApplicationCode.create(
          entity.code,
        ),

        name: entity.name,

        description:
          entity.description ?? undefined,

        status: entity.status as
          | "active"
          | "inactive",
      },
      EntityId.create(entity.id),
    );
  }

  public static toPersistence(
    application: Application,
  ): ApplicationOrmEntity {
    const entity = new ApplicationOrmEntity();

    entity.id = application.id.value;
    entity.code = application.code.value;
    entity.name = application.name;
    entity.description =
      application.description ?? null;
    entity.status = application.status;

    return entity;
  }
}