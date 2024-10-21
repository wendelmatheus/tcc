import type { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource } from '../../../../db/controller/conexaoBanco';
import { Denuncia } from '../../../../db/entities/Denuncia';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const conexao = await AppDataSource;

  if (conexao) {
    try {
      const repositorioDenuncia = conexao.getRepository(Denuncia);
      const denuncia = await repositorioDenuncia.findOneBy({ id: id as string });

      if (!denuncia) {
        return res.status(404).json({ message: 'Denúncia não encontrada' });
      }

      await repositorioDenuncia.remove(denuncia);

      return res.status(200).json({ message: 'Denúncia apagada com sucesso!' });
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ message: 'Erro ao apagar denúncia.' });
    }
  } else {
    return res.status(500).json({ message: 'Falha na conexão com o banco de dados.' });
  }
}
