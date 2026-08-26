'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function About() {
  const { isAdmin } = useCart();

  // Estado da imagem (tenta carregar do localStorage ou usa a padrão)
  const defaultImage = "/WhatsApp Image 2026-08-18 at 13.19.58.jpeg";
  const [currentImage, setCurrentImage] = useState(defaultImage);

  // Estados do Modal de Edição de Imagem
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    const savedImage = localStorage.getItem('beauty_club_about_img');
    if (savedImage) {
      setCurrentImage(savedImage);
    }
  }, []);

  const handleOpenModal = () => {
    setImageUrlInput(currentImage);
    setIsModalOpen(true);
  };

  const handleSaveImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      setCurrentImage(imageUrlInput);
      localStorage.setItem('beauty_club_about_img', imageUrlInput);
      setIsModalOpen(false);
    }
  };

  const scheduleWhatsApp = () => {
    const text = "*✨ AGENDAMENTO | BEAUTY CLUB*\n\nOlá, Mônica! Estava no site e gostaria de agendar um horário.";
    window.open(`https://wa.me/5562991128449?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="sobre" className="relative bg-[var(--color-bg)] py-20 md:py-32 overflow-hidden">
      
      {/* Elementos decorativos de luz e fundo de alto padrão */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-nude)] rounded-full blur-3xl opacity-20 -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* LADO DA IMAGEM: Composição Editorial Luxuosa com URL Admin */}
          <div className="w-full lg:w-1/2 flex justify-center relative">
            <div className="relative w-full max-w-sm md:max-w-md">
              
              {/* Moldura dourada geométrica decorativa de fundo */}
              <div className="absolute -inset-4 border border-[var(--color-gold)]/40 rounded-sm translate-x-3 translate-y-3 hidden sm:block pointer-events-none"></div>
              
              {/* Container Principal da Foto */}
              <div className="relative h-[420px] md:h-[520px] rounded-sm overflow-hidden shadow-2xl bg-[var(--color-nude-light)] border border-white flex items-center justify-center group">
                <img 
                  src={currentImage} 
                  alt="Mônica Monteiro - Beauty Club" 
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-102"
                />
                
                {/* Overlay de Edição Exclusivo para o Modo Admin */}
                {isAdmin && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                    <i className="ph ph-image text-white text-4xl mb-3"></i>
                    <p className="text-white text-xs uppercase tracking-widest font-bold mb-4">Modo Editor Ativo</p>
                    <button 
                      onClick={handleOpenModal}
                      className="bg-[var(--color-gold)] text-white px-5 py-3 rounded-sm text-xs uppercase font-bold tracking-widest shadow-lg hover:bg-white hover:text-[var(--color-dark)] transition cursor-pointer"
                    >
                      Alterar URL da Foto
                    </button>
                  </div>
                )}
                
                {/* Badge Flutuante Sobre a Imagem */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-sm border border-white/40 shadow-xl pointer-events-none">
                  <p className="font-serif text-[var(--color-dark)] text-base font-semibold">Mônica Monteiro</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)] font-bold mt-0.5">Fundadora & Master Stylist</p>
                </div>
              </div>

            </div>
          </div>

          {/* LADO DO TEXTO: Editorial de Alto Padrão */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-10 bg-[var(--color-gold)]"></span>
              <span className="uppercase tracking-[0.3em] text-[var(--color-gold)] text-xs font-bold">
                A Nossa Essência
              </span>
            </div>
              
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-dark)] leading-tight mb-6">
              Elevando sua autoestima com <span className="italic text-[var(--color-gold)]">exclusividade.</span>
            </h2>
              
            <div className="space-y-4 text-gray-600 font-light text-sm md:text-lg leading-relaxed mb-8">
              <p>
                Criado para mulheres que não abrem mão de excelência, o <strong className="font-medium text-[var(--color-dark)]">Beauty Club</strong> redefine o conceito de estética e cuidado pessoal em um ambiente sofisticado e acolhedor.
              </p>
              <p>
                Sob a liderança de Mônica Monteiro, unimos técnicas avançadas em visagismo, tratamento capilar de alta performance e estética refinada para realçar a sua identidade natural com total segurança.
              </p>
            </div>

            {/* Selos de Qualidade em Grid Interno */}
            <div className="grid grid-cols-2 gap-4 mb-8 py-5 border-y border-[var(--color-nude)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-nude-light)] flex items-center justify-center text-[var(--color-gold)] shadow-sm">
                  <i className="ph-fill ph-sparkle text-lg"></i>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-dark)]">Atendimento</h4>
                  <p className="text-[11px] text-gray-500">100% Personalizado</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-nude-light)] flex items-center justify-center text-[var(--color-gold)] shadow-sm">
                  <i className="ph-fill ph-crown text-lg"></i>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-dark)]">Produtos</h4>
                  <p className="text-[11px] text-gray-500">Padrão Internacional</p>
                </div>
              </div>
            </div>
                
            {/* Botão de Ação */}
            <div>
              <button 
                onClick={scheduleWhatsApp} 
                className="w-full sm:w-fit bg-[var(--color-dark)] text-white px-8 py-5 uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-3 hover:bg-[var(--color-gold)] transition-all duration-300 shadow-xl rounded-sm cursor-pointer group"
              >
                <i className="ph-fill ph-whatsapp-logo text-xl group-hover:scale-110 transition-transform"></i> 
                Agendar Horário Exclusivo
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Modal para alterar URL da Imagem (Admin) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-black cursor-pointer">
              <i className="ph ph-x text-xl"></i>
            </button>
            <h3 className="font-serif text-2xl text-[var(--color-dark)] mb-6">Alterar Foto do Perfil</h3>
            
            <form onSubmit={handleSaveImage} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-600 mb-1.5 tracking-wider">URL da Nova Imagem</label>
                <input 
                  type="url" 
                  placeholder="https://exemplo.com/foto.jpg"
                  value={imageUrlInput} 
                  onChange={(e) => setImageUrlInput(e.target.value)} 
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[var(--color-gold)] transition bg-white text-gray-700" 
                  required
                />
                {imageUrlInput && (
                  <img src={imageUrlInput} alt="Preview" className="mt-3 h-32 w-full object-contain rounded-xl shadow-md bg-gray-50 border" />
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-[var(--color-dark)] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[var(--color-gold)] transition cursor-pointer shadow-lg"
                >
                  Salvar Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}