'use client';

import React from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText
}: ConfirmModalProps) => {
  const uiTheme = useReadmeStore((state) => state.uiTheme);
  const isDark = uiTheme === 'dark';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className={`
        relative w-full max-w-md p-8 rounded-3xl border shadow-2xl animate-in zoom-in-95 fade-in duration-300
        ${isDark ? 'bg-zinc-900 border-zinc-100/10 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'}
      `}>
        <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">
          {title}
        </h3>
        <p className={`text-sm font-mono mb-8 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          {description}
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-3 rounded-xl font-mono text-[10px] uppercase tracking-widest transition-all ${
              isDark ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-mono text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] active:scale-95"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
