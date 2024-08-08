import { NextApiRequest, NextApiResponse } from "next";
import { Usuario } from "../../../db/entities/Usuario";
import { AppDataSource } from "../../../db/controller/conexaoBanco";
import { QueryFailedError } from "typeorm";
import * as crypto from "crypto";

function verificarDados(nome: string | undefined, email: string | undefined, senha: string | undefined) {
  return (nome ?? "") !== "" && (email ?? "") !== "" && (senha ?? "") !== "";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  const { nome, email, senha } = req.body;

  const conexao = await AppDataSource;
  if (conexao) {
    if (verificarDados(nome, email, senha)) {
      // Calcular o hash com salt

      const salt = Array.from(crypto.randomBytes(16));
      const data = `${senha}${salt}`;
      const hashSalt: string = crypto.createHash("sha256").update(data).digest("base64");

      const repositorio = conexao.getRepository(Usuario);
      const salvar = repositorio.create({ name: nome, email, senha: hashSalt, salt });
      try {
        await repositorio.insert(salvar);
        res.status(202).end();
      } catch (erro) {
        if (erro instanceof QueryFailedError && erro.message.includes("duplicate key value violates unique constraint")) {
          res.status(409).end();
        } else {
          throw erro;
        }
      }
    } else {
      res.status(400).end();
    }
  } else {
    res.status(500).end();
  }
}