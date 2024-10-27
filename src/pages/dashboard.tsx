import { GetServerSideProps } from "next";
import HeaderDashboard from "@/view/components/headerDashboard";
import SidebarDashboard from "@/view/components/sidebarDashboard";
import { withAuth } from "@/controller/utilitarios/utils";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [denunciasStats, setDenunciasStats] = useState({
    total: 0,
    recebidas: 0,
    respondidas: 0,
    aguardando: 0,
  });
  const [artigosCount, setArtigosCount] = useState(0);

  interface Denuncia {
    id: string;
    assunto: string;
    mensagem: string;
    status: string;
    data_criacao: Date;
  }

  useEffect(() => {
    async function fetchData() {
      // Fetch denúncias
      const resDenuncias = await fetch("/api/denuncia/verDenuncias");
      const denuncias = await resDenuncias.json();
      const total = denuncias.length;
      const recebidas = denuncias.filter((d: { status: string; }) => d.status === "Recebido").length;
      const respondidas = denuncias.filter((d: { status: string; }) => d.status === "Respondida").length;
      const aguardando = denuncias.filter((d: { status: string; }) => d.status === "Aguardando").length;

      setDenunciasStats({ total, recebidas, respondidas, aguardando });

      // Fetch artigos
      const resArtigos = await fetch("/api/artigo/verArtigos");
      const artigos = await resArtigos.json();
      setArtigosCount(artigos.length);
    }
    fetchData();
  }, []);

  const cards = [
    { titulo: "Total de Denúncias", conteudo: denunciasStats.total },
    { titulo: "Denúncias Recebidas", conteudo: denunciasStats.recebidas },
    { titulo: "Denúncias Respondidas", conteudo: denunciasStats.respondidas },
    { titulo: "Denúncias Aguardando Aprovação", conteudo: denunciasStats.aguardando },
    { titulo: "Total de Artigos", conteudo: artigosCount },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarDashboard />
      <div className="flex-1 flex flex-col">
        <HeaderDashboard />
        <main className="flex-1 p-6 bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-md shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{item.titulo}</h3>
                <p className="text-2xl font-bold text-gray-900">{item.conteudo}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth;
