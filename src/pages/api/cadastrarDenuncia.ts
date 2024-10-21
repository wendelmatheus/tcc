import type { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource } from '../../../db/controller/conexaoBanco';
import { Denunciante } from '../../../db/entities/Denunciante';
import { Denuncia } from '../../../db/entities/Denuncia';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

// Função para enviar e-mail diretamente
async function enviarEmailDenunciante(email: string, nome: string, idDenuncia: string, assunto: string, mensagem: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="color: #3b82f6; text-align: center;">Sua denúncia foi feita com sucesso!</h2>
      
      <p style="font-size: 16px; color: #333;">Olá, <strong>${nome}</strong>!</p>
      <p style="font-size: 16px; color: #333;">Recebemos a sua denúncia e responderemos o mais rápido possível.</p>
      <p style="font-size: 16px; color: #333;">Abaixo seguem os dados:</p>

      <div style="padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px;">
        <div style="padding: 8px 0;">
          <p style="margin: 0; font-weight: bold;">Código da Denúncia</p>
          <p style="margin: 4px 0;">${idDenuncia}</p>
        </div>  

        <div style="padding: 8px 0;">
          <p style="margin: 0; font-weight: bold;">Assunto</p>
          <p style="margin: 4px 0;">${assunto}</p>
        </div>  

        <div style="padding: 8px 0;">
          <p style="margin: 0; font-weight: bold;">Mensagem</p>
          <p style="margin: 4px 0;">${mensagem}</p>
        </div>  
      </div>

      <p style="font-size: 16px; color: #333;">Assim que aprovarmos a sua denúncia, você pode acessar em nosso site, na página "Denuncias", e inserir o código na barra de pesquisa para visualizar. Também enviaremos um e-mail quando respondermos.</p>

            
      <p style="font-size: 14px; color: #777; text-align: center;">Atenciosamente,<br>Equipe Pet Denuncie</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Confirmação de Denúncia: ${idDenuncia}`,
      html: emailContent,
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
}

// Função para verificar se os dados estão completos
function verificarDados(nome: string | undefined, email: string | undefined, assunto: string | undefined, mensagem: string | undefined) {
  return (
    (nome ?? '') !== '' &&
    (email ?? '') !== '' &&
    (assunto ?? '') !== '' &&
    (mensagem ?? '') !== ''
  );
}

// Função principal para manipular a requisição
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

        const idDenuncia = uuidv4();

        const salvarDenuncia = repositorioDenuncia.create({
          id: idDenuncia,
          assunto,
          mensagem,
          status: 'Aguardando',
          resposta: '',
          data_criacao: new Date(),
          denunciante,
        });

        await repositorioDenuncia.save(salvarDenuncia);

        // Enviar e-mail para o denunciante
        await enviarEmailDenunciante(email, nome, idDenuncia, assunto, mensagem);

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
