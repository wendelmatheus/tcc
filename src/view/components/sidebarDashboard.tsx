import { useState } from "react";
import NavbarDashboard from "./navbarDashboard";

export default function SidebarDashboard() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-700 text-white transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative z-10`}
      >
        <div className="h-16 flex items-center justify-between bg-gray-800 shadow-md px-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <button
            className="text-white md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <NavbarDashboard />
      </div>
    );
}