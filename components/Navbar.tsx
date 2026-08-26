'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { cartItemCount, toggleCart, isAdmin, user, loginWithGoogle, logoutGoogle } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Se logou com sucesso, fecha o modal automaticamente
  useEffect(() => {
    if (isAdmin) {
      setShowAdminModal(false);
    }
  }, [isAdmin]);

  // Clica 5 vezes no logo para abrir o modal elegante de login
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (isAdmin) return; // Se já for admin, não precisa fazer nada

    setClickCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount === 5) {
        setShowAdminModal(true);
        return 0; 
      }
      return newCount; 
    });
  };

  const handleGoogleLoginClick = async () => {
    await loginWithGoogle();
  };

  return (
    <>
      {/* MODAL DE LOGIN COM GOOGLE (Elegante e Animado) */}
      {showAdminModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white p-8 rounded-sm shadow-2xl max-w-sm w-full text-center relative transform transition-all animate-in fade-in zoom-in-95 duration-200">
            
            {/* Botão de Fechar */}
            <button 
              onClick={() => setShowAdminModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 cursor-pointer transition"
            >
              <i className="ph ph-x text-xl"></i>
            </button>

            {/* Ícone de Escudo/Segurança */}
            <div className="w-16 h-16 bg-[var(--color-nude)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-gold)] shadow-inner">
              <i className="ph-fill ph-shield-check text-3xl"></i>
            </div>

            <h3 className="font-serif text-2xl text-[var(--color-dark)] mb-2">Painel Administrativo</h3>
            <p className="text-xs text-gray-500 mb-8 uppercase tracking-widest">Acesso restrito à diretoria</p>
            
            {/* Botão Estilizado de Login com Google */}
            <button 
              onClick={handleGoogleLoginClick} 
              className="w-full bg-[var(--color-dark)] text-white py-4 px-6 uppercase text-xs font-bold tracking-widest hover:bg-[var(--color-gold)] transition flex items-center justify-center gap-3 cursor-pointer shadow-md rounded-sm"
            >
              {/* Símbolo do Google em SVG */}
              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.5h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0 5.48 0 0 5.48 0 12.4c0 6.92 5.48 12.4 12.24 12.4 7.058 0 11.732-4.96 11.732-11.98 0-.828-.088-1.46-.226-2.085H12.24z"/>
              </svg>
              Entrar com o Google
            </button>
          </div>
        </div>
      )}

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

          {/* CENTRO: LOGO (Clique 5 vezes para abrir o modal de login) */}
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