import Navbar from "@/view/components/navbar";

export default function Home() {
  return (
    <div className="bg-gray-700">
      <Navbar />
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <h1 className="text-white text-3xl">Home</h1>
      </main>
    </div>
  );
}
