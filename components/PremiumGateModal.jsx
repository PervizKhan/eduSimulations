'use client';

import { useEffect, useRef } from 'react';

export default function PremiumGateModal({ isOpen, onClose, onUnlock, config }) {
  const modalRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200 border-4 border-amber-300/50"
      >
        <div className="text-center">
          <div className="text-7xl mb-4 animate-bounce">⭐</div>
          <h2 className="text-2xl font-extrabold text-sky-800">
            Unlock {config?.title || 'Premium Simulation'}
          </h2>
          <div className="h-1 w-16 bg-amber-400 mx-auto my-3 rounded-full" />

          <div className="space-y-3 text-left my-6 bg-amber-50 rounded-2xl p-4 border border-amber-200/50">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <span className="text-2xl">🧪</span>
              <span>Full 3D interactive simulation</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <span className="text-2xl">📊</span>
              <span>Advanced telemetry &amp; analytics</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <span className="text-2xl">🎮</span>
              <span>Cinematic camera tracking</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onUnlock}
              className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-extrabold py-4 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 text-lg flex items-center justify-center gap-2"
            >
              ⭐ Unlock Premium
              <span className="text-sm font-normal bg-amber-300/50 px-2 py-0.5 rounded-full">
                $4.99
              </span>
            </button>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
            >
              Maybe later
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            🔒 Secure payment • Cancel anytime • 7-day free trial
          </p>
        </div>
      </div>
    </div>
  );
}