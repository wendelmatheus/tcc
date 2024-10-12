import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "denunciantes" })
export class Denunciante {
  @PrimaryColumn({ length: 60 })
  email!: string;
  
  @Column({ length: 60 })
  nome!: string;
}
