import type { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";
import { getAPIClient } from "../../pages/api/axios";

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

export const formatarData = (data: string | Date) => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  return new Date(data).toLocaleString('pt-BR', options);
};

export async function withAuth(ctx: GetServerSidePropsContext) {
  const apiClient = getAPIClient(ctx);
  const { ["sitededenuncias.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  await apiClient.get("/api/hello");

  return {
    props: {},
  };
}
