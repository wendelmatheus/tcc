import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { getAPIClient } from "./api/axios";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import NavbarDashboard from "@/view/components/navbarDashboard";
import HeaderDashboard from "@/view/components/headerDashboard";
import SidebarDashboard from "@/view/components/sidebarDashboard";

const navigation = [
  { name: 'Home', href: '/', emoji: "🏠" },
  { name: 'Escrever artigo', href: '#', emoji: '📝' },
  { name: 'Ver denúncias', href: '/ver-denuncias', emoji: '🔍' }
];

export default function Dashboard() {

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
            <p>hello world</p>
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
