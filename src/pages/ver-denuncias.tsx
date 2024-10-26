import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { getAPIClient } from "./api/axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import HeaderDashboard from "@/view/components/headerDashboard";
import SidebarDashboard from "@/view/components/sidebarDashboard";
import { Spinner } from "@/view/components/spinner";
import { formatarData, withAuth } from "@/controller/utilitarios/utils";

interface Denuncia {
  id: string;
  assunto: string;
  mensagem: string;
  status: string;
  data_criacao: Date;
}

export default function VerDenuncias() {

  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(true)

  async function fetchDenuncias() {
    setLoading(true);
    const apiClient = getAPIClient();
  
    try {
      const response = await apiClient.get("/api/denuncia/verDenuncias");
      const data = response.data;
  
      const sortedData = data.sort((a: Denuncia, b: Denuncia) => {
        return new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime();
      });
  
      setDenuncias(sortedData);
    } catch (error) {
      console.error("Erro ao buscar as denúncias:", error);
    } finally {
      setLoading(false);
    }
  }
  

  useEffect(() => {
    fetchDenuncias();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">

      <SidebarDashboard />
      <div className="flex-1 flex flex-col">

        <HeaderDashboard titulo="Denúncias" />

        <main className="flex-1 p-6 bg-gray-100">
          
          {loading
            ? <Spinner />
            : <>
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

              <section className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">Denúncias aguardando aprovação</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {denuncias
                    .filter(denuncia => denuncia.status === "Aguardando")
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
            </>
          }
        </main>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth;
