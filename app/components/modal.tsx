"use client";

import React from "react";

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ onClose, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-sm">
      <div className="relative bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-0 w-auto max-w-6xl flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-black/60 text-white rounded-full p-2 hover:bg-orange-500 transition"
          aria-label="Kapat"
        >
          {/* svg kodlarını bul buranın  */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
