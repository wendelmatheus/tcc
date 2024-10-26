import type { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource } from '../../../../db/controller/conexaoBanco';
import { Denuncia } from '../../../../db/entities/Denuncia';
import { verify } from 'jsonwebtoken';
import { autenticar } from '@/controller/utilitarios/utils';

function verificarDados(resposta: string | undefined, idDenuncia: string | undefined) {
  return (
    (resposta ?? '') !== '' &&
    (idDenuncia ?? '') !== ''
  );
}

function verificarToken(req: NextApiRequest) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return null;
  }
  
  try {
    const secret = process.env.CHAVE_SECRETA;
    return verify(token, secret ?? "");
  } catch (error) {
    return null; 
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const usuario = autenticar(req, res);
  if (!usuario) {
    return;
  }

  const { idDenuncia, resposta } = req.body;

  const conexao = await AppDataSource;

  if (conexao) {
    if (verificarDados(idDenuncia, resposta)) {
      const repositorio = conexao.getRepository(Denuncia);

      try {
        let denuncia = await repositorio.findOneBy({ id: idDenuncia });

        if (!denuncia) {
          return res.status(404).json({ message: 'Denúncia não encontrada' });
        }

        denuncia.resposta = resposta;
        denuncia.status = 'Respondida';

        await repositorio.save(denuncia);

        return res.status(200).json({ message: 'Denúncia respondida com sucesso' });
      } catch (erro) {
        console.error(erro);
        res.status(500).end();
      }
    } else {
      res.status(400).json({ message: 'Dados incompletos' });
    }
  } else {
    res.status(500).end();
  }
}
