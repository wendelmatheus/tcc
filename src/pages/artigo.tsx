import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Navbar from "@/view/components/navbar";
import { formatarData } from '@/controller/utilitarios/utils';

interface Artigo {
    id: string;
    titulo: string;
    texto: string;
    data_criacao: string;
}

export default function ArtigoPage({ artigo }: { artigo: Artigo | null }) {

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
                        {parrafos.map((paragrafo, index) => (
                            <p key={index} className="mb-4">{paragrafo}</p> 
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
    
    if (!response.ok) {
        return {
            props: { artigo: null },
        };
    }

    const artigo = await response.json();

    if (!artigo) {
        return {
            props: { artigo: null },
        };
    }

    return {
        props: { artigo },
    };
};
