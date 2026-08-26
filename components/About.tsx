'use client';

export default function About() {
  const scheduleWhatsApp = () => {
    const text = "*✨ AGENDAMENTO | BEAUTY CLUB*\n\nOlá, Mônica! Estava no site e gostaria de agendar um horário.";
    window.open(`https://wa.me/5562991128449?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="sobre" className="bg-white flex flex-col md:flex-row min-h-[80vh]">
      
      {/* Imagem Apresentação Profissional (Sem Cortes) */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[var(--color-nude-light)] p-8 md:p-16">
        <img 
          src="/WhatsApp Image 2026-08-18 at 13.19.58.jpeg" 
          alt="Mônica Monteiro" 
          className="w-full max-w-md h-auto rounded-sm shadow-2xl border border-[var(--color-rose-light)]"
        />
      </div>
        
      {/* Texto Editorial */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-10 md:p-20 lg:p-28 bg-white">
        <span className="uppercase tracking-[0.25em] text-[var(--color-gold)] text-xs font-bold block mb-6">
          A Nossa Essência
        </span>
          
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--color-dark)] leading-tight mb-8">
          Seja bem-vinda ao <br/><span className="italic text-[var(--color-gold)]">Beauty Club.</span>
        </h2>
          
        <div className="space-y-6 text-[#4D4D4D] font-light text-base md:text-lg leading-relaxed mb-12">
          <p>Um espaço criado para mulheres que valorizam beleza, cuidado e autoestima. Aqui, cada atendimento é pensado de forma personalizada para proporcionar uma experiência leve, acolhedora e sofisticada.</p>
          <p>Especialistas em mechas, cachoterapia, gloss express, tratamentos capilares, cortes, design de sobrancelhas, unhas e muito mais, trabalhamos para realçar sua beleza com técnica, cuidado e naturalidade.</p>
          <p className="font-semibold text-[var(--color-dark)]">Sinta-se em casa no espaço que foi preparado para cuidar de você.</p>
        </div>
           
        <button onClick={scheduleWhatsApp} className="bg-[var(--color-dark)] text-white px-10 py-5 uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-3 hover:bg-[var(--color-gold)] transition duration-300 shadow-xl w-fit">
          <i className="ph-fill ph-whatsapp-logo text-xl"></i> Agendar meu Horário
        </button>
      </div>

    </section>
  );
}