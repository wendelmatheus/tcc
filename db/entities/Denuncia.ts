import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "denuncias" })
export class Denuncia {
  @PrimaryColumn({ length: 36 })
  id!: string;

  @Column({ length: 255 })
  nome!: string;

  @Column({ length: 255 })
  email!: string;

  @Column({ length: 255 })
  assunto!: string;

  @Column("text")
  mensagem!: string;

  @Column({ length: 64, nullable: true })
  imagem?: string;

  @Column({ length: 50, default: "recebido" })
  status!: string;

  @Column("text", { nullable: true })
  resposta?: string;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  data_criacao!: Date;
}
