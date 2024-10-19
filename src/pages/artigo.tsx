import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Navbar from "@/view/components/navbar";

interface Artigo {
    id: string;
    titulo: string;
    texto: string;
    data_criacao: string;
}

export default function ArtigoPage({ artigo }: { artigo: Artigo | null }) {
    const router = useRouter();

    // Exibir mensagem se o artigo não for encontrado
    if (!artigo) {
        return (
            <div className="bg-gray-700 min-h-screen">
                <Navbar />
                <main className="container mx-auto p-6">
                    <div className="bg-gray-200 p-6 rounded-md shadow-md">
                        <h1 className="text-gray-700 text-xl font-bold mb-4">Artigo não encontrado</h1>
                        <p className="text-gray-600">Desculpe, mas o artigo que você está procurando não existe.</p>
                    </div>
                </main>
            </div>
        );
    }

    const formatarData = (data: string | Date) => {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Para evitar o formato AM/PM
        };
        return new Date(data).toLocaleString('pt-BR', options);
    };

    // Dividir o texto em parágrafos com base nas quebras de linha
    const parrafos = artigo.texto.split('\n');

    return (
        <div className="bg-gray-700 min-h-screen">
            <Navbar />
            <main className="container mx-auto p-6">
                <div className="bg-gray-200 p-6 rounded-md shadow-md">
                    <h1 className="text-gray-700 text-xl font-bold mb-4">{artigo.titulo}</h1>
                    <div className="text-gray-600 p-2">
                        <p><strong>Data de Publicação</strong></p>
                        <p>{formatarData(artigo.data_criacao)}</p>
                    </div>

                    <div className="text-gray-600 p-2">
                        {/* Mapear cada parágrafo para um elemento <p> com margem inferior */}
                        {parrafos.map((paragrafo, index) => (
                            <p key={index} className="mb-4">{paragrafo}</p> // Adicionando margem inferior
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query;

    const response = await fetch(`http://localhost:3000/api/verArtigo/${id}`);
    
    // Verifica se a resposta da API foi bem-sucedida
    if (!response.ok) {
        return {
            props: { artigo: null }, // Passa null se a resposta não for ok
        };
    }

    const artigo = await response.json();

    // Verifica se o artigo não foi encontrado
    if (!artigo) {
        return {
            props: { artigo: null }, // Passa null para o componente
        };
    }

    return {
        props: { artigo },
    };
};
