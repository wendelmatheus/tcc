import type { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource } from '../../../../db/controller/conexaoBanco';
import { Denuncia } from '../../../../db/entities/Denuncia';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const conexao = await AppDataSource;

  if (conexao) {
    try {
      const repositorio = conexao.getRepository(Denuncia);
      const denuncias = await repositorio.find();
      res.status(200).json(denuncias);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ message: 'Erro ao buscar denúncias' });
    }
  } else {
    res.status(500).json({ message: 'Falha na conexão com o banco de dados' });
  }
}
