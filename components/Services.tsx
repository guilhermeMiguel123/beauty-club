'use client';
import { useEffect, useState } from 'react';
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
      { id: '1a', name: "Mechas Loiras", price: "540,00", media: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800" },
      { id: '1b', name: "Mechas Morena Iluminada", price: "540,00", media: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800" },
      { id: '1c', name: "Mechas inversas com correção", price: "740,00", media: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=800" },
      { id: '1d', name: "Escurecimento correção de cor", price: "220,00", media: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800" },
      { id: '1e', name: "Tonalização Morena Iluminada", price: "120,00", media: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800" },
      { id: '1f', name: "Tonalização Loiro", price: "120,00", media: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800" },
      { id: '1g', name: "Coloração Raiz", price: "130,00", media: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800" },
      { id: '1h', name: "Coloração Inteiro (Necessita avaliação)", price: "A avaliar", media: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800" }
    ]
  },
  { 
    id: 2, 
    title: "Cachoterapia", 
    shortDesc: "Cuidado especializado para nutrição, transição e definição dos cachos.", 
    coverImg: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800",
    items: [
      { id: '2a', name: "Cachoterapia modelagem", price: "89,90", media: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800" },
      { id: '2b', name: "Choque hidratação com ozônio", price: "139,90", media: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800" },
      { id: '2c', name: "Soltura de cachos", price: "269,90", media: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800" }
    ]
  },
  { 
    id: 3, 
    title: "Tratamentos Capilares", 
    shortDesc: "Protocolos intensivos com ozonioterapia e blends (acompanha escova).", 
    coverImg: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800",
    items: [
      { id: '3a', name: "Tratamento Ozonioterapia", price: "179,00", media: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800" },
      { id: '3b', name: "Tratamento Blend de reconstrução", price: "179,00", media: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800" },
      { id: '3c', name: "Tratamento Hidratação", price: "119,00", media: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800" }
    ]
  },
  { 
    id: 4, 
    title: "Cabelos & Estética", 
    shortDesc: "Design de corte, styling, penteados, maquiagem e cuidados com a pele.", 
    coverImg: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800",
    items: [
      { id: '4a', name: "Design de corte", price: "60,00", media: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800" },
      { id: '4b', name: "Babyliss", price: "60,00", media: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800" },
      { id: '4c', name: "Maquiagem", price: "130,00", media: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800" },
      { id: '4d', name: "Penteado", price: "130,00", media: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800" },
      { id: '4e', name: "Limpeza de pele + Peeling de diamante", price: "140,00", media: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800" }
    ]
  },
  { 
    id: 5, 
    title: "Depilação", 
    shortDesc: "Cuidados corporais completos com procedimentos rápidos e confortáveis.", 
    coverImg: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800",
    items: [
      { id: '5a', name: "Buço", price: "25,00", media: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800" },
      { id: '5b', name: "Axila", price: "25,00", media: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800" },
      { id: '5c', name: "Depilação barriga", price: "35,00", media: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800" },
      { id: '5d', name: "Meia Perna", price: "35,00", media: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800" },
      { id: '5e', name: "Perna Inteira", price: "55,00", media: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800" },
      { id: '5f', name: "Virilha", price: "50,00", media: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800" }
    ]
  },
  { 
    id: 6, 
    title: "Unhas & Gloss Express", 
    shortDesc: "Manicure, pedicure, spas especializados e protocolo de brilho Gloss Express.", 
    coverImg: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800",
    items: [
      { id: '6a', name: "Pedicure / manicure", price: "35,00", media: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800" },
      { id: '6b', name: "Pé e Mão Completo", price: "60,00", media: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800" },
      { id: '6c', name: "Spa dos pés", price: "75,00", media: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c1?auto=format&fit=crop&w=800" },
      { id: '6d', name: "Esmaltação", price: "20,00", media: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800" },
      { id: '6e', name: "Spa dos pés + unhas de pés", price: "105,00", media: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c1?auto=format&fit=crop&w=800" },
      { id: '6f', name: "Gloss Express (Raiz 2cm + Escova R$50)", price: "90,00", media: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800" }
    ]
  }
];

export default function Services() {
  const { isAdmin } = useCart();
  const [services, setServices] = useState(seisCategoriasOficiais);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [catTitle, setCatTitle] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImg, setCatImg] = useState('');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemMedia, setItemMedia] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; type: 'cat' | 'item' | null; id: any; title: string }>({ isOpen: false, type: null, id: null, title: '' });

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
    setItemMedia('https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800');
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: any) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemPrice(item.price);
    setItemMedia(item.media || '');
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = services.map((cat: any) => {
      if (cat.id === selectedCategory.id) {
        let newItems = [...cat.items];
        if (editingItem) {
          newItems = newItems.map((i: any) => i.id === editingItem.id ? { ...i, name: itemName, price: itemPrice, media: itemMedia } : i);
        } else {
          newItems.push({ id: Date.now().toString(), name: itemName, price: itemPrice, media: itemMedia });
        }
        return { ...cat, items: newItems };
      }
      return cat;
    });
    saveToFirebase(updated);
    setSelectedCategory(updated.find((c: any) => c.id === selectedCategory.id));
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
      setSelectedCategory(updated.find((c: any) => c.id === selectedCategory.id));
      if (activeItemId === deleteConfirm.id) {
        setActiveMedia(null);
        setActiveItemId(null);
      }
    }
    setDeleteConfirm({ isOpen: false, type: null, id: null, title: '' });
  };

  const scheduleWhatsApp = () => {
    if (!selectedCategory) return;
    window.open(`https://wa.me/556291128449?text=${encodeURIComponent(`*✨ AGENDAMENTO | BEAUTY CLUB*\n\nGostaria de verificar a disponibilidade para: *${selectedCategory.title}*.`)}`, '_blank');
  };

  return (
    <section id="tratamentos" className="py-20 md:py-32 bg-[var(--color-nude)] relative overflow-hidden">
      {/* Elementos decorativos de luxo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-gold)]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-rose)]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 md:mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-[var(--color-gold)]/20 pb-8 relative z-10">
        <div>
          <span className="uppercase tracking-[0.25em] text-[var(--color-gold)] text-xs font-semibold block mb-3 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[var(--color-gold)]"></span> Experiências em Cabine Exclusiva
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[var(--color-dark)]">
            Nossos <span className="italic text-[var(--color-gold)]">Serviços Premium</span>
          </h2>
          <p className="text-[#555] font-light mt-3 max-w-xl text-sm md:text-base leading-relaxed">
            Descubra um portfólio completo de protocolos de alta performance focados en resultados visíveis, sofisticação e máximo bem-estar.
          </p>
        </div>

        {isAdmin && (
          <button 
            onClick={handleOpenAddCat} 
            className="bg-[var(--color-dark)] text-white px-6 py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-[var(--color-gold)] transition-all duration-300 flex items-center gap-2.5 rounded-xl shadow-lg cursor-pointer group"
          >
            <i className="ph ph-plus-circle text-lg text-[var(--color-gold)] group-hover:text-white transition"></i> 
            Nova Categoria / Seção
          </button>
        )}
      </div>
        
      {/* Grid de Cards: 2 colunas no mobile (formando exatamente 3 fileiras de 2 containers) e 3 colunas em telas maiores */}
      <div className="max-w-7xl mx-auto px-3 md:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-8 relative z-10 text-left">
        {services.map((category: any, index: number) => (
          <div 
            key={category.id} 
            style={{ animationDelay: `${index * 100}ms` }}
            className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-md hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 border border-white/80 relative animate-in fade-in zoom-in-95" 
            onClick={() => { 
              setSelectedCategory(category); 
              setActiveMedia(category.coverImg); 
              setActiveItemId(null); 
            }}
          >
            {isAdmin && (
              <div className="absolute top-2.5 right-2.5 md:top-4 md:right-4 z-30 flex gap-1 md:gap-2">
                <button onClick={(e) => { e.stopPropagation(); handleOpenEditCat(category); }} className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center bg-white/90 backdrop-blur-md text-[var(--color-dark)] rounded-full shadow-md hover:text-[var(--color-gold)] border border-gray-100 transition cursor-pointer" title="Editar Seção">
                  <i className="ph-fill ph-pencil-simple text-xs md:text-sm"></i>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ isOpen: true, type: 'cat', id: category.id, title: category.title }); }} className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center bg-white/90 backdrop-blur-md text-[var(--color-dark)] rounded-full shadow-md hover:text-red-500 border border-gray-100 transition cursor-pointer" title="Excluir Seção">
                  <i className="ph-fill ph-trash text-xs md:text-sm"></i>
                </button>
              </div>
            )}

            <div className="relative overflow-hidden rounded-xl md:rounded-2xl mb-3 md:mb-5 aspect-[4/3] bg-gray-100 shadow-inner">
                <img 
                  src={category.coverImg} 
                  alt={category.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-75 group-hover:opacity-40 transition-opacity duration-500"></div>
                
                <span className="absolute bottom-2.5 left-2.5 md:bottom-3 md:left-3 bg-white/90 backdrop-blur-md text-[var(--color-dark)] px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-[10px] uppercase font-bold tracking-widest shadow-sm">
                  {category.items?.length || 0} Itens
                </span>
            </div>
            
            <h3 className="font-serif text-sm sm:text-base md:text-2xl text-[var(--color-dark)] mb-1 md:mb-2 group-hover:text-[var(--color-gold)] transition-colors line-clamp-1">
              {category.title}
            </h3>
            
            <p className="text-gray-600 font-light text-[11px] sm:text-xs md:text-sm mb-4 md:mb-6 flex-1 line-clamp-2 leading-relaxed">
              {category.shortDesc}
            </p>

            <div className="mt-auto pt-3 md:pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="uppercase tracking-widest text-[var(--color-gold)] text-[10px] md:text-[11px] font-bold inline-flex items-center gap-1.5 md:gap-2 group-hover:translate-x-1 transition-transform">
                  Ver Menu 
              </span>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[var(--color-nude)] flex items-center justify-center text-[var(--color-dark)] group-hover:bg-[var(--color-gold)] group-hover:text-white transition-colors duration-300">
                <i className="ph ph-arrow-right text-xs md:text-sm"></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Gaveta de Catálogo Animada */}
      {selectedCategory && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={() => setSelectedCategory(null)}></div>
          
          <div className="relative bg-white w-full max-w-5xl h-[90vh] md:h-[640px] rounded-t-[2.5rem] md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden z-10 animate-in zoom-in-95 slide-in-from-bottom duration-300">
            
            {/* Lado Esquerdo: Vitrine de Mídia */}
            <div className="w-full md:w-1/2 relative bg-gradient-to-br from-gray-900 to-black min-h-[200px] md:min-h-full flex flex-col items-center justify-center overflow-hidden">
              <button 
                onClick={() => setSelectedCategory(null)} 
                className="absolute top-4 right-4 z-30 text-white md:hidden p-2.5 bg-black/60 backdrop-blur-md rounded-full cursor-pointer hover:bg-black transition"
              >
                <i className="ph ph-x text-base"></i>
              </button>

              {activeMedia ? (
                 <div className="absolute inset-0 w-full h-full animate-in fade-in duration-500">
                   <img src={activeMedia} alt="Mídia do Procedimento" className="w-full h-full object-cover opacity-85 scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                 </div>
              ) : (
                 <div className="text-center p-8 z-10">
                   <i className="ph-fill ph-camera text-5xl mb-3 text-[var(--color-gold)] opacity-60"></i>
                   <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">Selecione um item ao lado</p>
                 </div>
              )}

              <div className="absolute bottom-6 left-6 right-6 z-20 text-white hidden md:block">
                <span className="bg-[var(--color-gold)] text-black px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest mb-2 inline-block shadow">
                  Preview em Tempo Real
                </span>
                <p className="text-xs font-light text-gray-200 line-clamp-1">Toque em qualquer procedimento para visualizar a galeria e detalhes exclusivos.</p>
              </div>
            </div>

            {/* Lado Direito: Lista de Serviços & Preços */}
            <div className="w-full md:w-1/2 bg-white flex flex-col relative overflow-hidden flex-1">
              <div className="p-5 md:p-6 pb-4 border-b border-gray-100 flex justify-between items-start bg-white z-20">
                <div>
                  <button 
                    onClick={() => setSelectedCategory(null)} 
                    className="hidden md:flex absolute top-6 right-6 text-gray-400 hover:text-black bg-gray-100 hover:bg-gray-200 w-9 h-9 items-center justify-center rounded-full cursor-pointer transition"
                  >
                    <i className="ph ph-x text-lg"></i>
                  </button>
                  <span className="text-[var(--color-gold)] uppercase tracking-[0.2em] text-[10px] font-bold block mb-1">
                    Menu Oficial • Beauty Club
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-[var(--color-dark)]">
                    {selectedCategory.title}
                  </h3>
                </div>

                {isAdmin && (
                  <button 
                    onClick={handleOpenAddItem} 
                    className="text-[var(--color-gold)] hover:text-[var(--color-dark)] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1 mr-8 md:mr-12 cursor-pointer bg-[var(--color-nude)] px-3 py-2 rounded-lg transition"
                  >
                    <i className="ph ph-plus-circle text-base"></i> Novo Item
                  </button>
                )}
              </div>

              {/* Lista Scrollável de Serviços */}
              <div className="flex-1 overflow-y-auto px-4 md:px-6 py-3 divide-y divide-gray-100">
                {selectedCategory.items.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-sm">Nenhum serviço cadastrado nesta seção ainda.</div>
                ) : (
                  selectedCategory.items.map((item: any) => (
                    <div 
                      key={item.id} 
                      onClick={() => { setActiveMedia(item.media); setActiveItemId(item.id); }} 
                      className={`cursor-pointer group p-3.5 my-2 rounded-2xl transition-all duration-300 ${activeItemId === item.id ? 'bg-[var(--color-nude)] border-l-4 border-[var(--color-gold)] shadow-sm' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex justify-between items-center w-full gap-4">
                        <div className="flex items-center gap-3">
                          {item.media && (
                            <img src={item.media} alt="" className="w-10 h-10 rounded-xl object-cover shadow-sm flex-shrink-0" />
                          )}
                          <span className={`text-sm md:text-base transition-colors ${activeItemId === item.id ? 'font-bold text-[var(--color-dark)]' : 'font-medium text-gray-700 group-hover:text-black'}`}>
                            {item.name}
                          </span>
                        </div>
                        <span className="font-serif font-bold text-[var(--color-dark)] whitespace-nowrap text-sm md:text-base">
                          {item.price.includes('A avaliar') ? item.price : `R$ ${item.price}`}
                        </span>
                      </div>

                      {isAdmin && (
                        <div className="flex gap-4 mt-2.5 pt-2.5 border-t border-gray-200/50" onClick={(e) => e.stopPropagation()}>
                           <button onClick={() => handleOpenEditItem(item)} className="text-gray-400 hover:text-[var(--color-gold)] text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 cursor-pointer">
                              <i className="ph-fill ph-pencil-simple text-xs"></i> Editar
                           </button>
                           <button onClick={() => setDeleteConfirm({ isOpen: true, type: 'item', id: item.id, title: item.name })} className="text-gray-400 hover:text-red-500 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1 cursor-pointer">
                              <i className="ph-fill ph-trash text-xs"></i> Excluir
                           </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              
              {/* Rodapé do Modal */}
              <div className="p-4 md:p-6 bg-white border-t border-gray-100 z-20 shadow-lg">
                <button 
                  onClick={scheduleWhatsApp} 
                  className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white py-4 uppercase font-bold tracking-widest text-xs flex items-center justify-center gap-2.5 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer"
                >
                  <i className="ph-fill ph-whatsapp-logo text-xl"></i> Agendar {selectedCategory.title} pelo WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Seção (Admin) - URL Input */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsCatModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-black cursor-pointer"><i className="ph ph-x text-xl"></i></button>
            <h3 className="font-serif text-2xl text-[var(--color-dark)] mb-6">{editingCat ? "Editar Seção" : "Nova Seção"}</h3>
            <form onSubmit={handleSaveCat} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-600 mb-1.5 tracking-wider">Título da Seção</label>
                <input type="text" value={catTitle} onChange={(e) => setCatTitle(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[var(--color-gold)] transition" required />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-600 mb-1.5 tracking-wider">Descrição Curta</label>
                <input type="text" value={catDesc} onChange={(e) => setCatDesc(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[var(--color-gold)] transition" />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-600 mb-1.5 tracking-wider">URL da Imagem de Capa</label>
                <input 
                  type="url" 
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={catImg} 
                  onChange={(e) => setCatImg(e.target.value)} 
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[var(--color-gold)] transition bg-white text-gray-700" 
                  required
                />
                {catImg && <img src={catImg} alt="Preview" className="mt-3 h-24 w-full object-cover rounded-xl shadow-md bg-gray-100" />}
              </div>
              <button type="submit" className="w-full bg-[var(--color-dark)] text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-[var(--color-gold)] transition rounded-xl mt-2 cursor-pointer shadow-lg">
                Salvar Seção
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Item (Admin) - URL Input */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsItemModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-black cursor-pointer"><i className="ph ph-x text-xl"></i></button>
            <h3 className="font-serif text-2xl text-[var(--color-dark)] mb-6">{editingItem ? "Editar Item" : "Novo Item"}</h3>
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-600 mb-1.5 tracking-wider">Nome do Procedimento</label>
                <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[var(--color-gold)] transition" required />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-600 mb-1.5 tracking-wider">Preço (R$)</label>
                <input type="text" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[var(--color-gold)] transition" required />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-600 mb-1.5 tracking-wider">URL da Mídia (Foto ou Vídeo)</label>
                <input 
                  type="url" 
                  placeholder="https://exemplo.com/midia.jpg ou mp4"
                  value={itemMedia} 
                  onChange={(e) => setItemMedia(e.target.value)} 
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[var(--color-gold)] transition bg-white text-gray-700" 
                />
                {itemMedia && <img src={itemMedia} alt="Preview" className="mt-3 h-24 w-full object-cover rounded-xl shadow-md bg-gray-100" />}
              </div>
              <button type="submit" className="w-full bg-[var(--color-dark)] text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-[var(--color-gold)] transition rounded-xl mt-2 cursor-pointer shadow-lg">
                Salvar Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              <i className="ph-fill ph-warning"></i>
            </div>
            <h3 className="font-serif text-xl text-[var(--color-dark)] mb-2">Excluir {deleteConfirm.type === 'cat' ? 'Seção' : 'Item'}?</h3>
            <p className="text-gray-500 text-xs mb-6">Tem certeza que deseja excluir &quot;{deleteConfirm.title}&quot;? Esta ação não poderá ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm({ isOpen: false, type: null, id: null, title: '' })} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition cursor-pointer">
                Cancelar
              </button>
              <button onClick={confirmDeleteAction} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-600 transition cursor-pointer">
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}