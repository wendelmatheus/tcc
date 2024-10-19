import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { getAPIClient } from "./api/axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import NavbarDashboard from "@/view/components/navbarDashboard";
import HeaderDashboard from "@/view/components/headerDashboard";
import SidebarDashboard from "@/view/components/sidebarDashboard";

// Define a interface para o tipo de denuncia
interface Denuncia {
  id: string;
  assunto: string;
  mensagem: string;
  status: string;
  data_criacao: Date; // ou string, dependendo de como você está tratando a data
}

const navigation = [
  { name: 'Home', href: '/', emoji: "🏠" },
  { name: 'Escrever artigo', href: '#', emoji: '📝' },
  { name: 'Ver denúncias', href: '/ver-denuncias', emoji: '🔍' }
];

export default function VerDenuncias() {

  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);

  async function fetchDenuncias() {
    const apiClient = getAPIClient();

    const response = await apiClient.get("/api/verDenuncias");
    setDenuncias(response.data);
  }

  useEffect(() => {
    fetchDenuncias();
  }, []);

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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarDashboard />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <HeaderDashboard titulo="Denúncias" />

        {/* Content */}
        <main className="flex-1 p-6 bg-gray-100">
  {/* Seção para Denúncias Recebidas */}
  <section className="mb-10">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">Denúncias Recebidas</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {denuncias
        .filter(denuncia => denuncia.status === "Recebido")
        .map((denuncia) => (
          <Link key={denuncia.id} href={`/responder-denuncia?id=${denuncia.id}`}>
            <div className="bg-white p-4 rounded-md shadow-md cursor-pointer hover:shadow-lg transition-shadow h-48 flex flex-col justify-between">
              <h3 className="text-lg font-semibold text-gray-700">{denuncia.assunto}</h3>
              <p className="text-gray-600 truncate">{denuncia.mensagem}</p>
              <p className="text-gray-500">Status: {denuncia.status}</p>
              <p className="text-gray-500">Data: {formatarData(denuncia.data_criacao)}</p>
            </div>
          </Link>
        ))}
    </div>
  </section>

  {/* Seção para Denúncias Respondidas */}
  <section>
    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">Denúncias Respondidas</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {denuncias
        .filter(denuncia => denuncia.status === "Respondida")
        .map((denuncia) => (
          <Link key={denuncia.id} href={`/responder-denuncia?id=${denuncia.id}`}>
            <div className="bg-white p-4 rounded-md shadow-md cursor-pointer hover:shadow-lg transition-shadow h-48 flex flex-col justify-between">
              <h3 className="text-lg font-semibold text-gray-700">{denuncia.assunto}</h3>
              <p className="text-gray-600 truncate">{denuncia.mensagem}</p>
              <p className="text-gray-500">Status: {denuncia.status}</p>
              <p className="text-gray-500">Data: {formatarData(denuncia.data_criacao)}</p>
            </div>
          </Link>
        ))}
    </div>
  </section>
</main>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
};
