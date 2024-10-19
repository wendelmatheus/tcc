import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { getAPIClient } from "./api/axios";
import { useState } from "react";
import HeaderDashboard from "@/view/components/headerDashboard";
import SidebarDashboard from "@/view/components/sidebarDashboard";

export default function Dashboard() {
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");

  async function handlePublicarArtigo() {
    if (!titulo || !texto) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const apiClient = getAPIClient();
      const response = await apiClient.post("/api/cadastrarArtigo", {
        titulo,
        texto,
      });

      if (response.status === 200) {
        alert("Artigo publicado com sucesso!");
      } else {
        alert("Erro ao publicar o artigo.");
      }
    } catch (error) {
      console.error("Erro ao publicar o artigo:", error);
      alert("Erro ao publicar o artigo.");
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarDashboard />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <HeaderDashboard titulo="Artigos"/>

        {/* Content */}
        <main className="flex-1 p-6 bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 p-2">Escrever novo artigo</h3>
            <div className="p-2">
              <label className="text-gray-800 font-semibold">Título</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Digite o título do artigo"
                maxLength={60}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out text-gray-800"
              />
            </div>
            <div className="p-2">
              <label className="text-gray-800 font-semibold">Texto</label>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={8}
                placeholder="Escreva o artigo..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out text-gray-800 resize-none"
              ></textarea>
            </div>
            <div className="p-2">
              <button
                onClick={handlePublicarArtigo}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow"
              >
                Publicar
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
