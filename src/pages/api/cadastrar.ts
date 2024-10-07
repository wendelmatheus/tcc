import { NextApiRequest, NextApiResponse } from "next";
import { AppDataSource } from "../../../db/controller/conexaoBanco";
import { QueryFailedError } from "typeorm";
import * as crypto from "crypto";
import { Administrador } from "../../../db/entities/Administrador";

function verificarDados(nome: string | undefined, email: string | undefined, senha: string | undefined) {
  return (nome ?? "") !== "" && (email ?? "") !== "" && (senha ?? "") !== "";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { nome, email, senha } = req.body;

  const conexao = await AppDataSource;
  if (conexao) {
    if (verificarDados(nome, email, senha)) {

      const salt = Array.from(crypto.randomBytes(16));
      const data = `${senha}${salt}`;
      const hashSalt: string = crypto.createHash("sha256").update(data).digest("base64");

      const repositorio = conexao.getRepository(Administrador);
      const salvar = repositorio.create({
         name: nome,
         email: email,
         senha: hashSalt, 
         salt: salt
        });
      try {
        await repositorio.insert(salvar);
        res.status(200).end();
      } catch (erro) {
        if (erro instanceof QueryFailedError && erro.message
            .includes("duplicate key value violates unique constraint")) {
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