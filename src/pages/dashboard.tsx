import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { getAPIClient } from "./api/axios";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";

const navigation = [
  { name: 'Home', href: '/', emoji: "🏠" },
  { name: 'Escrever artigo', href: '#', emoji: '📝' },
  { name: 'Ver denúncias', href: '#', emoji: '🔍' }
];

const cards = [
  { titulo: "Overview", conteudo: "Content goes here..." },
  { titulo: "Analytics", conteudo: "Content goes here..." },
  { titulo: "Reports", conteudo: "Content goes here..." }
];

export default function Dashboard() {
  
  const { user, signOut } = useContext(AuthContext)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  async function handleClickSair() {
    await signOut();
  }

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
            {navigation.map((item) => (
              <li className="mb-4">
              <a href={item.href} className="flex items-center p-2 rounded-md hover:bg-gray-700">
                <span>{item.emoji}</span>
                <span className="ml-2">{item.name}</span>
              </a>
            </li>              
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-gray-800 shadow-md h-16 flex items-center justify-between px-6 md:px-8">
          <div className="flex items-center">
            <button
              className="md:hidden text-gray-800 p-2"
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </button>
            {/* Mostrar "Dashboard" apenas quando a sidebar está escondida */}
            {!isSidebarOpen && (
              <h2 className="text-xl font-semibold text-white ml-4 md:ml-0 md:hidden">Dashboard</h2>
            )}
          </div>
          <div className="relative">
            <img
              src={user?.imagem}             
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            />
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                <div className="flex flex-col items-center px-4 py-2">
                  <img
                    src={user?.imagem}
                    alt="Profile"
                    className="w-12 h-12 rounded-full mb-2"
                  />
                  <p className="text-sm font-medium text-gray-800">{user?.nome}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="border-t border-gray-200 mt-2"></div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map((item) => (
              <div className="bg-white p-4 rounded-md shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">{item.titulo}</h3>
                <p className="text-gray-600">{item.conteudo}</p>
              </div>
            ))}
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
