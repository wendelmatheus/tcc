import Alert from "@/view/components/alert";
import Navbar from "@/view/components/navbar";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Report() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [codigoDenuncia, setCodigoDenuncia] = useState<string | null>(null);
  const [captchaValido, setCaptchaValido] = useState(false);

  const [alertType, setAlertType] = useState<"success" | "error">("error");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  function verificarDados(nome: string, email: string, assunto: string, mensagem: string) {
    return nome !== "" && email !== "" && assunto !== "" && mensagem !== "";
  }

  function onCaptchaChange(value: string | null) {
    if (value) {
      setCaptchaValido(true);
    } else {
      setCaptchaValido(false);
    }
  }

  function handleAlertClose() {
    setShowAlert(false);
  }

  function cadastrarDenuncia() {
    if (!captchaValido) {
      setAlertMessage("Por favor, complete o reCAPTCHA.");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    if (verificarDados(nome, email, assunto, mensagem)) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      const urlencoded = new URLSearchParams();
      urlencoded.append("nome", nome);
      urlencoded.append("email", email);
      urlencoded.append("assunto", assunto);
      urlencoded.append("mensagem", mensagem);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
      };

      fetch("http://localhost:3000/api/denuncia/cadastrarDenuncia", requestOptions)
        .then((response) => {
          if (response.status === 200) {
            setAlertMessage("Denúncia feita com sucesso!");
            setAlertType("success");
            setShowAlert(true);
            return response.json();
          } else {
            throw new Error("Erro ao cadastrar denúncia!");
          }
        })
        .then((result) => {
          console.log("Código da denúncia:", result.id);
          setCodigoDenuncia(result.id);
        })
        .catch((error) => {
          console.error("Erro ao registrar denúncia:", error);
          setAlertMessage("Erro ao registrar a denúncia!");
          setAlertType("error");
          setShowAlert(true);
        });
    } else {
      setAlertMessage("Preencha todos os dados!");
      setAlertType("error");
      setShowAlert(true);
    }
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-700 min-h-screen flex flex-col items-center justify-center py-10 px-4">
        <h1 className="text-3xl font-bold text-white mb-6">Faça sua Denúncia</h1>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg space-y-4">
          {codigoDenuncia && (
            <div>
              <label className="block text-white mb-1" htmlFor="name">Código da denúncia</label>
              <span><strong>{codigoDenuncia}</strong></span>
            </div>
          )}
          
          <div>
            <label className="block text-white mb-1" htmlFor="name">Nome</label>
            <input 
              onChange={(e) => setNome(e.target.value)} 
              value={nome}
              type="text" 
              id="name" 
              name="name" 
              placeholder="Digite seu nome..." 
              className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded" 
            />
          </div>
          <div>
            <label className="block text-white mb-1" htmlFor="email">Email</label>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
              type="email" 
              id="email" 
              name="email" 
              placeholder="Digite seu email..." 
              className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded" 
            />
          </div>
          <div>
            <label className="block text-white mb-1" htmlFor="subject">Assunto</label>
            <input 
              onChange={(e) => setAssunto(e.target.value)} 
              value={assunto}
              type="text" 
              id="subject" 
              name="subject" 
              placeholder="Digite o assunto..." 
              className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded" 
            />
          </div>
          <div>
            <label className="block text-white mb-1" htmlFor="message">Mensagem</label>
            <textarea 
              onChange={(e) => setMensagem(e.target.value)} 
              value={mensagem}
              id="message" 
              name="message" 
              rows={6} 
              placeholder="Digite a mensagem..." 
              className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded">
            </textarea>
          </div>
          <div className="text-center">
            <div className="p-4">
              <button
                className="text-blue-500 underline"
                onClick={() => {setNome("Anônimo"); setEmail("anonimo@anonimo.com")}}>
                  Clique aqui caso queira fazer a denúncia de forma anônima
              </button>
            </div>

            <div className="flex justify-center mb-4">
              <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} onChange={onCaptchaChange} />
            </div>
            
            <button 
              onClick={cadastrarDenuncia} 
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-all duration-300">
              Enviar
            </button>
          </div>
        </div>
      </div>
      
      {showAlert && (
        <div className="fixed bottom-4 right-4">
          <Alert type={alertType} message={alertMessage} onClose={handleAlertClose} />
        </div>
      )}
    </>
  );
}
