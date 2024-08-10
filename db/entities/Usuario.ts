import { Entity, Column, PrimaryColumn, OneToMany, Relation } from "typeorm";
@Entity({ name: "usuarios" })
export class Usuario {
  @Column({ length: 60 })
  name!: string;

  @PrimaryColumn({ length: 60 })
  email!: string;

  @Column({ length: 64 })
  senha!: string;

  @Column({ nullable: true })
  imagem?: string;

  @Column("bytea", {
    nullable: true,
    transformer: {
      from: (value: Buffer): number[] => Array.from(new Uint8Array(value)),
      to: (value: number[]): Buffer => Buffer.from(value),
    },
  })
  salt?: number[];
}

// import { Entity, Column, PrimaryColumn } from "typeorm";

// @Entity({ name: "usuarios" })
// export class Usuario {
//   @Column({ length: 60 })
//   name!: string;

//   @PrimaryColumn({ length: 60 })
//   email!: string;

//   @Column({ length: 60 })
//   senha!: string;

//   @Column("bytea", { nullable: true })
//   salt?: number[];

//   valido(confirmacao: string) {
//     return this.senha === confirmacao;
//   }
// }