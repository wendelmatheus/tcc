import type { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource } from '../../../db/controller/conexaoBanco';
import { Denuncia } from '../../../db/entities/Denuncia';

function verificarDados(id: string | undefined, status: string | undefined) {
  return (
    (id ?? '') !== '' &&
    (status ?? '') !== ''
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, status } = req.body;

  const conexao = await AppDataSource;

  if (conexao) {
    if (verificarDados(id, status)) {
      const repositorioDenuncia = conexao.getRepository(Denuncia);

      try {
        let denuncia = await repositorioDenuncia.findOneBy({ id });

        if (!denuncia) {
          return res.status(404).json({ message: 'Denúncia não encontrada' });
        }

        denuncia.status = status;
        await repositorioDenuncia.save(denuncia);

        return res.status(200).json({ message: `Status da denúncia alterado com sucesso! Código da denúncia: ${id}` });
      } catch (erro) {
        console.error('Erro ao atualizar o status:', erro);
        return res.status(500).json({ message: 'Erro ao atualizar o status da denúncia' });
      }
    } else {
      return res.status(400).json({ message: 'Dados incompletos' });
    }
  } else {
    return res.status(500).json({ message: 'Falha na conexão com o banco de dados' });
  }
}
