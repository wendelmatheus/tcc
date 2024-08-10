import { AuthContext } from "@/contexts/AuthContext";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useContext } from "react";
import { getAPIClient } from "./api/axios";

export default function Dashboard() {

  const { user, signOut } = useContext(AuthContext)

  async function handleClickSair() {
    await signOut();
  }

    return (
      <div className="bg-gray-700 h-screen flex items-center justify-center">
        <h1 className="text-white text-3xl">Dashboard</h1>
        <p className="text-white text-3xl">Nome: {user?.nome}</p>
        <p className="text-white text-3xl">Email: {user?.email}</p>
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