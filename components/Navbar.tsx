'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { cartItemCount, toggleCart, isAdmin, user, loginWithGoogle, logoutGoogle } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Segredo mantido: Clica 5 vezes no logo para abrir o login do Google!
  const handleLogoClick = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    setClickCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount === 5 && !isAdmin) {
        loginWithGoogle(); // Dispara o popup do Google automaticamente
        return 0; 
      }
      return newCount; 
    });
  };

  return (
    <>
      {/* MENU MOBILE (Offcanvas) */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-[120] transform transition-transform duration-500 md:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-[var(--color-nude)] flex justify-between items-center">
          <span className="font-serif text-xl">Beauty Club</span>
          <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 cursor-pointer"><i className="ph ph-x text-2xl"></i></button>
        </div>
        <div className="flex flex-col p-6 space-y-6 text-sm uppercase tracking-widest font-bold text-gray-600">
          <a href="#sobre" onClick={() => setIsMenuOpen(false)}>Sobre Nós</a>
          <a href="#tratamentos" onClick={() => setIsMenuOpen(false)}>Serviços</a>
          <a href="#produtos" onClick={() => setIsMenuOpen(false)}>Loja Online</a>
        </div>
      </div>
      {isMenuOpen && <div className="fixed inset-0 bg-black/50 z-[110] md:hidden" onClick={() => setIsMenuOpen(false)}></div>}

      {/* NAVBAR PRINCIPAL */}
      <nav className={`fixed w-full top-0 z-40 transition-all duration-300 ${scrolled || isAdmin ? 'glass-header py-3' : 'bg-transparent py-5'}`}>
        
        {/* BARRA DE AVISO DO MODO EDIÇÃO */}
        {isAdmin && (
          <div className="absolute top-full left-0 w-full bg-[var(--color-gold)] text-[var(--color-dark)] text-xs md:text-sm py-2 px-4 flex justify-between items-center font-bold tracking-widest uppercase shadow-md">
            <span>⚠️ Modo Edição Ativado ({user?.email})</span>
            <button onClick={logoutGoogle} className="bg-[var(--color-dark)] text-white px-4 py-1 rounded-sm hover:bg-black transition flex items-center gap-2 cursor-pointer">
              <i className="ph ph-sign-out"></i> Sair da Conta
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* LADO ESQUERDO: Links Desktop / Hambúrguer Mobile */}
          <div className="flex-1 flex items-center justify-start">
            <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-2xl text-[var(--color-dark)] cursor-pointer">
              <i className="ph ph-list"></i>
            </button>
            <div className="hidden md:flex gap-6 text-[11px] lg:text-xs uppercase tracking-widest font-bold text-[var(--color-dark)]">
              <a href="#sobre" className="hover:text-[var(--color-gold)] transition">Sobre Nós</a>
              <a href="#tratamentos" className="hover:text-[var(--color-gold)] transition">Serviços</a>
              <a href="#produtos" className="hover:text-[var(--color-gold)] transition">Loja</a>
            </div>
          </div>

          {/* CENTRO: LOGO (Clique 5 vezes para logar com o Google) */}
          <div onClick={handleLogoClick} className="flex-1 flex flex-col items-center cursor-pointer select-none" title="Área Administrativa">
            <span className="font-serif text-2xl md:text-3xl text-[var(--color-dark)] tracking-wide">BEAUTY CLUB</span>
          </div>

          {/* LADO DIREITO: Sacola */}
          <div className="flex-1 flex justify-end">
            <button onClick={toggleCart} className="relative text-2xl text-[var(--color-dark)] hover:text-[var(--color-gold)] transition cursor-pointer">
              <i className="ph ph-handbag"></i>
              <span className="absolute -top-2 -right-2 bg-[var(--color-gold)] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartItemCount}
              </span>
            </button>
          </div>
          
        </div>
      </nav>
    </>
  );
}