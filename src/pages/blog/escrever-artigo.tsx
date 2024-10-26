import { GetServerSideProps } from "next";
import { getAPIClient } from "../api/axios";
import { useState } from "react";
import HeaderDashboard from "@/view/components/headerDashboard";
import SidebarDashboard from "@/view/components/sidebarDashboard";
import { withAuth } from "@/controller/utilitarios/utils";
import Alert from "@/view/components/alert";

export default function EscreverArtigo() {
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("error");

  function handleAlertClose() {
    setShowAlert(false);
  }

  async function handlePublicarArtigo() {
    if (!titulo || !texto) {
      //alert("Preencha todos os campos!");
      setAlertMessage("Preencha todos os campos!");
      setAlertType("error");
      setShowAlert(true);      
      return;
    }

    try {
      const apiClient = getAPIClient();
      const response = await apiClient.post("/api/artigo/cadastrarArtigo", {
        titulo,
        texto,
      });

      if (response.status === 200) {
        //alert("Artigo publicado com sucesso!");
        setAlertMessage("Artigo publicado com sucesso!");
        setAlertType("success");
        setShowAlert(true);
      } else {
        //alert("Erro ao publicar o artigo.");
        setAlertMessage("Erro ao publicar o artigo.");
        setAlertType("error");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Erro ao publicar o artigo:", error);
      //alert("Erro ao publicar o artigo.");
      setAlertMessage("Erro ao publicar o artigo.");
      setAlertType("error");
      setShowAlert(true);      
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">

      <SidebarDashboard />

      <div className="flex-1 flex flex-col">

        <HeaderDashboard titulo="Escrever"/>

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
          {showAlert && (
              <div className="fixed bottom-4 right-4">
                <Alert type={alertType} message={alertMessage} onClose={handleAlertClose} />
              </div>
          )}
        </main>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth;