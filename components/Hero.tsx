'use client';
import { useEffect, useState, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const initialSlides = [
  {
    id: 1,
    title: "Elegância e Sofisticação",
    subtitle: "Descubra a sua melhor versão no Beauty Club",
    img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920"
  },
  {
    id: 2,
    title: "Tecnologia & Cuidado Capilar",
    subtitle: "Ozonioterapia e mechas exclusivas para você",
    img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1920"
  }
];

export default function Carousel() {
  const { isAdmin } = useCart();
  const [slides, setSlides] = useState(initialSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [img, setImg] = useState('');

  // Referências para controle do Touch / Swipe no Mobile
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    setIsMounted(true);
    async function loadCarousel() {
      try {
        const docRef = doc(db, "site_content", "carousel_banners");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().value) {
          setSlides(docSnap.data().value);
        }
      } catch (err: any) {
        if (err.name === 'AbortError' || err.message?.includes('aborted')) return;
        console.error("Erro ao carregar carrossel:", err);
      }
    }
    loadCarousel();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const saveToFirebase = async (newSlides: any) => {
    setSlides(newSlides);
    if (isMounted) {
      try {
        await setDoc(doc(db, "site_content", "carousel_banners"), { value: newSlides });
      } catch (err: any) {
        if (err.name === 'AbortError' || err.message?.includes('aborted')) return;
        alert("Erro ao salvar banners no Firebase: " + err.message);
      }
    }
  };

  const handleOpenAdd = () => {
    setEditingSlide(null);
    setTitle('');
    setSubtitle('');
    setImg('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: any) => {
    setEditingSlide(slide);
    setTitle(slide.title);
    setSubtitle(slide.subtitle);
    setImg(slide.img);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlide) {
      const updated = slides.map((s: any) => s.id === editingSlide.id ? { ...s, title, subtitle, img } : s);
      await saveToFirebase(updated);
    } else {
      const newSlide = { id: Date.now(), title, subtitle, img: img || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920' };
      await saveToFirebase([...slides, newSlide]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (slides.length <= 1) {
      alert("O carrossel precisa ter pelo menos um banner.");
      return;
    }
    if (confirm("Deseja excluir este banner?")) {
      const updated = slides.filter((s: any) => s.id !== id);
      await saveToFirebase(updated);
      if (currentIndex >= updated.length) setCurrentIndex(0);
    }
  };

  // Funções para manipulação do gesto Touch (Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Limite mínimo para considerar um swipe

    if (distance > minSwipeDistance) {
      // Deslizou para a esquerda -> Próximo slide
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    } else if (distance < -minSwipeDistance) {
      // Deslizou para a direita -> Slide anterior
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }

    // Reseta valores
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section 
      className="relative h-[85vh] w-full overflow-hidden bg-black select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide: any, idx: number) => (
        <div 
          key={slide.id} 
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img src={slide.img} alt={slide.title} className="w-full h-full object-cover pointer-events-none" />
          
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
            <span className="uppercase tracking-[0.3em] text-[var(--color-gold)] text-xs md:text-sm font-bold mb-4 drop-shadow-md">
              {slide.subtitle}
            </span>
            <h1 className="text-4xl md:text-7xl font-serif text-white mb-8 drop-shadow-lg leading-tight">
              {slide.title}
            </h1>
            <a 
              href="#produtos" 
              className="bg-white text-[var(--color-dark)] px-8 py-4 uppercase tracking-widest text-xs font-bold rounded-sm hover:bg-[var(--color-gold)] hover:text-white transition shadow-2xl cursor-pointer"
            >
              Explorar Produtos
            </a>
          </div>
        </div>
      ))}

      {isAdmin && (
        <div className="absolute bottom-6 right-6 z-30 flex gap-3">
          <button onClick={handleOpenAdd} className="bg-white/90 text-[var(--color-dark)] px-4 py-3 rounded-full shadow-lg hover:bg-[var(--color-gold)] hover:text-white transition flex items-center gap-2 text-xs uppercase font-bold cursor-pointer">
            <i className="ph ph-plus-circle text-lg"></i> Novo Banner
          </button>
          {slides[currentIndex] && (
            <>
              <button onClick={() => handleOpenEdit(slides[currentIndex])} className="bg-white/90 text-[var(--color-dark)] p-3 rounded-full shadow-lg hover:text-[var(--color-gold)] transition cursor-pointer" title="Editar Banner Atual">
                <i className="ph-fill ph-pencil-simple text-lg"></i>
              </button>
              <button onClick={() => handleDelete(slides[currentIndex].id)} className="bg-white/90 text-[var(--color-dark)] p-3 rounded-full shadow-lg hover:text-red-500 transition cursor-pointer" title="Excluir Banner Atual">
                <i className="ph-fill ph-trash text-lg"></i>
              </button>
            </>
          )}
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentIndex(idx)} 
            className={`w-3 h-3 rounded-full transition-all cursor-pointer ${idx === currentIndex ? 'bg-[var(--color-gold)] w-8' : 'bg-white/50'}`}
          ></button>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-black cursor-pointer"><i className="ph ph-x text-xl"></i></button>
            <h3 className="font-serif text-2xl text-[var(--color-dark)] mb-6">{editingSlide ? "Editar Banner" : "Novo Banner"}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-600 mb-1.5 tracking-wider">Título Principal</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[var(--color-gold)] transition" required />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-600 mb-1.5 tracking-wider">Subtítulo</label>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[var(--color-gold)] transition" required />
              </div>
              
              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-600 mb-1.5 tracking-wider">URL da Imagem de Fundo</label>
                <input 
                  type="url" 
                  placeholder="https://exemplo.com/banner.jpg"
                  value={img} 
                  onChange={(e) => setImg(e.target.value)} 
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[var(--color-gold)] transition bg-white text-gray-700" 
                  required
                />
                {img && <img src={img} alt="Preview" className="mt-3 h-24 w-full object-cover rounded-xl shadow-md bg-gray-100" />}
              </div>

              <button type="submit" className="w-full bg-[var(--color-dark)] text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-[var(--color-gold)] transition rounded-xl mt-2 cursor-pointer shadow-lg">
                Salvar Banner
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}