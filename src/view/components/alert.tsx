import React from "react";
import { FiXCircle } from "react-icons/fi";

type AlertProps = {
  type: "success" | "error";
  message: string;
  onClose: () => void;
};

export default function Alert({ type, message, onClose }: AlertProps) {

  let title = "";

  if(type === "success") {
    title = "Sucesso!"
  } else {
    title = "Erro!"
  }

  return (
    <div className={`fixed bottom-4 right-4 max-w-xs p-4 rounded-lg shadow-lg items-center transition-opacity ${type === "success" ? "bg-green-600" : "bg-red-600"} text-white`}>
      <div></div>
      <div className="flex flex-row space-x-2 justify-between">
        <strong className="font-bold flex gap-1">{title}</strong>
        <button onClick={onClose} className="text-white ml-auto focus:outline-none hover:text-gray-300">
          <FiXCircle size={20} />
        </button>
      </div>

      <span className="block sm:inline">{message}</span>

    </div>
  );
}
