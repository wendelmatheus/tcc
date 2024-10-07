import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { Denunciante } from "./Denunciante";

@Entity({ name: "denuncias" })
export class Denuncia {
  @PrimaryColumn({ length: 36 })
  id!: string;

  @Column({ length: 60 })
  assunto!: string;

  @Column("text")
  mensagem!: string;

  @Column({ length: 60, default: "recebido" })
  status!: string;

  @Column("text", { nullable: true })
  resposta?: string;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  data_criacao!: Date;

  @ManyToOne(() => Denunciante, (denunciante) => denunciante.id)
  denunciante!: Denunciante; 
}
