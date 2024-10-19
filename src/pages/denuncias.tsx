import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from "@/view/components/navbar";
import { Spinner } from '@/view/components/spinner';

interface Denuncia {
  id: string;
  assunto: string;
  mensagem: string;
  status: string;
  data_criacao: Date;
}

export default function Denuncias() {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [filteredDenuncias, setFilteredDenuncias] = useState<Denuncia[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const itemsPerPage = 9;

  async function fetchDenuncias() {
    setLoading(true)
    const response = await fetch('/api/verDenuncias');
    const data = await response.json();

    const sortedData = data.sort((a: Denuncia, b: Denuncia) => {
      return new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime();
    });

    setDenuncias(sortedData);
    setFilteredDenuncias(sortedData);
    setLoading(false)
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    if (e.target.value === '') {
      setFilteredDenuncias(denuncias);
    } else {
      const filtered = denuncias.filter((denuncia) => 
        denuncia.id.includes(e.target.value)
      );
      setFilteredDenuncias(filtered);
    }
  }

  const totalPages = Math.ceil(filteredDenuncias.length / itemsPerPage);
  const paginatedDenuncias = filteredDenuncias.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  function handleClickDenuncia(id: string) {
    router.push(`/denuncia?id=${id}`);
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
    fetchDenuncias();
  }, []);

  return (
    <div className="bg-gray-700 min-h-screen">
      <Navbar />
      <main className="container mx-auto p-6">

        <div className="flex justify-center mb-6">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Digite o código da denúncia..."
            className="text-black px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out w-full max-w-lg"
          />
        </div>

        {loading 
          ? <Spinner />
          : <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedDenuncias.map((denuncia) => (
                <div
                  key={denuncia.id}
                  className="bg-gray-200 p-4 rounded-md shadow-md cursor-pointer hover:shadow-lg transition-shadow h-48 flex flex-col justify-between"
                  onClick={() => handleClickDenuncia(denuncia.id)}
                >
                  <h3 className="text-lg font-semibold text-gray-700">{denuncia.assunto}</h3>
                  <p className="text-gray-600 truncate">{denuncia.mensagem}</p> {/* Limita o texto e coloca "..." */}
                  <p className="text-gray-500">Status: {denuncia.status}</p>
                  <p className="text-gray-500">Data: {new Date(denuncia.data_criacao).toLocaleString('pt-BR')}</p>
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