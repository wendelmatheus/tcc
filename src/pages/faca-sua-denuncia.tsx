import Navbar from "@/view/components/navbar";

export default function Report() {
  return (
    <>
      <Navbar />
      <div className="bg-gray-700 min-h-screen flex flex-col items-center justify-center py-10 px-4">
        <h1 className="text-3xl font-bold text-white mb-6">Faça sua Denúncia</h1>
        <form className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg space-y-4">
          <div>
            <label className="block text-white mb-1" htmlFor="name">Nome</label>
            <input type="text" id="name" name="name" placeholder="Digite seu nome..." className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded" />
          </div>
          <div>
            <label className="block text-white mb-1" htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Digite seu email..." className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded" />
          </div>
          <div>
            <label className="block text-white mb-1" htmlFor="subject">Assunto</label>
            <input type="text" id="subject" name="subject" placeholder="Digite o assunto..." className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded" />
          </div>
          <div>
            <label className="block text-white mb-1" htmlFor="message">Mensagem</label>
            <textarea id="message" name="message" rows={6} placeholder="Digite a mensagem..." className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded"></textarea>
          </div>
          <div>
            <label className="block text-white mb-1" htmlFor="attachments">Anexos</label>
            <input type="file" id="attachments" name="attachments" multiple className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded" />
          </div>
          <div className="text-center">
            <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-all duration-300">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
