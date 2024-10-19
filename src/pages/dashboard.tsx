import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { getAPIClient } from "./api/axios";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { CldImage } from "next-cloudinary";
import NavbarDashboard from "@/view/components/navbarDashboard";
import HeaderDashboard from "@/view/components/headerDashboard";
import SidebarDashboard from "@/view/components/sidebarDashboard";

const navigation = [
  { name: 'Home', href: '/', emoji: "🏠" },
  { name: 'Escrever artigo', href: '#', emoji: '📝' },
  { name: 'Ver denúncias', href: '/ver-denuncias', emoji: '🔍' }
];

const cards = [
  { titulo: "Overview", conteudo: "Content goes here..." },
  { titulo: "Analytics", conteudo: "Content goes here..." },
  { titulo: "Reports", conteudo: "Content goes here..." }
];

export default function Dashboard() {

  return (
    <div className="flex h-screen bg-gray-100">

      <SidebarDashboard />

      <div className="flex-1 flex flex-col">

        <HeaderDashboard />

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
