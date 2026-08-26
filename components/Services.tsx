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
    gridSpan: "col-span-1",
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
    gridSpan: "col-span-1",
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
    gridSpan: "col-span-1",
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
    gridSpan: "col-span-1",
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
    gridSpan: "col-span-1",
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
    gridSpan: "col-span-1",
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

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

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
  const [catGridSpan, setCatGridSpan] = useState('col-span-1');
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
    setCatGridSpan('col-span-1');
    setIsCatModalOpen(true);
  };

  const handleOpenEditCat = (cat: any) => {
    setEditingCat(cat);
    setCatTitle(cat.title);
    setCatDesc(cat.shortDesc);
    setCatImg(cat.coverImg);
    setCatGridSpan(cat.gridSpan || 'col-span-1');
    setIsCatModalOpen(true);
  };

  const handleSaveCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCat) {
      const updated = services.map((s: any) => s.id === editingCat.id ? { ...s, title: catTitle, shortDesc: catDesc, coverImg: catImg, gridSpan: catGridSpan } : s);
      saveToFirebase(updated);
      if (selectedCategory?.id === editingCat.id) {
        setSelectedCategory({ ...selectedCategory, title: catTitle, shortDesc: catDesc, coverImg: catImg, gridSpan: catGridSpan });
      }
    } else {
      const newCat = { id: Date.now(), title: catTitle, shortDesc: catDesc, coverImg: catImg, gridSpan: catGridSpan, items: [] };
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
    <section id="tratamentos" className="py-24 md:py-32 bg-[var(--color-nude)] relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white pb-6">
        <div>
          <span className="uppercase tracking-[0.2em] text-[var(--color-gold)] text-xs md:text-sm font-bold block mb-4">Experiências em Cabine</span>
          <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-dark)] mb-4">Nossos <span className="italic text-[var(--color-gold)]">Serviços Premium</span></h2>
          <p className="text-[#4D4D4D] font-light max-w-2xl">Descubra um portfólio completo de protocolos focados em resultados visíveis e máximo relaxamento.</p>
        </div>

        {isAdmin && (
          <button onClick={handleOpenAddCat} className="bg-[var(--color-dark)] text-white px-6 py-3 text-xs uppercase font-bold tracking-widest hover:bg-[var(--color-gold)] transition flex items-center gap-2 rounded-sm shadow-xl cursor-pointer">
            <i className="ph ph-plus-circle text-xl"></i> Nova Categoria / Seção
          </button>
        )}
      </div>
        
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14 text-left">
        {services.map((category: any) => (
          <div 
            key={category.id} 
            className={`group cursor-pointer flex flex-col h-full relative pt-4 ${category.gridSpan || 'col-span-1'}`} 
            onClick={() => { setSelectedCategory(category); setActiveMedia(null); setActiveItemId(null); }}
          >
            {isAdmin && (
              <div className="absolute top-0 right-0 z-30 flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); handleOpenEditCat(category); }} className="w-9 h-9 flex items-center justify-center bg-white text-[var(--color-dark)] rounded-full shadow-lg hover:text-[var(--color-gold)] border border-gray-200 transition cursor-pointer" title="Editar Seção">
                  <i className="ph-fill ph-pencil-simple text-sm"></i>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ isOpen: true, type: 'cat', id: category.id, title: category.title }); }} className="w-9 h-9 flex items-center justify-center bg-white text-[var(--color-dark)] rounded-full shadow-lg hover:text-red-500 border border-gray-200 transition cursor-pointer" title="Excluir Seção">
                  <i className="ph-fill ph-trash text-sm"></i>
                </button>
              </div>
            )}

            <div className="relative overflow-hidden rounded-t-full mb-6 bg-[var(--color-nude)] shadow-lg border-4 border-white group-hover:border-[var(--color-rose-light)] transition duration-500">
                <img src={category.coverImg} alt={category.title} className="w-full h-72 md:h-80 object-cover transform group-hover:scale-110 transition duration-700 ease-out" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
                    <span className="bg-white/95 text-[var(--color-dark)] px-6 py-4 uppercase tracking-widest text-[11px] font-bold rounded-full flex items-center gap-2 shadow-xl">
                        <i className="ph-fill ph-play-circle text-[var(--color-gold)] text-2xl"></i> Ver Catálogo
                    </span>
                </div>
            </div>
            
            <h3 className="font-serif text-2xl md:text-3xl text-[var(--color-dark)] mb-3">{category.title}</h3>
            <p className="text-[#4D4D4D] font-light text-sm md:text-base mb-6 flex-1">{category.shortDesc}</p>
            <span className="mt-auto border-t border-[var(--color-rose)] pt-4 uppercase tracking-widest text-[var(--color-gold)] text-[10px] md:text-xs font-bold inline-flex items-center gap-2">
                Abrir Portfólio <i className="ph ph-arrow-right text-lg"></i>
            </span>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedCategory(null)}></div>
          <div className="relative bg-white w-full max-w-5xl md:h-[600px] h-[85vh] rounded-md shadow-2xl flex flex-col md:flex-row overflow-hidden z-10">
            <div className="w-full md:w-1/2 relative bg-[var(--color-nude-light)] min-h-[250px] md:min-h-full flex flex-col items-center justify-center border-r border-[var(--color-nude)]">
              <button onClick={() => setSelectedCategory(null)} className="absolute top-4 right-4 z-20 text-white md:hidden p-2 bg-black/50 rounded-full cursor-pointer"><i className="ph ph-x text-lg"></i></button>
              {activeMedia ? (
                 <div className="absolute inset-0 w-full h-full"><img src={activeMedia} alt="Procedimento" className="w-full h-full object-cover opacity-90" /></div>
              ) : (
                 <div className="text-center p-8"><i className="ph-fill ph-video-camera text-5xl mb-4 text-[var(--color-rose-dark)] opacity-40"></i><p className="text-xs font-bold uppercase tracking-widest text-gray-400">Selecione um procedimento ao lado para ver a mídia</p></div>
              )}
            </div>

            <div className="w-full md:w-1/2 bg-white flex flex-col relative overflow-hidden">
              <div className="p-6 pb-4 border-b border-[var(--color-nude)] flex justify-between items-start">
                <div>
                  <button onClick={() => setSelectedCategory(null)} className="hidden md:block absolute top-6 right-6 text-gray-400 hover:text-black bg-[var(--color-nude)] p-2 rounded-full cursor-pointer"><i className="ph ph-x text-xl"></i></button>
                  <span className="text-[var(--color-gold)] uppercase tracking-[0.2em] text-[10px] font-bold block mb-1">Catálogo Interativo</span>
                  <h3 className="font-serif text-2xl text-[var(--color-dark)]">{selectedCategory.title}</h3>
                </div>

                {isAdmin && (
                  <button onClick={handleOpenAddItem} className="text-[var(--color-gold)] hover:text-black text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1 mr-10 cursor-pointer">
                    <i className="ph ph-plus-circle text-lg"></i> Novo Item / Vídeo
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                <ul className="flex flex-col">
                  {selectedCategory.items.map((item: any) => (
                    <li key={item.id} onClick={() => { setActiveMedia(item.media); setActiveItemId(item.id); }} className={`cursor-pointer flex flex-col justify-center px-6 py-4 border-b border-gray-50 transition-all ${activeItemId === item.id ? 'bg-[var(--color-nude)] border-l-4 border-l-[var(--color-gold)]' : 'hover:bg-gray-50'}`}>
                      <div className="flex justify-between items-center w-full">
                        <span className={`text-sm md:text-base ${activeItemId === item.id ? 'font-bold text-[var(--color-dark)]' : 'font-semibold text-gray-600'}`}>{item.name}</span>
                        <span className="font-semibold text-[var(--color-dark)]">
                          {item.price.includes('A avaliar') ? item.price : `R$ ${item.price}`}
                        </span>
                      </div>

                      {isAdmin && (
                        <div className="flex gap-4 mt-3 pt-3 border-t border-gray-200/60" onClick={(e) => e.stopPropagation()}>
                           <button onClick={() => handleOpenEditItem(item)} className="text-gray-400 hover:text-[var(--color-gold)] text-[11px] uppercase tracking-widest font-bold flex items-center gap-1 cursor-pointer"><i className="ph-fill ph-pencil-simple text-sm"></i> Editar Vídeo/Item</button>
                           <button onClick={() => setDeleteConfirm({ isOpen: true, type: 'item', id: item.id, title: item.name })} className="text-gray-400 hover:text-red-500 text-[11px] uppercase tracking-widest font-bold flex items-center gap-1 cursor-pointer"><i className="ph-fill ph-trash text-sm"></i> Excluir</button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6 bg-white border-t border-[var(--color-nude)]">
                <button onClick={scheduleWhatsApp} className="w-full bg-[#25D366] hover:bg-[#1EBE5A] text-white py-4 uppercase font-bold tracking-widest text-xs flex items-center justify-center gap-2 rounded-md shadow-lg cursor-pointer">
                  <i className="ph-fill ph-whatsapp-logo text-xl"></i> Agendar pelo WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCatModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-sm shadow-2xl max-w-md w-full relative">
            <button onClick={() => setIsCatModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer"><i className="ph ph-x text-xl"></i></button>
            <h3 className="font-serif text-2xl text-[var(--color-dark)] mb-6">{editingCat ? "Editar Seção" : "Nova Seção"}</h3>
            <form onSubmit={handleSaveCat} className="space-y-4">
              <div><label className="block text-xs uppercase font-bold text-gray-600 mb-1">Título da Seção</label><input type="text" value={catTitle} onChange={(e) => setCatTitle(e.target.value)} className="w-full border p-3 text-sm outline-none focus:border-[var(--color-gold)]" required /></div>
              <div><label className="block text-xs uppercase font-bold text-gray-600 mb-1">Descrição</label><input type="text" value={catDesc} onChange={(e) => setCatDesc(e.target.value)} className="w-full border p-3 text-sm outline-none focus:border-[var(--color-gold)]" /></div>
              
              <div>
                <label className="block text-xs uppercase font-bold text-gray-600 mb-1">Imagem de Capa (Selecionar do Computador)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const base64 = await convertFileToBase64(file);
                      setCatImg(base64);
                    }
                  }} 
                  className="w-full border p-2 text-sm outline-none bg-white text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:bg-[var(--color-dark)] file:text-white hover:file:bg-[var(--color-gold)] cursor-pointer" 
                />
                {catImg && <img src={catImg} alt="Preview" className="mt-2 h-20 w-full object-cover rounded shadow" />}
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-600 mb-1">Formato do Card no Grid</label>
                <select value={catGridSpan} onChange={(e) => setCatGridSpan(e.target.value)} className="w-full border p-3 text-sm outline-none bg-white focus:border-[var(--color-gold)] cursor-pointer">
                  <option value="col-span-1">Padrão (1 Coluna)</option>
                  <option value="md:col-span-2">Destaque Largo (2 Colunas)</option>
                  <option value="lg:col-span-3">Linha Inteira (Destaque Máximo)</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-[var(--color-dark)] text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-[var(--color-gold)] transition mt-4 cursor-pointer">
                Salvar Seção
              </button>
            </form>
          </div>
        </div>
      )}

      {isItemModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-sm shadow-2xl max-w-md w-full relative">
            <button onClick={() => setIsItemModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer"><i className="ph ph-x text-xl"></i></button>
            <h3 className="font-serif text-2xl text-[var(--color-dark)] mb-6">{editingItem ? "Editar Item / Mídia" : "Novo Item / Mídia"}</h3>
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div><label className="block text-xs uppercase font-bold text-gray-600 mb-1">Nome do Procedimento</label><input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} className="w-full border p-3 text-sm outline-none focus:border-[var(--color-gold)]" required /></div>
              <div><label className="block text-xs uppercase font-bold text-gray-600 mb-1">Preço (R$)</label><input type="text" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} className="w-full border p-3 text-sm outline-none focus:border-[var(--color-gold)]" required /></div>
              
              <div>
                <label className="block text-xs uppercase font-bold text-gray-600 mb-1">Mídia do Item (Selecionar do Computador)</label>
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const base64 = await convertFileToBase64(file);
                      setItemMedia(base64);
                    }
                  }} 
                  className="w-full border p-2 text-sm outline-none bg-white text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:bg-[var(--color-dark)] file:text-white hover:file:bg-[var(--color-gold)] cursor-pointer" 
                />
                {itemMedia && <img src={itemMedia} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded shadow" />}
              </div>

              <button type="submit" className="w-full bg-[var(--color-dark)] text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-[var(--color-gold)] transition mt-4 cursor-pointer">
                Salvar Item
              </button>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-sm shadow-2xl max-w-sm w-full text-center relative animate-fade-in-up">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              <i className="ph ph-warning-circle"></i>
            </div>
            <h3 className="font-serif text-2xl text-[var(--color-dark)] mb-2">Excluir {deleteConfirm.type === 'cat' ? 'Seção' : 'Item'}</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Tem certeza que deseja excluir <span className="font-bold text-[var(--color-dark)]">"{deleteConfirm.title}"</span>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm({ isOpen: false, type: null, id: null, title: '' })} className="flex-1 bg-gray-100 text-gray-700 py-3 uppercase text-xs font-bold tracking-widest hover:bg-gray-200 transition rounded-sm cursor-pointer">Cancelar</button>
              <button onClick={confirmDeleteAction} className="flex-1 bg-red-600 text-white py-3 uppercase text-xs font-bold tracking-widest hover:bg-red-700 transition rounded-sm shadow-md cursor-pointer">Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}