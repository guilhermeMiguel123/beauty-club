'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const seisCategoriasOficiais = [
  { 
    id: 1, 
    title: "Mechas & Coloração", 
    shortDesc: "Técnicas avançadas de iluminação, correção de cor e tonalização.", 
    coverImg: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800",
    items: [
      { id: '1a', name: "Mechas Loiras", price: "540,00", desc: "Clareamento global com preservação da fibra capilar e tonalização exclusiva.", media: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800" },
      { id: '1b', name: "Mechas Morena Iluminada", price: "540,00", desc: "Efeito sutil e sofisticado de luminosidade mantendo a raiz natural.", media: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800" },
      { id: '1c', name: "Mechas inversas com correção", price: "740,00", desc: "Correção de cor complexa recuperando a profundidade e dimensão dos fios.", media: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=800" },
      { id: '1d', name: "Escurecimento correção de cor", price: "220,00", desc: "Retorno seguro a tons mais escuros com uniformização completa.", media: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800" },
      { id: '1e', name: "Tonalização Morena Iluminada", price: "120,00", desc: "Devolução de brilho e vivacidade para cabelos iluminados.", media: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800" },
      { id: '1f', name: "Tonalização Loiro", price: "120,00", desc: "Neutralização de reflexos indesejados e selagem das cutículas.", media: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800" },
      { id: '1g', name: "Coloração Raiz", price: "130,00", desc: "Retoque de raiz com cobertura perfeita de fios brancos.", media: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800" },
      { id: '1h', name: "Coloração Inteiro (Necessita avaliação)", price: "A avaliar", desc: "Mudança global de cor com diagnóstico prévio em cabine.", media: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800" }
    ]
  },
  { 
    id: 2, 
    title: "Cachoterapia", 
    shortDesc: "Cuidado especializado para nutrição, transição e definição dos cachos.", 
    coverImg: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800",
    items: [
      { id: '2a', name: "Cachoterapia modelagem", price: "89,90", desc: "Tratamento focado na ativação e memorização de curvaturas.", media: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800" },
      { id: '2b', name: "Choque hidratação com ozônio", price: "139,90", desc: "Potencialização profunda de nutrientes através da ozonioterapia.", media: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800" },
      { id: '2c', name: "Soltura de cachos", price: "269,90", desc: "Relaxamento suave para harmonia de volume e definição.", media: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800" }
    ]
  },
  { 
    id: 3, 
    title: "Tratamentos Capilares", 
    shortDesc: "Protocolos intensivos com ozonioterapia e blends (acompanha escova).", 
    coverImg: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800",
    items: [
      { id: '3a', name: "Tratamento Ozonioterapia", price: "179,00", desc: "Oxigenação capilar e revitalização do couro cabeludo.", media: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800" },
      { id: '3b', name: "Tratamento Blend de reconstrução", price: "179,00", desc: "Reposição de massa capilar para fios extremamente danificados.", media: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800" },
      { id: '3c', name: "Tratamento Hidratação", price: "119,00", desc: "Devolução de água e maciez imediata aos fios ressecados.", media: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800" }
    ]
  },
  { 
    id: 4, 
    title: "Cabelos & Estética", 
    shortDesc: "Design de corte, styling, penteados, maquiagem e cuidados com a pele.", 
    coverImg: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800",
    items: [
      { id: '4a', name: "Design de corte", price: "60,00", desc: "Corte personalizado de acordo com o formato do rosto e estilo pessoal.", media: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800" },
      { id: '4b', name: "Babyliss", price: "60,00", desc: "Modelagem com ondas duradouras e acabamento impecável.", media: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800" },
      { id: '4c', name: "Maquiagem", price: "130,00", desc: "Produção social completa para ocasiões especiais.", media: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800" },
      { id: '4d', name: "Penteado", price: "130,00", desc: "Penteados sofisticados, semi-presos ou coques estruturados.", media: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800" },
      { id: '4e', name: "Limpeza de pele + Peeling de diamante", price: "140,00", desc: "Remoção de impurezas e renovação celular facial.", media: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800" }
    ]
  },
  { 
    id: 5, 
    title: "Depilação", 
    shortDesc: "Cuidados corporais completos com procedimentos rápidos e confortáveis.", 
    coverImg: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800",
    items: [
      { id: '5a', name: "Buço", price: "25,00", desc: "Depilação facial delicada.", media: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800" },
      { id: '5b', name: "Axila", price: "25,00", desc: "Procedimento rápido com cera adequada.", media: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800" },
      { id: '5c', name: "Depilação barriga", price: "35,00", desc: "Remoção suave de pelos na região abdominal.", media: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800" },
      { id: '5d', name: "Meia Perna", price: "35,00", desc: "Depilação prática para pernas.", media: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800" },
      { id: '5e', name: "Perna Inteira", price: "55,00", desc: "Cuidado completo para pernas.", media: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800" },
      { id: '5f', name: "Virilha", price: "50,00", desc: "Técnica especializada com total discrição e conforto.", media: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800" }
    ]
  },
  { 
    id: 6, 
    title: "Unhas & Gloss Express", 
    shortDesc: "Manicure, pedicure, spas especializados e protocolo de brilho Gloss Express.", 
    coverImg: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800",
    items: [
      { id: '6a', name: "Pedicure / manicure", price: "35,00", desc: "Cuidado tradicional para mãos ou pés.", media: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800" },
      { id: '6b', name: "Pé e Mão Completo", price: "60,00", desc: "Combo completo de cuidados para unhas.", media: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800" },
      { id: '6c', name: "Spa dos pés", price: "75,00", desc: "Esfoliação, hidratação profunda e relaxamento para os pés.", media: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c1?auto=format&fit=crop&w=800" },
      { id: '6d', name: "Esmaltação", price: "20,00", desc: "Aplicação de esmalte com acabamento profissional.", media: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800" },
      { id: '6e', name: "Spa dos pés + unhas de pés", price: "105,00", desc: "Tratamento completo relaxante com pedicure inclusa.", media: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c1?auto=format&fit=crop&w=800" },
      { id: '6f', name: "Gloss Express (Raiz 2cm + Escova R$50)", price: "90,00", desc: "Retoque rápido de raiz aliado a uma escova modeladora.", media: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800" }
    ]
  }
];

const extractYoutubeVideoId = (url: string) => {
  if (!url) return null;
  let videoId = null;
  if (url.includes('youtube.com/shorts/')) {
    const parts = url.split('/shorts/');
    if (parts[1]) videoId = parts[1].split('?')[0].split('/')[0];
  } else if (url.includes('youtu.be/')) {
    const parts = url.split('youtu.be/');
    if (parts[1]) videoId = parts[1].split('?')[0].split('/')[0];
  } else {
    const ytMatch = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    if (ytMatch && ytMatch[2]?.length === 11) {
      videoId = ytMatch[2];
    }
  }
  return videoId && videoId.length === 11 ? videoId : null;
};

const getThumbnailSrc = (url: string) => {
  if (!url) return '';
  const videoId = extractYoutubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return url;
};

const renderMediaContent = (url: string) => {
  if (!url) return null;

  const videoId = extractYoutubeVideoId(url);
  if (videoId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`}
        title="YouTube video player"
        className="w-full h-full object-cover border-0 z-10 relative"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (url.includes('instagram.com/p/') || url.includes('instagram.com/reel/')) {
    let cleanUrl = url.split('?')[0];
    if (!cleanUrl.endsWith('/')) cleanUrl += '/';
    if (!cleanUrl.endsWith('embed/')) cleanUrl += 'embed/';
    return (
      <iframe
        src={cleanUrl}
        title="Instagram Embed"
        className="w-full h-full border-0 bg-black z-10 relative"
        scrolling="no"
        allowTransparency={true}
        allow="encrypted-media"
      />
    );
  }

  if (url.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i) || url.includes('drive.google.com') || url.includes('uc?export=download')) {
    return (
      <video
        src={url}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover z-10 relative"
      />
    );
  }

  return <img src={url} alt="Mídia do Procedimento" className="w-full h-full object-cover animate-fade-in" />;
};

export default function Services() {
  const { isAdmin } = useCart();
  const [services, setServices] = useState(seisCategoriasOficiais);
  const [isMounted, setIsMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Efeito de Paralaxe no Scroll
  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    async function loadFromFirebase() {
      try {
        const docRef = doc(db, "site_content", "services_grid6");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().value) {
          setServices(docSnap.data().value);
        }
      } catch (err: any) {
        if (err.name === 'AbortError' || err.message?.includes('aborted')) return;
        console.error("Erro ao carregar serviços:", err);
      }
    }
    loadFromFirebase();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const saveToFirebase = async (newServices: any) => {
    setServices(newServices);
    if (isMounted) {
      try {
        await setDoc(doc(db, "site_content", "services_grid6"), { value: newServices });
      } catch (err: any) {
        if (err.name === 'AbortError' || err.message?.includes('aborted')) return;
        alert("Erro ao salvar no Firebase: " + err.message);
      }
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [activeMedia, setActiveMedia] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  
  // Modais de Admin
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [catTitle, setCatTitle] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImg, setCatImg] = useState('');

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemMedia, setItemMedia] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; type: 'cat' | 'item' | null; id: any; title: string }>({ 
    isOpen: false, type: null, id: null, title: '' 
  });

  const currentItem = selectedCategory?.items?.find((i: any) => i.id === activeItemId) || selectedCategory?.items?.[0];

  const handleOpenAddCat = () => {
    setEditingCat(null);
    setCatTitle('');
    setCatDesc('');
    setCatImg('https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800');
    setIsCatModalOpen(true);
  };

  const handleOpenEditCat = (cat: any) => {
    setEditingCat(cat);
    setCatTitle(cat.title);
    setCatDesc(cat.shortDesc);
    setCatImg(cat.coverImg);
    setIsCatModalOpen(true);
  };

  const handleSaveCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCat) {
      const updated = services.map((s: any) => s.id === editingCat.id ? { ...s, title: catTitle, shortDesc: catDesc, coverImg: catImg } : s);
      saveToFirebase(updated);
      if (selectedCategory?.id === editingCat.id) {
        setSelectedCategory({ ...selectedCategory, title: catTitle, shortDesc: catDesc, coverImg: catImg });
      }
    } else {
      const newCat = { id: Date.now(), title: catTitle, shortDesc: catDesc, coverImg: catImg, items: [] };
      saveToFirebase([...services, newCat]);
    }
    setIsCatModalOpen(false);
  };

  const handleOpenAddItem = () => {
    setEditingItem(null);
    setItemName('');
    setItemPrice('');
    setItemDesc('');
    setItemMedia('https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800');
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: any) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemPrice(item.price);
    setItemDesc(item.desc || '');
    setItemMedia(item.media || '');
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = services.map((cat: any) => {
      if (cat.id === selectedCategory.id) {
        let newItems = [...cat.items];
        if (editingItem) {
          newItems = newItems.map((i: any) => i.id === editingItem.id ? { ...i, name: itemName, price: itemPrice, desc: itemDesc, media: itemMedia } : i);
        } else {
          newItems.push({ id: Date.now().toString(), name: itemName, price: itemPrice, desc: itemDesc, media: itemMedia });
        }
        return { ...cat, items: newItems };
      }
      return cat;
    });
    saveToFirebase(updated);
    const updatedCat = updated.find((c: any) => c.id === selectedCategory.id);
    setSelectedCategory(updatedCat);
    if (!activeItemId && updatedCat.items.length > 0) {
      setActiveMedia(updatedCat.items[0].media);
      setActiveItemId(updatedCat.items[0].id);
    }
    setIsItemModalOpen(false);
  };

  const confirmDeleteAction = () => {
    if (deleteConfirm.type === 'cat') {
      const updated = services.filter((s: any) => s.id !== deleteConfirm.id);
      saveToFirebase(updated);
      if (selectedCategory?.id === deleteConfirm.id) setSelectedCategory(null);
    } else if (deleteConfirm.type === 'item') {
      const updated = services.map((cat: any) => {
        if (cat.id === selectedCategory.id) {
          return { ...cat, items: cat.items.filter((i: any) => i.id !== deleteConfirm.id) };
        }
        return cat;
      });
      saveToFirebase(updated);
      const newCat = updated.find((c: any) => c.id === selectedCategory.id);
      setSelectedCategory(newCat);
      if (activeItemId === deleteConfirm.id) {
        setActiveMedia(newCat?.items[0]?.media || null);
        setActiveItemId(newCat?.items[0]?.id || null);
      }
    }
    setDeleteConfirm({ isOpen: false, type: null, id: null, title: '' });
  };

  const scheduleWhatsApp = () => {
    if (!selectedCategory) return;
    const serviceName = currentItem ? currentItem.name : selectedCategory.title;
    const servicePrice = currentItem ? (currentItem.price.includes('A avaliar') ? currentItem.price : `R$ ${currentItem.price}`) : '';
    
    const message = `*✨ AGENDAMENTO | BEAUTY CLUB*\n\nGostaria de verificar a disponibilidade para o serviço: *${serviceName}* ${servicePrice ? `(${servicePrice})` : ''}.`;
    window.open(`https://wa.me/556291128449?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="tratamentos" className="py-24 md:py-36 bg-[var(--color-nude)] relative overflow-hidden">
      {/* Elementos de fundo com Paralaxe */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-gold)]/10 rounded-full blur-[120px] pointer-events-none -mr-32 transition-transform duration-700 ease-out"
        style={{ transform: `translateY(${scrollY * 0.12}px)` }}
      ></div>
      <div 
        className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-[var(--color-rose)]/15 rounded-full blur-[100px] pointer-events-none -ml-28 transition-transform duration-700 ease-out"
        style={{ transform: `translateY(-${scrollY * 0.08}px)` }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 md:mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-[var(--color-gold)]/20 pb-8 relative z-10">
        <div className="transform transition-all duration-500 hover:translate-x-1">
          <span className="uppercase tracking-[0.3em] text-[var(--color-gold)] text-xs font-bold block mb-3 flex items-center gap-2">
            <span className="w-10 h-[2px] bg-[var(--color-gold)] transition-all duration-300"></span> Experiências em Cabine Exclusiva
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[var(--color-dark)] tracking-tight">
            Nossos <span className="italic text-[var(--color-gold)] font-light">Serviços Premium</span>
          </h2>
          <p className="text-[#555] font-light mt-3 max-w-xl text-sm md:text-base leading-relaxed">
            Descubra um portfólio completo de protocolos de alta performance focados em resultados visíveis, sofisticação e máximo bem-estar.
          </p>
        </div>

        {isAdmin && (
          <button 
            onClick={handleOpenAddCat} 
            className="bg-[var(--color-dark)] text-white px-6 py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-[var(--color-gold)] transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl flex items-center gap-2.5 rounded-xl cursor-pointer touch-manipulation group"
          >
            <i className="ph ph-plus-circle text-lg text-[var(--color-gold)] group-hover:text-white transition-colors"></i> 
            Nova Categoria / Seção
          </button>
        )}
      </div>

      {/* Grid de Categorias com Efeitos de Animação e Hover */}
      <div className="max-w-7xl mx-auto px-3 md:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-8 relative z-10 text-left">
        {services.map((category: any, idx: number) => (
          <div 
            key={category.id} 
            role="button"
            tabIndex={0}
            className="group cursor-pointer flex flex-col h-full bg-white/90 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/80 relative touch-manipulation select-none overflow-hidden"
            style={{ animationDelay: `${idx * 100}ms` }}
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory(category); 
              setActiveMedia(category.items?.[0]?.media || category.coverImg); 
              setActiveItemId(category.items?.[0]?.id || null); 
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedCategory(category); 
                setActiveMedia(category.items?.[0]?.media || category.coverImg); 
                setActiveItemId(category.items?.[0]?.id || null);
              }
            }}
          >
            {isAdmin && (
              <div className="absolute top-3 right-3 md:top-4 md:right-4 z-30 flex gap-1.5 md:gap-2">
                <button onClick={(e) => { e.stopPropagation(); handleOpenEditCat(category); }} className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white/95 backdrop-blur-md text-[var(--color-dark)] rounded-xl shadow-md hover:text-[var(--color-gold)] hover:scale-105 border border-gray-100 transition-all cursor-pointer touch-manipulation" title="Editar Seção">
                  <i className="ph-fill ph-pencil-simple text-xs md:text-sm"></i>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ isOpen: true, type: 'cat', id: category.id, title: category.title }); }} className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white/95 backdrop-blur-md text-[var(--color-dark)] rounded-xl shadow-md hover:text-red-500 hover:scale-105 border border-gray-100 transition-all cursor-pointer touch-manipulation" title="Excluir Seção">
                  <i className="ph-fill ph-trash text-xs md:text-sm"></i>
                </button>
              </div>
            )}

            <div className="relative overflow-hidden rounded-xl mb-4 md:mb-5 aspect-[4/3] bg-gray-100 shadow-inner">
                <img 
                  src={category.coverImg} 
                  alt={category.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity pointer-events-none"></div>

                <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-[var(--color-dark)] px-3 py-1 rounded-lg text-[10px] uppercase font-bold tracking-widest shadow-sm">
                  {category.items?.length || 0} Itens
                </span>
            </div>

            <h3 className="font-serif text-base sm:text-lg md:text-xl text-[var(--color-dark)] mb-1.5 md:mb-2 group-hover:text-[var(--color-gold)] transition-colors line-clamp-1 font-medium">
              {category.title}
            </h3>

            <p className="text-gray-600 font-light text-xs md:text-sm mb-5 flex-1 line-clamp-2 leading-relaxed">
              {category.shortDesc}
            </p>

            <div className="mt-auto pt-3.5 md:pt-4 border-t border-gray-100/85 flex items-center justify-between">
              <span className="uppercase tracking-widest text-[var(--color-gold)] text-[11px] font-bold inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                Ver Menu 
              </span>
              <div className="w-8 h-8 rounded-xl bg-[var(--color-nude)] flex items-center justify-center text-[var(--color-dark)] group-hover:bg-[var(--color-gold)] group-hover:text-white transition-all duration-300 shadow-sm">
                <i className="ph ph-arrow-right text-xs md:text-sm"></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Visualizador de Categoria */}
      {selectedCategory && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity" onClick={() => setSelectedCategory(null)}></div>

          <div className="relative bg-white w-full max-w-5xl h-[92vh] md:h-[650px] rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden z-10 transform transition-all animate-scale-up">

            {/* Mídia em Tempo Real (Esquerda) */}
            <div className="w-full md:w-1/2 relative bg-black min-h-[220px] md:min-h-full flex flex-col items-center justify-center overflow-hidden">
              <button 
                onClick={() => setSelectedCategory(null)} 
                className="absolute top-4 right-4 z-30 text-white md:hidden p-2.5 bg-black/65 backdrop-blur-md rounded-full cursor-pointer hover:bg-black transition touch-manipulation shadow-lg"
              >
                <i className="ph ph-x text-base"></i>
              </button>

              {activeMedia ? (
                 <div className="absolute inset-0 w-full h-full">
                   {renderMediaContent(activeMedia)}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none z-20"></div>
                 </div>
              ) : (
                 <div className="text-center p-8 z-10">
                   <i className="ph-fill ph-camera text-5xl mb-3 text-[var(--color-gold)] opacity-60 animate-pulse"></i>
                   <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">Selecione um item ao lado</p>
                 </div>
              )}

              <div className="absolute bottom-6 left-6 right-6 z-30 text-white hidden md:block pointer-events-none">
                <span className="bg-[var(--color-gold)] text-black px-3.5 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-widest mb-2 inline-block shadow-lg">
                  Preview em Tempo Real
                </span>
                <p className="text-xs font-light text-gray-200 line-clamp-1">Toque em qualquer procedimento para visualizar a galeria e mídias integradas.</p>
              </div>
            </div>

            {/* Lista de Itens (Direita) */}
            <div className="w-full md:w-1/2 bg-white flex flex-col relative overflow-hidden flex-1">
              <div className="p-5 md:p-6 pb-4 border-b border-gray-100 flex justify-between items-start bg-white z-20">
                <div>
                  <button 
                    onClick={() => setSelectedCategory(null)} 
                    className="hidden md:flex absolute top-6 right-6 text-gray-400 hover:text-black bg-gray-100 hover:bg-gray-200 w-9 h-9 items-center justify-center rounded-xl cursor-pointer transition touch-manipulation"
                  >
                    <i className="ph ph-x text-lg"></i>
                  </button>
                  <span className="text-[var(--color-gold)] uppercase tracking-[0.2em] text-[10px] font-bold block mb-1">
                    Menu Oficial • Beauty Club
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-[var(--color-dark)] font-medium">
                    {selectedCategory.title}
                  </h3>
                </div>

                {isAdmin && (
                  <button 
                    onClick={handleOpenAddItem} 
                    className="text-[var(--color-gold)] hover:text-[var(--color-dark)] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1 mr-8 md:mr-12 cursor-pointer bg-[var(--color-nude)] px-3.5 py-2 rounded-xl transition hover:scale-105 touch-manipulation shadow-sm"
                  >
                    <i className="ph ph-plus-circle text-base"></i> Novo Item
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-4 md:px-6 py-3 divide-y divide-gray-100 scrollbar-thin">
                {selectedCategory.items.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-sm">Nenhum serviço cadastrado nesta seção ainda.</div>
                ) : (
                  selectedCategory.items.map((item: any) => {
                    const isSelected = activeItemId === item.id || (!activeItemId && selectedCategory.items[0]?.id === item.id);
                    return (
                      <div 
                        key={item.id} 
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { 
                          e.preventDefault();
                          setActiveMedia(item.media); 
                          setActiveItemId(item.id); 
                        }} 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setActiveMedia(item.media); 
                            setActiveItemId(item.id);
                          }
                        }}
                        className={`cursor-pointer group p-3.5 my-2 rounded-2xl transition-all duration-300 touch-manipulation select-none ${isSelected ? 'bg-[var(--color-nude)] border-l-4 border-[var(--color-gold)] shadow-sm translate-x-1' : 'hover:bg-gray-50'}`}
                      >
                        <div className="flex justify-between items-start w-full gap-4">
                          <div className="flex items-start gap-3.5 flex-1">
                            {item.media && (
                              <img src={getThumbnailSrc(item.media)} alt="" className="w-11 h-11 rounded-xl object-cover shadow-sm flex-shrink-0 mt-0.5 bg-gray-100" />
                            )}
                            <div className="flex-1">
                              <span className={`block text-sm md:text-base transition-colors ${isSelected ? 'font-bold text-[var(--color-dark)]' : 'font-medium text-gray-700 group-hover:text-black'}`}>
                                {item.name}
                              </span>
                              {item.desc && (
                                <p className="text-xs text-gray-500 font-light mt-0.5 line-clamp-2 leading-relaxed">
                                  {item.desc}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="font-serif font-bold text-[var(--color-dark)] whitespace-nowrap text-sm md:text-base pt-0.5">
                            {item.price.includes('A avaliar') ? item.price : `R$ ${item.price}`}
                          </span>
                        </div>

                        {isAdmin && (
                          <div className="flex gap-4 mt-3 pt-2.5 border-t border-gray-200/50" onClick={(e) => e.stopPropagation()}>
                             <button onClick={() => handleOpenEditItem(item)} className="text-gray-400 hover:text-[var(--color-gold)] text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 cursor-pointer touch-manipulation transition">
                                <i className="ph-fill ph-pencil-simple text-xs"></i> Editar
                             </button>
                             <button onClick={() => setDeleteConfirm({ isOpen: true, type: 'item', id: item.id, title: item.name })} className="text-gray-400 hover:text-red-500 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 cursor-pointer touch-manipulation transition">
                                <i className="ph-fill ph-trash text-xs"></i> Excluir
                             </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Botão de Agendamento */}
              <div className="p-4 md:p-5 bg-white border-t border-gray-100 z-20 shadow-lg">
                <button 
                  onClick={scheduleWhatsApp} 
                  className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white py-3.5 md:py-4 uppercase font-bold tracking-widest text-[11px] md:text-xs flex items-center justify-center gap-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer touch-manipulation"
                >
                  <i className="ph-fill ph-whatsapp-logo text-lg"></i> Agendar via WhatsApp
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Modal de Adicionar/Editar Categoria (Admin) */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCatModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl z-10 animate-scale-up">
            <h3 className="font-serif text-2xl text-[var(--color-dark)] mb-6 font-medium">
              {editingCat ? 'Editar Categoria' : 'Nova Categoria'}
            </h3>
            <form onSubmit={handleSaveCat} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-600 mb-1">Título da Categoria</label>
                <input 
                  type="text" 
                  value={catTitle} 
                  onChange={(e) => setCatTitle(e.target.value)} 
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-gold)]"
                  placeholder="Ex: Mechas & Coloração"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-gray-600 mb-1">Descrição Curta</label>
                <textarea 
                  value={catDesc} 
                  onChange={(e) => setCatDesc(e.target.value)} 
                  required
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-gold)] resize-none"
                  placeholder="Breve resumo da categoria..."
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-gray-600 mb-1">URL da Imagem de Capa</label>
                <input 
                  type="url" 
                  value={catImg} 
                  onChange={(e) => setCatImg(e.target.value)} 
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-gold)]"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsCatModalOpen(false)} 
                  className="px-5 py-2.5 rounded-xl text-xs uppercase font-bold text-gray-500 hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-xl text-xs uppercase font-bold bg-[var(--color-dark)] text-white hover:bg-[var(--color-gold)] transition cursor-pointer shadow-md"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Adicionar/Editar Item (Admin) */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsItemModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl z-10 animate-scale-up">
            <h3 className="font-serif text-2xl text-[var(--color-dark)] mb-6 font-medium">
              {editingItem ? 'Editar Serviço' : 'Novo Serviço'}
            </h3>
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-600 mb-1">Nome do Serviço</label>
                <input 
                  type="text" 
                  value={itemName} 
                  onChange={(e) => setItemName(e.target.value)} 
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-gold)]"
                  placeholder="Ex: Mechas Loiras"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-600 mb-1">Preço (R$ ou 'A avaliar')</label>
                  <input 
                    type="text" 
                    value={itemPrice} 
                    onChange={(e) => setItemPrice(e.target.value)} 
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-gold)]"
                    placeholder="Ex: 540,00"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-600 mb-1">Mídia (URL Imagem / YouTube / Insta)</label>
                  <input 
                    type="text" 
                    value={itemMedia} 
                    onChange={(e) => setItemMedia(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-gold)]"
                    placeholder="Link da imagem ou vídeo"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-gray-600 mb-1">Descrição Detalhada</label>
                <textarea 
                  value={itemDesc} 
                  onChange={(e) => setItemDesc(e.target.value)} 
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--color-gold)] resize-none"
                  placeholder="Detalhes sobre o procedimento..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsItemModalOpen(false)} 
                  className="px-5 py-2.5 rounded-xl text-xs uppercase font-bold text-gray-500 hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-xl text-xs uppercase font-bold bg-[var(--color-dark)] text-white hover:bg-[var(--color-gold)] transition cursor-pointer shadow-md"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteConfirm({ isOpen: false, type: null, id: null, title: '' })}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl z-10 text-center animate-scale-up">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              <i className="ph-fill ph-warning"></i>
            </div>
            <h3 className="font-serif text-xl text-[var(--color-dark)] mb-2">Confirmar Exclusão</h3>
            <p className="text-gray-500 text-sm mb-6">
              Tem certeza que deseja excluir <span className="font-bold text-gray-700">"{deleteConfirm.title}"</span>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setDeleteConfirm({ isOpen: false, type: null, id: null, title: '' })} 
                className="px-5 py-2.5 rounded-xl text-xs uppercase font-bold text-gray-500 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteAction} 
                className="px-6 py-2.5 rounded-xl text-xs uppercase font-bold bg-red-600 text-white hover:bg-red-700 transition cursor-pointer shadow-md"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}