import type { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource } from '../../../db/controller/conexaoBanco';
import { Denunciante } from '../../../db/entities/Denunciante';
import { Denuncia } from '../../../db/entities/Denuncia';
import { v4 as uuidv4 } from 'uuid';

function verificarDados(nome: string | undefined, email: string | undefined, assunto: string | undefined, mensagem: string | undefined) {
  return (
    (nome ?? '') !== '' &&
    (email ?? '') !== '' &&
    (assunto ?? '') !== '' &&
    (mensagem ?? '') !== ''
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { nome, email, assunto, mensagem } = req.body;

  const conexao = await AppDataSource;

  if (conexao) {
    if (verificarDados(nome, email, assunto, mensagem)) {
      const repositorioDenunciante = conexao.getRepository(Denunciante);

      try {
        let denunciante = await repositorioDenunciante.findOneBy({ email });

        if (!denunciante) {
          denunciante = repositorioDenunciante.create({
            nome,
            email,
          });
          await repositorioDenunciante.save(denunciante);
        }

        const repositorioDenuncia = conexao.getRepository(Denuncia);

        const idDenuncia = uuidv4()

        const salvarDenuncia = repositorioDenuncia.create({
          id: idDenuncia,
          assunto,
          mensagem,
          status: 'Recebido',
          resposta: '',
          data_criacao: new Date(),
          denunciante,
        });

        await repositorioDenuncia.save(salvarDenuncia);

        return res.status(200).json({ message: `Denúncia cadastrada com sucesso! Código da denúncia: ${idDenuncia}`, id: idDenuncia });
      } catch (erro) {
        console.error(erro);
        res.status(500).end();
      }
    } else {
      res.status(400).json({ message: 'Dados incompletos' });
    }
  } else {
    res.status(500).json({ message: 'Falha na conexão com o banco de dados' });
  }
}
