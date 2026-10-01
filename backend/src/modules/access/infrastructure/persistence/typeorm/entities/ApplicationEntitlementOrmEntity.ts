import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
} from "typeorm";

@Entity("access_entitlements")
@Index(
  "idx_access_entitlements_subject_application",
  ["tenantId", "objectId", "applicationId"],
)
@Index(
  "idx_access_entitlements_subject_status",
  ["tenantId", "objectId", "status"],
)
@Index(
  "idx_access_entitlements_policy_subject",
  ["policyId", "tenantId", "objectId"],
)
export class ApplicationEntitlementOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({
    type: "uuid",
  })
  applicationId!: string;

  @Column({
    type: "uuid",
  })
  tenantId!: string;

  @Column({
    type: "uuid",
  })
  objectId!: string;

  @Column({
    type: "varchar",
    length: 20,
  })
  status!: string;

  @Column({
    type: "varchar",
    length: 32,
  })
  source!: string;

  @Column({
    type: "timestamptz",
  })
  grantedAt!: Date;

  @Column({
    type: "timestamptz",
    nullable: true,
  })
  expiresAt!: Date | null;

  @Column({
    type: "uuid",
    nullable: true,
  })
  grantedByTenantId!: string | null;

  @Column({
    type: "uuid",
    nullable: true,
  })
  grantedByObjectId!: string | null;

  @Column({
    type: "text",
    nullable: true,
  })
  reason!: string | null;

  @Column({
    type: "uuid",
    nullable: true,
  })
  policyId!: string | null;

  @Column({
    type: "timestamptz",
    nullable: true,
  })
  revokedAt!: Date | null;

  @Column({
    type: "uuid",
    nullable: true,
  })
  revokedByTenantId!: string | null;

  @Column({
    type: "uuid",
    nullable: true,
  })
  revokedByObjectId!: string | null;

  @Column({
    type: "text",
    nullable: true,
  })
  revokeReason!: string | null;
}