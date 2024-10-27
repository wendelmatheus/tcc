import { GetServerSideProps } from "next";
import HeaderDashboard from "@/view/components/headerDashboard";
import SidebarDashboard from "@/view/components/sidebarDashboard";
import { withAuth } from "@/controller/utilitarios/utils";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Spinner } from "@/view/components/spinner";

interface Artigo {
  id: string;
  titulo: string;
  data_criacao: string;
}

export default function Artigos() {
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const artigosPerPage = 9;

  async function fetchArtigos() {
    setLoading(true);
    const response = await fetch("/api/artigo/verArtigos");
    const data = await response.json();
    
    // Ordena os artigos por data de criação (mais recente para o mais antigo)
    const sortedData = data.sort((a: Artigo, b: Artigo) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime());
  
    setArtigos(sortedData);
    setLoading(false);
  }

  useEffect(() => {
    fetchArtigos();
  }, []);

  const indexOfLastArtigo = currentPage * artigosPerPage;
  const indexOfFirstArtigo = indexOfLastArtigo - artigosPerPage;
  const currentArtigos = artigos.slice(indexOfFirstArtigo, indexOfLastArtigo);

  const totalPages = Math.ceil(artigos.length / artigosPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = 3;
  
    if (currentPage > 1) pageNumbers.push("Anterior");
  
    for (let i = Math.max(1, currentPage - maxPages); i <= Math.min(totalPages, currentPage + maxPages); i++) {
      pageNumbers.push(i);
    }
  
    if (currentPage < totalPages) pageNumbers.push("Próximo");
  
    return pageNumbers;
  };

  return (
    <div className="flex h-screen bg-gray-100">

      <SidebarDashboard />

      <div className="flex-1 flex flex-col">
        <HeaderDashboard titulo="Artigos" />

        <main className="flex-1 p-6 bg-gray-100">
          <div className="flex justify-end mb-4">
            <Link href="/blog/escrever-artigo">
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300">
                Escrever Novo Artigo
              </button>
            </Link>
          </div>

          {loading ? (
            <Spinner />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {currentArtigos.map((artigo) => (
                  <Link key={artigo.id} href={`/blog/visualizar-artigo?id=${artigo.id}`}>
                    <div className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-800">{artigo.titulo}</h3>
                      <p className="text-gray-600">{new Date(artigo.data_criacao).toLocaleDateString()}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex justify-center mt-6 space-x-2">
                {getPageNumbers().map((page, index) =>
                  typeof page === "number" ? (
                    <button
                      key={index}
                      onClick={() => paginate(page)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === page ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
                      } transition duration-200`}
                    >
                      {page}
                    </button>
                  ) : (
                    <button
                      key={index}
                      onClick={() => paginate(page === "Anterior" ? currentPage - 1 : currentPage + 1)}
                      className="px-3 py-1 rounded-lg bg-gray-300 text-gray-700 transition duration-200"
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth;
