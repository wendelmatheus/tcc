import { log } from "console";
import { NextApiRequest, NextApiResponse } from "next";
import { Usuario } from "../../../db/entities/Usuario";
import { AppDataSource } from "../../../db/controller/conexaoBanco";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

function verificarDados(email: string | undefined, senha: string | undefined) {
  return (email ?? "") !== "" && (senha ?? "") !== "";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  const { email: emailUsuario, senha: senhaUsuario } = req.body;
  const conexao = await AppDataSource;
  if (conexao) {
    if (verificarDados(emailUsuario, senhaUsuario)) {
      const repositorio = conexao.getRepository(Usuario);

      const user = await repositorio.findOneBy({ email: emailUsuario });

      if (user == null) {
        // usuário não cadastado
        res.status(404).end();
      } else {
        // aqui, o usuário está no banco. Preciso ver se o hash da senha digitada pelo usuário bate com a hash que está no banco
        // calcular o hash que o usuário acabou de digitar
        const dataUsuario = `${senhaUsuario}${user.salt?.map((item) => item)}`;
        const hashSaltUsuario: string = crypto.createHash("sha256").update(dataUsuario).digest("base64");

        console.log(hashSaltUsuario, user.senha);
        console.log("Salt: ", `${Array.from(crypto.randomBytes(16))}`);
        console.log("Salt: ", `${dataUsuario}`);
        // comparar para ver se é o mesmo do banco
        if (hashSaltUsuario == user.senha) {

          const chaveSecreta = process.env.CHAVE_SECRETA;

          const token = jwt.sign({ nome: user.name, email: user.email }, chaveSecreta!, { expiresIn: "1h" });
          //const token = jwt.sign({ nome: user.name, email: user.email }, );

          res.status(200).json({ token, nome: user.name, email: user.email, imagem: user.imagem });
        } else {
          // se não, não logar e informar o usuário
          res.status(401).end();
        }
      }
    } else {
      res.status(400).end();
    }
  } else {
    res.status(500).end();
  }
}