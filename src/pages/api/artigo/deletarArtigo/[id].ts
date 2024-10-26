import type { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource } from '../../../../../db/controller/conexaoBanco';
import { Artigo } from '../../../../../db/entities/Artigo';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Extrai o `id` do artigo da URL

  // Verifica o método da requisição
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const conexao = await AppDataSource;

  if (conexao) {
    try {
      const repositorioArtigo = conexao.getRepository(Artigo);

      // Encontra o artigo com o `id` especificado
      const artigo = await repositorioArtigo.findOneBy({ id: Number(id) });
      
      if (!artigo) {
        return res.status(404).json({ message: "Artigo não encontrado" });
      }

      // Remove o artigo encontrado
      await repositorioArtigo.remove(artigo);
      return res.status(200).json({ message: "Artigo deletado com sucesso!" });
    } catch (erro) {
      console.error("Erro ao deletar artigo:", erro);
      return res.status(500).json({ message: "Erro ao deletar o artigo" });
    }
  } else {
    return res.status(500).json({ message: "Falha na conexão com o banco de dados" });
  }
}
