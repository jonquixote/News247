import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg relative w-full max-w-md mx-4">
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={() => window.history.back()}>
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;