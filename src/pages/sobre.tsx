import Navbar from "@/view/components/navbar";

export default function Sobre() {
  return (
    <div className="bg-gray-700">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <h1 className="text-white text-3xl mb-4">Sobre o projeto</h1>
        <p className="text-gray-300 text-lg text-center mb-6">
          Esse projeto foi uma ideia que surgiu pesquisando e ouvindo a opinião de colegas e professores do IFSP. Meu orientador foi o professor André Constantino.
        </p>
        <p className="text-gray-300 text-lg text-center mb-6">
          <a href="#" className="text-blue-500 underline">Clicando aqui</a> [Link disponível em breve] é possível ler o artigo científico deste projeto.
        </p>
      </main>
    </div>
  );
}
