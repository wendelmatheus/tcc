import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../controller/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { file, fileName } = req.body;
    const fileBuffer = Buffer.from(file, 'base64');

    // Upload da imagem no Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('imagens-usuarios')
      .upload(fileName, fileBuffer, {
        contentType: 'image/jpeg', // Altere o tipo de conteúdo conforme necessário
        upsert: true,
      });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    // Gerar o link público da imagem
    const { publicUrl } = supabase.storage
      .from('imagens-usuarios')
      .getPublicUrl(fileName).data;

    // Retornar a URL pública para o frontend
    return res.status(200).json({ url: publicUrl });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

