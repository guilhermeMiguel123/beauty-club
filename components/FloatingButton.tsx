'use client';
import { useState, useEffect } from 'react';

export default function FloatingButton() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Monitora o scroll para mostrar o botão de voltar ao topo
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8 flex flex-col gap-3 items-center">
      
      {/* Botão de Índice / Voltar ao Topo */}
      {showTopBtn && (
        <button 
          onClick={scrollToTop}
          className="bg-[var(--color-dark)] text-[var(--color-gold)] p-3 rounded-full shadow-lg hover:scale-110 transition-all border border-[var(--color-gold)]/30 mb-2 animate-fade-in-up"
          title="Voltar ao Topo"
        >
          <i className="ph ph-caret-up text-xl"></i>
        </button>
      )}

      {/* Botão do WhatsApp */}
      <a 
        href="https://wa.me/5562999999999?text=Olá,%20estou%20no%20site%20do%20Beauty%20Club%20e%20gostaria%20de%20atendimento." 
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group relative"
      >
        <i className="ph-fill ph-whatsapp-logo text-3xl"></i>
        <span className="absolute right-16 bg-white text-[var(--color-dark)] text-xs font-bold px-3 py-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
          Fale com a recepção
        </span>
      </a>
    </div>
  );
}