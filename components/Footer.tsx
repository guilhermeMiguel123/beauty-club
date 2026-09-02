'use client';

export default function Footer() {
  return (
    <footer id="contato" className="bg-[var(--color-dark)] text-white pt-24 pb-12 border-t-[6px] border-[var(--color-gold)] relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-gold)]/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20 relative z-10">
        
        {/* Coluna 1: Branding (Agora ocupa mais espaço sem a newsletter) */}
        <div className="col-span-1 md:col-span-6">
        <h3 className="font-serif text-3xl mb-6 text-white tracking-wide">BEAUTY CLUB</h3>
            <div className="text-gray-400 font-light text-sm leading-relaxed mb-8 pr-0 md:pr-10 space-y-4">
              <p>
                Um espaço criado para mulheres que valorizam beleza, cuidado e autoestima. Aqui, cada atendimento é pensado de forma personalizada para proporcionar uma experiência leve, acolhedora e sofisticada.
              </p>
              <p>
                Especialistas em mechas, cachoterapia, gloss express, tratamentos capilares, cortes, design de sobrancelhas, unhas e muito mais, trabalhamos para realçar sua beleza com técnica, cuidado e naturalidade.
              </p>
              <p>
                Sinta-se em casa no espaço que foi preparado para cuidar de você. Agende seu horário pelo link da bio e venha viver a experiência Beauty Club.
              </p>
            </div>
          <div className="flex gap-6 text-2xl">
            <a href="https://www.instagram.com/p/DYDhyLGiH9y/?img_index=5&igsh=dzRuNm04ejg2enlo&igsi=dzRuNm04ejg2enlo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition transform hover:scale-110"><i className="ph ph-instagram-logo"></i></a>
            <a href="#" className="text-gray-400 hover:text-white transition transform hover:scale-110"><i className="ph ph-tiktok-logo"></i></a>
            <a href="https://wa.me/556291128449" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition transform hover:scale-110"><i className="ph ph-whatsapp-logo"></i></a>
          </div>
        </div>
        
        {/* Coluna 2: Navegação Interna */}
        <div className="col-span-1 md:col-span-3">
          <h4 className="uppercase tracking-widest font-bold text-xs mb-8 text-[var(--color-gold)]">O Salão</h4>
          <ul className="space-y-4 font-light text-gray-400 text-sm">
            <li><a href="#sobre" className="hover:text-white hover:translate-x-1 inline-block transition-all">Nossa Essência</a></li>
            <li><a href="#tratamentos" className="hover:text-white hover:translate-x-1 inline-block transition-all">Serviços Premium</a></li>
            <li><a href="#produtos" className="hover:text-white hover:translate-x-1 inline-block transition-all">Loja Home Care</a></li>
            <li><a href="#faq" className="hover:text-white hover:translate-x-1 inline-block transition-all">Dúvidas Frequentes</a></li>
          </ul>
        </div>

        {/* Coluna 3: Informações de Contato */}
        <div className="col-span-1 md:col-span-3">
          <h4 className="uppercase tracking-widest font-bold text-xs mb-8 text-[var(--color-gold)]">Atendimento</h4>
          <ul className="space-y-5 font-light text-gray-400 text-sm">
            <li className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center text-[var(--color-gold)] group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-dark)] transition">
                <i className="ph ph-whatsapp-logo text-xl"></i>
              </div>
              (62) 9112-8449
            </li>
            <li className="flex items-start gap-4 group mt-2 leading-relaxed">
              <a href="https://maps.app.goo.gl/6hJ3PXzTgDDdbHX48" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center flex-shrink-0 text-[var(--color-gold)] group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-dark)] transition">
                <i className="ph ph-map-pin text-xl"></i>
              </a>
              <div>
                <a href="https://maps.app.goo.gl/6hJ3PXzTgDDdbHX48" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-gold)] transition">
                  Rua 24, Qd 21, Lt 09<br/>
                  Residencial Vale do Sol<br/>
                  Anápolis - GO, 75085-697
                </a>
                <span className="text-[10px] uppercase tracking-widest text-[var(--color-gold)] mt-2 block font-bold">
                   Segunda-feira: das 13h às 18h<br /> <br />
                   Terça a sábado: das 07h às 18h 
                </span>
              </div>
            </li>
          </ul>
        </div>

      </div>
      
      {/* Direitos Autorais */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-6">
        <p className="text-center md:text-left">&copy; {new Date().getFullYear()} Beauty Club por Mônica Monteiro. Todos os direitos reservados.</p>
        <div className="flex flex-wrap justify-center gap-6">
          <a href="#" className="hover:text-white transition">Política de Privacidade</a>
          <a href="#" className="hover:text-white transition">Trocas e Devoluções</a>
        </div>
      </div>
    </footer>
  );
}