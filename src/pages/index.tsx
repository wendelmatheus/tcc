import Navbar from "@/view/components/navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="bg-gray-700 min-h-screen flex flex-col">
        <section id="home" className="flex flex-col items-center justify-center min-h-screen py-10 px-4 text-center">
          <h1 className="text-5xl font-bold text-white">Plataforma de Denúncia de Maus-Tratos aos Animais</h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
          Centralize e simplifique o processo de denúncia e ajude a criar um mundo mais justo e seguro para todos.
          </p>
          <a href="#how-it-works" className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-all duration-300">
            Saiba Mais
          </a>
        </section>

        <section id="how-it-works" className="flex flex-col items-center justify-center min-h-screen py-10 px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Como Funciona</h2>
          <div className="text-gray-300 max-w-3xl mx-auto space-y-4">
            <p>
              Nossa plataforma permite que qualquer cidadão reporte incidentes de maus-tratos de maneira eficiente e segura.
              As denúncias são encaminhadas rapidamente às autoridades competentes, assegurando uma resposta rápida e adequada.
            </p>
          </div>
          <a href="#benefits" className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-all duration-300">
            Veja Benefícios
          </a>
        </section>

        <section id="benefits" className="flex flex-col items-center justify-center min-h-screen py-10 px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Benefícios</h2>
          <ul className="text-gray-300 max-w-3xl mx-auto space-y-2 list-disc list-inside">
            <li>Facilidade de uso para qualquer cidadão</li>
            <li>Denúncias centralizadas e organizadas</li>
            <li>Resposta rápida das autoridades</li>
            <li>Contribuição para a proteção e bem-estar animal</li>
          </ul>
          
          <Link href="/faca-sua-denuncia">          
            <button 
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-all duration-300">
              Faça sua denúncia
            </button>
          </Link>   
        </section>
      </div>
    </>
  )
}
