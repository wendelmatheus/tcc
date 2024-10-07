import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "denunciantes" })
export class Denunciante {
  @PrimaryColumn({ length: 36 })
  id!: string;

  @Column({ length: 60 })
  nome!: string;

  @Column({ length: 60 })
  email!: string;
}
