import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "artigos" })
export class Artigo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  titulo!: string;

  @Column("text")
  texto!: string;

  @Column({ length: 64, nullable: true })
  imagem?: string;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  data_criacao!: Date;
}
