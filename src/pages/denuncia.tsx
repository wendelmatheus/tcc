import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Navbar from "@/view/components/navbar";
import { formatarData } from '@/controller/utilitarios/utils';

interface Denunciante {
    nome: string;
    email: string;
}
  
interface Denuncia {
  id: string;
  assunto: string;
  mensagem: string;
  status: string;
  data_criacao: string;
  resposta: string;
  denunciante: Denunciante;
}

export default function Denuncia({ denuncia }: { denuncia: Denuncia }) {

  const data = [
    { titulo: 'Código', subtitulo: `${denuncia.id}` },
    { titulo: 'Assunto', subtitulo: `${denuncia.assunto}` },
    { titulo: 'Status', subtitulo: `${denuncia.status}` },
    { titulo: 'Data', subtitulo: `${denuncia.data_criacao}` },
    { titulo: 'Mensagem', subtitulo: `${denuncia.mensagem}` }
  ];

  if (!denuncia) {
    return <div>Denúncia não encontrada</div>;
  }

  return (
    <div className="bg-gray-700 min-h-screen">
      <Navbar />
      <main className="container mx-auto p-6">
        <div className="bg-gray-200 p-6 rounded-md shadow-md">
          <h1 className="text-gray-700 text-xl font-bold mb-4">Detalhes da Denúncia</h1>

          {data.map((item) => (
            <div className="text-gray-600 p-2">
              <p><strong>{item.titulo}</strong></p>
              <p>{item.subtitulo}</p>
            </div>
          ))}

          {denuncia.resposta !== "" && <div className="text-gray-600 p-2">
            <p><strong>Resposta</strong></p>
            <p>{denuncia.resposta}</p>
          </div>}


        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const response = await fetch(`http://localhost:3000/api/denuncia/verDenuncia/${id}`);
  const denuncia = await response.json();

  return {
    props: { denuncia },
  };
};
