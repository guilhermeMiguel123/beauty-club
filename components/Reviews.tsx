'use client';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const avaliacoesFallback = [
  { author_name: "Carolina Freitas", relative_time_description: "há 2 semanas", text: "O serviço facial transformou completamente a textura da minha pele. O ambiente do salão e o atendimento da Mônica são impecáveis!" },
  { author_name: "Mariana Silva", relative_time_description: "há 1 mês", text: "Comprei os produtos home care e nunca vi resultados tão rápidos de hidratação. Suporte via WhatsApp maravilhoso!" },
  { author_name: "Juliana Costa", relative_time_description: "há 2 meses", text: "Sou cliente para tratamentos há mais de 1 ano. É o meu oficial momento de desestressar da semana. Recomendo demais!" }
];

export default function Reviews() {
  const [avaliacoes, setAvaliacoes] = useState<any[]>(avaliacoesFallback);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setAvaliacoes(data);
        }
      } catch (error) {
        // Mantém o fallback caso a API não esteja configurada ainda
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="py-24 bg-[var(--color-nude-light)]">
      <div className="max-w-5xl mx-auto px-4 text-center">
        
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-[#4285F4]">G</span>
            <span className="text-2xl font-bold text-[#EA4335]">o</span>
            <span className="text-2xl font-bold text-[#FBBC05]">o</span>
            <span className="text-2xl font-bold text-[#4285F4]">g</span>
            <span className="text-2xl font-bold text-[#34A853]">l</span>
            <span className="text-2xl font-bold text-[#EA4335]">e</span>
          </div>
          <div className="flex gap-1 text-[var(--color-gold)] text-xl mb-2">
            <i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i><i className="ph-fill ph-star"></i>
          </div>
          <p className="text-sm text-gray-500 font-bold">5.0 de 5 estrelas (Google Maps)</p>
        </div>

        <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-dark)] mb-16">
          Histórias Reais de <span className="italic text-[var(--color-gold)]">Transformação</span>
        </h2>
        
        <Swiper modules={[Autoplay, Pagination]} loop={true} autoplay={{ delay: 6000 }} pagination={{ clickable: true }} className="pb-12">
          {avaliacoes.map((av, index) => (
            <SwiperSlide key={index} className="px-4 md:px-20">
              <i className="ph-fill ph-quotes text-5xl text-[var(--color-rose)] mb-6 inline-block opacity-50"></i>
              <p className="text-lg md:text-2xl font-light text-[#4D4D4D] italic leading-relaxed mb-8">"{av.text}"</p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-gold)] text-white flex items-center justify-center font-serif text-xl">
                  {av.author_name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="font-bold uppercase tracking-widest text-xs text-[var(--color-dark)]">{av.author_name}</div>
                  <div className="text-xs text-gray-400 mt-1">{av.relative_time_description}</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-12">
           <a href="https://maps.app.goo.gl/6hJ3PXzTgDDdbHX48" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest font-bold text-[var(--color-gold)] hover:text-[var(--color-dark)] transition border-b border-[var(--color-gold)] pb-1">
             Ver todas as avaliações no Google Maps <i className="ph ph-arrow-right"></i>
           </a>
        </div>

      </div>
    </section>
  );
}