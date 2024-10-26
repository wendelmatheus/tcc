import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { getAPIClient } from "./api/axios";
import { useState } from "react";
import HeaderDashboard from "@/view/components/headerDashboard";
import SidebarDashboard from "@/view/components/sidebarDashboard";
import { formatarData } from "@/controller/utilitarios/utils";
import { FiTrash2 } from "react-icons/fi";

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

export default function ResponderDenuncia({ denuncia }: { denuncia: Denuncia }) {
  
  const [resposta, setResposta] = useState(denuncia.resposta || "");

  async function handleAlterarStatus() {
    const apiClient = getAPIClient();

    const response = await apiClient.post("/api/denuncia/alterarStatusDenuncia", {
      id: denuncia.id,
      status: "Recebido",
    });

    if (response.status === 200) {
      alert("Denúncia aprovada!");
      window.location.reload();
    } else {
      alert("Erro ao alterar o status.");
    }
  }

  async function handleDelete() {
    const confirmDelete = confirm('Tem certeza que deseja apagar esta denúncia?');

    if (confirmDelete) {
      const apiClient = getAPIClient();

      try {
        const response = await apiClient.delete(`/api/denuncia/deletarDenuncia/${denuncia.id}`);

        if (response.status === 200) {
          alert('Denúncia apagada com sucesso!');
          window.location.href = "/ver-denuncias";
        } else {
          alert('Erro ao apagar denúncia.');
        }
      } catch (error) {
        console.error("Erro ao apagar a denúncia:", error);
      }
    }
  }

  async function handleEnviarResposta() {
    const apiClient = getAPIClient();

    const response = await apiClient.post("/api/denuncia/responderDenuncia", {
      idDenuncia: denuncia.id,
      resposta,
    });

    if (response.status === 200) {
      alert("Resposta enviada com sucesso!");
    } else {
      alert("Erro ao enviar a resposta.");
    }
  }

    async function handleEnviarEmail() {
        const apiClient = getAPIClient();
        
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

  const data = [
    { titulo: 'Código', subtitulo: `${denuncia.id}` },
    { titulo: 'Nome do Denunciante', subtitulo: `${denuncia.denunciante.nome}` },
    { titulo: 'E-mail', subtitulo: `${denuncia.denunciante.email}` },
    { titulo: 'Assunto', subtitulo: `${denuncia.assunto}` },
    { titulo: 'Mensagem', subtitulo: `${denuncia.mensagem}` },
    { titulo: 'Status', subtitulo: `${denuncia.status}` },
    { titulo: 'Data', subtitulo: `${formatarData(denuncia.data_criacao)}` }
  ];

  return (
    <div className="flex h-screen bg-gray-100">

      <SidebarDashboard />

      <div className="flex-1 flex flex-col">

        <HeaderDashboard titulo="Responder" />

        <main className="flex-1 p-6 bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 p-2">Detalhes da Denúncia</h3>
            {data.map((item) => (
              <div className="p-2">
                <p className="text-gray-800"><strong>{item.titulo}</strong></p>
                <p className="text-gray-800">{item.subtitulo}</p>
              </div>
            ))}
              {denuncia.status === "Aguardando" && (
                <button 
                  onClick={handleAlterarStatus}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow"
                >
                  Alterar status para Recebido
                </button>
              )}
              {denuncia.status === "Aguardando"
                ? <></>
                :<>
                  <div className="p-2">
                  <h3 className="mt-4 text-lg font-semibold text-gray-700">Responder Denúncia</h3>
                      <textarea
                      value={resposta}
                      onChange={(e) => setResposta(e.target.value)}
                      rows={4}
                      placeholder="Digite sua resposta..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out text-gray-800 resize-none"
                      ></textarea>
                      <div className="flex items-center mt-8">

                      </div>       
                      <div className="p-2 flex justify-start items-center space-x-2">
                        <button
                            onClick={handleDelete}
                            className="text-red-600 hover:text-red-800 transition duration-200 ease-in-out flex items-center mr-2"
                            //className="mt-4 hover:bg-red-800 text-red-600 font-bold py-2 px-2 rounded-lg transition-all duration-300 shadow"
                            //className="text-red-600 hover:text-red-800 transition duration-200 ease-in-out"
                          >
                            <FiTrash2 size={25} />
                          </button>               
                        <button 
                            onClick={handleEnviarResposta} 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow"
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
                </>
               }


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

  const response = await apiClient.get(`/api/denuncia/verDenuncia/${id}`);
  const denuncia = response.data;

  return {
    props: { denuncia },
  };
};
