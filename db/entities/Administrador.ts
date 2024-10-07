import { Entity, Column, PrimaryColumn, OneToMany, Relation } from "typeorm";
@Entity({ name: "administrador" })
export class Administrador {

    @PrimaryColumn({ length: 60 })
    email!: string;

    @Column({ length: 60 })
    name!: string;

    @Column({ length: 64 })
    senha!: string;

    @Column("bytea", {
    nullable: true,
    transformer: {
        from: (value: Buffer): number[] => Array.from(new Uint8Array(value)),
        to: (value: number[]): Buffer => Buffer.from(value),
    },
    })
    salt?: number[];
}