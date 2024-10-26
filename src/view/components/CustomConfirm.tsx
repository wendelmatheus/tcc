import React from "react";

interface CustomConfirmProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CustomConfirm: React.FC<CustomConfirmProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <p className="text-gray-800 text-lg">{message}</p>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomConfirm;
