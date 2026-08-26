'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const feedImagens = [
  "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop",
  "/WhatsApp Image 2026-08-13 at 11.50.27 (1).jpeg",
  "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop",
  "/WhatsApp Image 2026-08-13 at 11.50.27 (2).jpeg"
];

export default function InstagramFeed() {
  const instaLink = "https://www.instagram.com/p/DYDhyLGiH9y/?img_index=5&igsh=dzRuNm04ejg2enlo&igsi=dzRuNm04ejg2enlo";

  return (
    <section className="py-2 border-y border-[var(--color-nude)] bg-white">
      <Swiper
        modules={[Autoplay]}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        slidesPerView={2}
        breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 5 } }}
        className="w-full h-64 md:h-80"
      >
        {feedImagens.map((img, idx) => (
          <SwiperSlide key={idx}>
            <a href={instaLink} target="_blank" rel="noopener noreferrer" className="relative block w-full h-full group cursor-pointer">
              <img src={img} alt="Instagram Post" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[var(--color-gold)]/80 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col items-center justify-center text-white">
                <i className="ph ph-instagram-logo text-4xl mb-2"></i>
                <span className="text-xs font-bold uppercase tracking-widest">Ver no Instagram</span>
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}