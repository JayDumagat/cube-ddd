import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
} from "typeorm";

@Entity("access_policies")
@Index(
  "idx_access_policies_application_status",
  ["applicationId", "status"],
)
export class AccessPolicyOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({
    type: "uuid",
  })
  applicationId!: string;

  @Column({
    type: "varchar",
    length: 150,
  })
  name!: string;

  @Column({
    type: "text",
    nullable: true,
  })
  description!: string | null;

  @Column({
    type: "varchar",
    length: 20,
  })
  status!: string;

  @Column({
    type: "jsonb",
  })
  criteria!: {
    departments?: string[];
    employeeLevels?: string[];
    jobFunctions?: string[];
    offices?: string[];
    employmentStatuses?: string[];
  };

  @Column({
    type: "timestamptz",
  })
  createdAt!: Date;

  @Column({
    type: "timestamptz",
  })
  updatedAt!: Date;
}