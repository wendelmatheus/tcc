import type { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource } from '../../../db/controller/conexaoBanco';
import { Artigo } from '../../../db/entities/Artigo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const conexao = await AppDataSource;

  if (conexao) {
    try {
      const repositorio = conexao.getRepository(Artigo);
      const artigos = await repositorio.find();
      res.status(200).json(artigos);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ message: 'Erro ao buscar artigos' });
    }
  } else {
    res.status(500).json({ message: 'Falha na conexão com o banco de dados' });
  }
}
