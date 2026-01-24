"use client";

import { X, Wallet, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Animation logic
  useEffect(() => {
    if (isOpen) setIsVisible(true);
    else setTimeout(() => setIsVisible(false), 300);
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 1. Backdrop (Overlay) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* 2. Modal Content */}
      <div className={`relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl transform transition-all duration-300 ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
          <p className="text-slate-400 text-sm mt-1">
            Choose a provider to sign in to Credo
          </p>
        </div>

        <div className="space-y-3">
          {['Metamask', 'Phantom', 'WalletConnect'].map((wallet) => (
            <button 
              key={wallet}
              onClick={() => { alert(`Connecting to ${wallet}...`); onClose(); }}
              className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-white/5 transition group"
            >
              <span className="font-medium text-slate-200">{wallet}</span>
              <ShieldCheck className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}