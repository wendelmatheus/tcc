import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { getAPIClient } from "../api/axios";
import HeaderDashboard from "@/view/components/headerDashboard";
import SidebarDashboard from "@/view/components/sidebarDashboard";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { useState } from "react";
import { formatarData } from "@/controller/utilitarios/utils";

interface Artigo {
  id: string;
  titulo: string;
  texto: string;
  data_criacao: string;
}

export default function VisualizarArtigo({ artigo }: { artigo: Artigo }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmDelete = confirm("Tem certeza que deseja apagar este artigo?");

    if (confirmDelete) {
      setLoading(true);
      const apiClient = getAPIClient();

      try {
        const response = await apiClient.delete(`/api/deletarArtigo/${artigo.id}`);
        if (response.status === 200) {
          alert("Artigo apagado com sucesso!");
          window.location.href = "/blog/artigos";
        } else {
          alert("Erro ao apagar o artigo.");
        }
      } catch (error) {
        console.error("Erro ao apagar o artigo:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  const data = [
    { titulo: "Título", subtitulo: artigo.titulo },
    { titulo: "Data de Criação", subtitulo: formatarData(artigo.data_criacao) },
    { titulo: "Conteúdo", subtitulo: artigo.texto },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarDashboard />
      <div className="flex-1 flex flex-col">
        <HeaderDashboard titulo="Visualizar Artigo" />
        <main className="flex-1 p-6 bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 p-2">Detalhes do Artigo</h3>
            {data.map((item, index) => (
              <div className="p-2" key={index}>
                <p className="text-gray-800 font-semibold">{item.titulo}</p>
                <p className="text-gray-600">{item.subtitulo}</p>
              </div>
            ))}
            <div className="p-2 flex justify-start items-center space-x-4 mt-4">
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 transition duration-200 ease-in-out flex items-center"
              >
                <FiTrash2 size={25} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);
  const { ["sitededenuncias.token"]: token } = parseCookies(ctx);
  const { id } = ctx.query;

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    const response = await apiClient.get(`/api/verArtigo/${id}`);
    const artigo = response.data;

    return {
      props: { artigo },
    };
  } catch (error) {
    console.error("Erro ao carregar artigo:", error);
    return {
      notFound: true,
    };
  }
};
