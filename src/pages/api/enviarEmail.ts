import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { to, subject, text } = req.body;
  if (!to || !subject || !text) {
    return res.status(400).json({ message: 'Parâmetros de email incompletos' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASSWORD, 
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER, 
      to,
      subject, 
      text,
    });

    res.status(200).json({ message: 'Email enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ message: 'Erro ao enviar email', error });
  }
}
