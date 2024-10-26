import { AuthContext } from "@/contexts/AuthContext";
import router from "next/router";
import { useContext, useState } from "react";
import Alert from "../view/components/alert";

export default function Login(): JSX.Element {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("error");

  async function requisitarApiAutenticar(email: string, senha: string) {
    try {
      await signIn(
        email,
        senha,
        () => {
          setAlertMessage("Email ou Senha Incorreta");
          setAlertType("error");
          setShowAlert(true);
        },
        () => {
          setAlertMessage("Usuário não encontrado");
          setAlertType("error");
          setShowAlert(true);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  function verificarDados(email: string, senha: string) {
    return email !== "" && senha !== "";
  }

  function handleClickEntrar(): void {
    if (verificarDados(email, senha)) {
      requisitarApiAutenticar(email, senha);
    } else {
      setAlertMessage("Preencha o email e senha");
      setAlertType("error");
      setShowAlert(true);
    }
  }

  function handleAlertClose() {
    setShowAlert(false);
  }

  return (
    <>
      <button
        onClick={() => router.push('/')}
        className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg hover:bg-zinc-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-black"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5m7-7l-7 7 7 7" />
        </svg>
      </button>
      <div className="h-screen font-sans bg-gray-700 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">LOGIN</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200" htmlFor="email">E-mail</label>
                <input
                  className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail..."
                  aria-label="email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200" htmlFor="password">Senha</label>
                <input
                  className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  id="password"
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha..."
                  aria-label="password"
                  required
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={handleClickEntrar}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Entrar
                </button>
                <a
                  className="text-sm font-medium text-gray-300 hover:text-blue-400"
                  href="#"
                >
                  Esqueceu a senha?
                </a>
              </div>
            </div>
            {/* Alert Component positioned at the bottom right */}
            {showAlert && (
              <div className="fixed bottom-4 right-4">
                <Alert type={alertType} message={alertMessage} onClose={handleAlertClose} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
