import type { NextApiRequest, NextApiResponse } from 'next'
import { AppDataSource } from '../../../db/controller/conexaoBanco';
import { Denunciante } from '../../../db/entities/Denunciante';
 
function verificarDados(nome: string | undefined, email: string | undefined) {
    return (nome ?? "") !== "" && (email ?? "") !== "";
  }
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    const { nome, email } = req.body;

    const conexao = await AppDataSource;

    if(conexao) {
        if(verificarDados(nome, email)) {
            const repositorio = conexao.getRepository(Denunciante);

            const salvar = repositorio.create({
                nome: nome,
                email: email,
            });

            try {
                await repositorio.save(salvar);
                res.status(200).end();
              } catch (erro) {
                  throw erro;
              }
        } else {
            res.status(400).end();
        }
    } else {
        res.status(500).end();
    }

  res.status(200).json({ message: 'Hello from Next.js!' })
}