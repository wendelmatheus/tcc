import { AuthContext } from "@/contexts/AuthContext";
import Image from "next/image";
import { useContext, useState } from "react";

interface HeaderDashboardProps {
    titulo?: string;
}

export default function HeaderDashboard({ titulo }: HeaderDashboardProps) {

    const { user, signOut } = useContext(AuthContext)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    async function handleClickSair() {
        await signOut();
      }

    return (
        <header className="bg-gray-800 shadow-md h-16 flex items-center justify-between px-6 md:px-8">
        <div className="flex items-center">
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>
          <div className="h-16 flex items-center justify-between bg-gray-800 shadow-md px-4">
              <h2 className="text-xl font-semibold text-white ml-4 md:ml-0">{titulo}</h2>
          </div>
        </div>
        <div className="relative">
        <Image
          src={user?.imagem || '/default-profile.png'}
          alt="Profile Photo"
          width={40}
          height={40} 
          className="rounded-full cursor-pointer"
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        />
          {/* <img
            src={user?.imagem}             
            alt="Profile Photo"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          /> */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
              <div className="flex flex-col items-center px-4 py-2">
              <Image
                src={user?.imagem || '/default-profile.png'} 
                alt="Profile photo"
                width={48} 
                height={48}
                className="rounded-full mb-2"
              />
                {/* <img
                  src={user?.imagem}
                  alt="Profile photo"
                  className="w-12 h-12 rounded-full mb-2"
                /> */}
                <p className="text-sm font-medium text-gray-800">{user?.nome}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="border-t border-gray-200 mt-2"></div>
              {/* <button
                className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                onClick={() => {}}
              >
                Mudar foto
              </button> */}
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                onClick={handleClickSair}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </header>
    );
}