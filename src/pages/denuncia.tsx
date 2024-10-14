import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Navbar from "@/view/components/navbar";

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
  const router = useRouter();

  if (!denuncia) {
    return <div>Denúncia não encontrada</div>;
  }

  const formatarData = (data: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // Para evitar o formato AM/PM
    };
    return new Date(data).toLocaleString('pt-BR', options);
  };

  return (
    <div className="bg-gray-700 min-h-screen">
      <Navbar />
      <main className="container mx-auto p-6">
        <div className="bg-gray-200 p-6 rounded-md shadow-md">
          <h1 className="text-gray-700 text-xl font-bold mb-4">Detalhes da Denúncia</h1>
          <div className="text-gray-600 p-2">
            <p><strong>Código</strong></p>
            <p>{denuncia.id}</p>
          </div>

          <div className="text-gray-600 p-2">
            <p><strong>Assunto</strong></p>
            <p>{denuncia.assunto}</p>
          </div>

          <div className="text-gray-600 p-2">
            <p><strong>Status</strong></p>
            <p>{denuncia.status}</p>
          </div>

          <div className="text-gray-600 p-2">
            <p><strong>Data</strong></p>
            <p>{formatarData(denuncia.data_criacao)}</p>
          </div>

          <div className="text-gray-600 p-2">
            <p><strong>Mensagem</strong></p>
            <p>{denuncia.mensagem}</p>
          </div>

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

  const response = await fetch(`http://localhost:3000/api/verDenuncia/${id}`);
  const denuncia = await response.json();

  return {
    props: { denuncia },
  };
};
