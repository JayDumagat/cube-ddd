import "reflect-metadata";
import { DataSource } from "typeorm";

import { ApplicationOrmEntity } from "../../../modules/access/infrastructure/persistence/typeorm/entities/ApplicationOrmEntity";
import { ApplicationEntitlementOrmEntity } from "../../../modules/access/infrastructure/persistence/typeorm/entities/ApplicationEntitlementOrmEntity";
import { AccessPolicyOrmEntity } from "../../../modules/access/infrastructure/persistence/typeorm/entities/AccessPolicyOrmEntity";

import { env } from "../config/env";

export const AppDataSource = new DataSource({
  type: "postgres",

  host: env.database.host,
  port: env.database.port,
  username: env.database.username,
  password: env.database.password,
  database: env.database.name,

  synchronize: false,

  logging:
    env.nodeEnv === "development",

  entities: [
    ApplicationOrmEntity,
    ApplicationEntitlementOrmEntity,
    AccessPolicyOrmEntity
  ],

  migrations: [
    "src/shared/infrastructure/database/migrations/*{.ts,.js}",
  ],

  migrationsTableName: "migrations",
});