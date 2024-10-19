import type { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource } from '../../../db/controller/conexaoBanco';
import { Denuncia } from '../../../db/entities/Denuncia';
import { Artigo } from '../../../db/entities/Artigo';
import { autenticar } from '@/controller/utilitarios/autenticador';

function verificarDados(titulo: string | undefined, texto: string | undefined) {
  return (
    (titulo ?? '') !== '' &&
    (texto ?? '') !== ''
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const usuario = autenticar(req, res);
  if (!usuario) {
    return;
  }

  const { titulo, texto } = req.body;

  const conexao = await AppDataSource;

  if (conexao) {
    if (verificarDados(titulo, texto)) {
      const repositorio = conexao.getRepository(Artigo);

      const salvar = repositorio.create({
        titulo: titulo,
        texto: texto
      });

      try {
        await repositorio.insert(salvar);
        res.status(200).json({ message: 'Artigo cadastrado com sucesso!' });
      } catch (erro) {
        console.error(erro);
        res.status(500).json({ message: 'Erro ao cadastrar artigo.' });
      }
    } else {
      res.status(400).json({ message: 'Dados incompletos' });
    }
  } else {
    res.status(500).json({ message: 'Falha na conexão com o banco de dados' });
  }
}
