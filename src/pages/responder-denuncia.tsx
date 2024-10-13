import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { getAPIClient } from "./api/axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

interface Denunciante {
    nome: string;
    email: string;
  }
  
  interface Denuncia {
    id: string;
    assunto: string;
    mensagem: string;
    status: string;
    data_criacao: string; // ou Date, dependendo de como você está tratando a data
    resposta: string;
    denunciante: Denunciante; // Alterado para incluir o objeto denunciante
  }

export default function ResponderDenuncia({ denuncia }: { denuncia: Denuncia }) {
  const { user, signOut } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);    
  const [resposta, setResposta] = useState(denuncia.resposta || "");

  async function handleClickSair() {
    await signOut();
  }

  async function handleEnviarResposta() {
    const apiClient = getAPIClient();

    const response = await apiClient.post("/api/responderDenuncia", {
      idDenuncia: denuncia.id,
      resposta,
    });

    if (response.status === 200) {
      alert("Resposta enviada com sucesso!");
    } else {
      alert("Erro ao enviar a resposta.");
    }
  }

    // Função para enviar o email ao denunciante
    async function handleEnviarEmail() {
        const apiClient = getAPIClient();
        
        // Verifica se existe uma resposta válida
        const respostaParaEmail = resposta || denuncia.resposta;
    
        if (!respostaParaEmail) {
          alert("Erro: Resposta não preenchida!");
          return;
        }

        const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #3b82f6; text-align: center;">Resposta à sua Denúncia</h2>
          
          <p style="font-size: 16px; color: #333;">Olá, <strong>${denuncia.denunciante.nome}</strong>!</p>
          <p style="font-size: 16px; color: #333;">Recebemos a sua denúncia e aqui está a nossa resposta:</p>
          
<div style="padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px;">
  <div style="padding: 8px 0;">
    <p style="margin: 0; font-weight: bold;">Código da Denúncia</p>
    <p style="margin: 4px 0;">${denuncia.id}</p>
  </div>  

  <div style="padding: 8px 0;">
    <p style="margin: 0; font-weight: bold;">Data da Denúncia</p>
    <p style="margin: 4px 0;">${formatarData(denuncia.data_criacao)}</p>
  </div>  

  <div style="padding: 8px 0;">
    <p style="margin: 0; font-weight: bold;">Assunto</p>
    <p style="margin: 4px 0;">${denuncia.assunto}</p>
  </div>  

  <div style="padding: 8px 0;">
    <p style="margin: 0; font-weight: bold;">Mensagem</p>
    <p style="margin: 4px 0;">${denuncia.mensagem}</p>
  </div>  

  <div style="padding: 8px 0;">
    <p style="margin: 0; font-weight: bold;">Resposta</p>
    <p style="margin: 4px 0;">${respostaParaEmail}</p>
  </div>  
</div>
          
          <p style="font-size: 14px; color: #777; text-align: center;">Caso tenha dúvidas ou precise de mais informações, sinta-se à vontade para nos responder.</p>
          
          <p style="font-size: 14px; color: #777; text-align: center;">Atenciosamente,<br>Equipe Pet Denuncie</p>
        </div>
      `;
    
        const response = await apiClient.post("/api/enviarEmail", {
          to: denuncia.denunciante.email,
          subject: `Resposta à denúncia: ${denuncia.assunto}`,
          html: emailContent,
        });
    
        if (response.status === 200) {
          alert("Email enviado com sucesso!");
        } else {
          alert("Erro ao enviar o email.");
        }
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-700 text-white transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative z-10`}
      >
        <div className="h-16 flex items-center justify-between bg-gray-800 shadow-md px-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <button
            className="text-white md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 px-4 py-8">
          <ul>
            <li className="mb-4">
              <a href="/" className="flex items-center p-2 rounded-md hover:bg-gray-700">
                <span>🏠</span>
                <span className="ml-2">Home</span>
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center p-2 rounded-md hover:bg-gray-700">
                <span>📝</span>
                <span className="ml-2">Escrever artigo</span>
              </a>
            </li>
            <li className="mb-4">
              <a href="/ver-denuncias" className="flex items-center p-2 rounded-md hover:bg-gray-700">
                <span>🔍</span>
                <span className="ml-2">Ver denúncias</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 shadow-md h-16 flex items-center justify-between px-6 md:px-8">
          <div className="flex items-center">
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </button>
            <div className="h-16 flex items-center justify-between bg-gray-800 shadow-md px-4">
                <h2 className="text-xl font-semibold text-white ml-4 md:ml-0">Responder denúncia</h2>
            </div>
            
            {/* Mostrar "Dashboard" apenas quando a sidebar está escondida */}
            {!isSidebarOpen && (
              <h2 className="text-xl font-semibold text-white ml-4 md:ml-0 md:hidden">Dashboard</h2>
            )}
          </div>
          <div className="relative">
            <img
              src={user?.imagem}             
              alt="Profile Photo"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            />
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                <div className="flex flex-col items-center px-4 py-2">
                  <img
                    src={user?.imagem}
                    alt="Profile photo"
                    className="w-12 h-12 rounded-full mb-2"
                  />
                  <p className="text-sm font-medium text-gray-800">{user?.nome}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="border-t border-gray-200 mt-2"></div>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                  onClick={() => {}}
                >
                  Mudar foto
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                  onClick={handleClickSair}
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 p-2">Detalhes da Denúncia</h3>
            <div className="p-2">
                <p className="text-gray-800"><strong>Código</strong></p>
                <p className="text-gray-800">{denuncia.id}</p>
            </div>
            <div className="p-2">
                <p className="text-gray-800"><strong>Nome do Denunciante</strong></p>
                <p className="text-gray-800">{denuncia.denunciante.nome}</p>
            </div>
            <div className="p-2">
                <p className="text-gray-800"><strong>E-mail</strong></p>
                <p className="text-gray-800">{denuncia.denunciante.email}</p>
            </div>

            <div className="p-2">
                <p className="text-gray-800"><strong>Assunto</strong></p>
                <p className="text-gray-800">{denuncia.assunto}</p>
            </div>
            <div className="p-2">
                <p className="text-gray-800"><strong>Mensagem</strong></p>
                <p className="text-gray-800">{denuncia.mensagem}</p>
            </div>
            <div className="p-2">
                <p className="text-gray-800"><strong>Status</strong></p>
                <p className="text-gray-800">{denuncia.status}</p>
            </div>
            <div className="p-2">
                <p className="text-gray-800"><strong>Data</strong></p>
                <p className="text-gray-800">{formatarData(denuncia.data_criacao)}</p>
            </div>
            <div className="p-2">
            <h3 className="mt-4 text-lg font-semibold text-gray-700">Responder Denúncia</h3>
                <textarea
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                rows={4}
                placeholder="Digite sua resposta..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out text-gray-800 resize-none"
                ></textarea>
                
                <button 
                    onClick={handleEnviarResposta} 
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow"
                    >
                    Enviar Resposta
                </button>
                <button 
                onClick={handleEnviarEmail} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow m-2"
                >
                    Enviar Email
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

  const response = await apiClient.get(`/api/verDenuncia/${id}`);
  const denuncia = response.data;

  return {
    props: { denuncia },
  };
};
