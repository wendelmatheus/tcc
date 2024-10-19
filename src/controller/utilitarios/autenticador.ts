import type { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';

export function autenticar(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Token inválido ou não fornecido HAHAHA' });
    return false;
  }

  try {
    const secret = process.env.CHAVE_SECRETA;
    const usuario = verify(token, secret ?? "");
    return usuario;
  } catch (error) {
    res.status(401).json({ message: 'Token inválido ou expirado HEHEHE' });
    return false;
  }
}
