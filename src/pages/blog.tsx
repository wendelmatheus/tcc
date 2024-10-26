import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/view/components/navbar";
import { Spinner } from "@/view/components/spinner";

interface Artigo {
  id: string;
  titulo: string;
  texto: string;
  data_criacao: string;
}

export default function Blog() {
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 9;
  const router = useRouter();

  async function fetchArtigos() {
    setLoading(true)
    const response = await fetch("/api/artigo/verArtigos");
    const data = await response.json();
    
    const sortedData = data.sort(
      (a: Artigo, b: Artigo) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()
    );
  
    setArtigos(sortedData)
    setLoading(false)
  }

  const totalPages = Math.ceil(artigos.length / itemsPerPage);
  const paginatedArtigos = artigos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function handleClickArtigo(id: string) {
    router.push(`/artigo?id=${id}`);
  }

  function handlePreviousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  useEffect(() => {
    fetchArtigos();
  }, []);

  return (
    <div className="bg-gray-700 min-h-screen">
      <Navbar />
      <main className="container mx-auto p-6">

        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Seja bem-vindo (a) ao blog
        </h1>

        {loading
          ? <Spinner />
          : <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedArtigos.map((artigo) => (
                  <div
                    key={artigo.id}
                    className="bg-gray-200 p-4 rounded-md shadow-md cursor-pointer hover:shadow-lg transition-shadow h-48 flex flex-col justify-between"
                    onClick={() => handleClickArtigo(artigo.id)}
                  >
                    <h3 className="text-lg font-semibold text-gray-700">
                      {artigo.titulo}
                    </h3>
                    <p className="text-gray-600">
                      {artigo.texto.slice(0, 100)}...
                    </p>
                    <p className="text-gray-500">
                      Publicado em:{" "}
                      {new Date(artigo.data_criacao).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-4">
                  <button
                    onClick={handlePreviousPage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-200 disabled:text-gray-600"
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <span className="text-white">{`Página ${currentPage} de ${totalPages}`}</span>
                  <button
                    onClick={handleNextPage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-200 disabled:text-gray-600"
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </button>
                </div>
              )}
          </>
          }
      </main>
    </div>
  );
}