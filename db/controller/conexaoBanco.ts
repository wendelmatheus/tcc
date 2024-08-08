import "reflect-metadata"
import { DataSource } from "typeorm"
import { Usuario } from "../entities/Usuario"
import { Artigo } from "../entities/Artigo"
import { Denuncia } from "../entities/Denuncia"

const _AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.USUARIO_BANCO,
    password: process.env.SENHA_BANCO,
    database: process.env.NOME_BANCO,
    synchronize: true,
    logging: true,
    entities: [Usuario, Artigo, Denuncia],
    migrations: [],
    subscribers: [],
})

export const AppDataSource = _AppDataSource.initialize();