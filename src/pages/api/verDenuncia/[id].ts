import type { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource } from '../../../../db/controller/conexaoBanco';
import { Denuncia } from '../../../../db/entities/Denuncia';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Extraindo o id da query

  // Verifica se o id é uma string
  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'ID inválido' });
  }

  const conexao = await AppDataSource;

  if (conexao) {
    try {
      const repositorio = conexao.getRepository(Denuncia);
      const denuncia = await repositorio.findOne({
        where: { id },
        relations: ["denunciante"], // Incluindo a relação com o denunciante
      });

      if (!denuncia) {
        return res.status(404).json({ message: 'Denúncia não encontrada' });
      }

      return res.status(200).json(denuncia);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ message: 'Erro ao buscar a denúncia' });
    }
  } else {
    return res.status(500).json({ message: 'Falha na conexão com o banco de dados' });
  }
}
