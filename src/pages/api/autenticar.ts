import { NextApiRequest, NextApiResponse } from "next";
import { AppDataSource } from "../../../db/controller/conexaoBanco";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { Administrador } from "../../../db/entities/Administrador";

function verificarDados(email: string | undefined, senha: string | undefined) {
  return (email ?? "") !== "" && (senha ?? "") !== "";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { email: emailUsuario, senha: senhaUsuario } = req.body;

  const conexao = await AppDataSource;
  if (conexao) {
    if (verificarDados(emailUsuario, senhaUsuario)) {
      
      const repositorio = conexao.getRepository(Administrador);
      const user = await repositorio.findOneBy({ email: emailUsuario });

      if (user == null) res.status(404).end();
       else {
        const dataUsuario = `${senhaUsuario}${user.salt?.map((item) => item)}`;
        const hashSaltUsuario: string = crypto.createHash("sha256").update(dataUsuario)
          .digest("base64");

        if (hashSaltUsuario == user.senha) {

          const chaveSecreta = process.env.CHAVE_SECRETA;

          const token = jwt.sign(
            { nome: user.name, 
              email: user.email
            }, 
              chaveSecreta!,
             { expiresIn: "1h" });

          res.status(200).json({ token, nome: user.name, email: user.email });
        } else res.status(401).end();
      }
    } else {
      res.status(400).end();
    }
  } else {
    res.status(500).end();
  }
}