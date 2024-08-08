
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "usuarios" })
export class Usuario {
  @Column({ length: 60 })
  name!: string;

  @PrimaryColumn({ length: 60 })
  email!: string;

  @Column({ length: 60 })
  senha!: string;

  @Column("bytea", { nullable: true })
  salt?: number[];

  valido(confirmacao: string) {
    return this.senha === confirmacao;
  }
}