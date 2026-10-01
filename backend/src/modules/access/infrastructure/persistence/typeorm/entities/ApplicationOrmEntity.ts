import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
} from "typeorm";

@Entity("access_applications")
export class ApplicationOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Index({ unique: true })
  @Column({
    type: "varchar",
    length: 32,
  })
  code!: string;

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

  @Index()
  @Column({
    type: "varchar",
    length: 20,
  })
  status!: string;
}