'use client';

import { useEffect, useState, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const initialProducts = [
  {
    id: 1,
    name: "Óleo Reparador de Argan",
    price: "89,90",
    oldPrice: "110,00",
    category: "Tratamento",
    img: "https://images.unsplash.com/photo-1608248597359-994b5952b654?auto=format&fit=crop&w=800"
  },
  {
    id: 2,
    name: "Máscara de Hidratação Profunda",
    price: "129,90",
    oldPrice: "",
    category: "Capilar",
    img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800"
  },
  {
    id: 3,
    name: "Sérum Facial Antioxidante",
    price: "149,90",
    oldPrice: "189,90",
    category: "Skincare",
    img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800"
  },
  {
    id: 4,
    name: "Spray de Brilho Gloss Express",
    price: "79,90",
    oldPrice: "",
    category: "Finalização",
    img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800"
  },
  {
    id: 5,
    name: "Kit Manutenção Pós-Mechas",
    price: "199,90",
    oldPrice: "249,90",
    category: "Kits",
    img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800"
  },
  {
    id: 6,
    name: "Perfume Capilar Voyage",
    price: "99,90",
    oldPrice: "",
    category: "Fragrância",
    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800"
  }
];

export default function Products() {
  const { isAdmin, addToCart } = useCart();
  const [products, setProducts] = useState(initialProducts);
  const [isMounted, setIsMounted] = useState(false);

  // Estados de busca e filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Estado para feedback visual de produto adicionado
  const [addedId, setAddedId] = useState<number | null>(null);

  // Estados do Modal e Exclusão
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [category, setCategory] = useState('');
  const [img, setImg] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: any; name: string }>({ isOpen: false, id: null, name: '' });

  useEffect(() => {
    setIsMounted(true);
    async function loadProducts() {
      try {
        const docRef = doc(db, "site_content", "store_products");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().value) {
          setProducts(docSnap.data().value);
        }
      } catch (err: any) {
        if (err.name === 'AbortError' || err.message?.includes('aborted')) return;
        console.error("Erro ao carregar produtos:", err);
      }
    }
    loadProducts();
  }, []);

  const saveToFirebase = async (newProducts: any) => {
    setProducts(newProducts);
    if (isMounted) {
      try {
        await setDoc(doc(db, "site_content", "store_products"), { value: newProducts });
      } catch (err: any) {
        if (err.name === 'AbortError' || err.message?.includes('aborted')) return;
        alert("Erro ao salvar produtos no Firebase: " + err.message);
      }
    }
  };

  // Função para adicionar ao carrinho mantendo o usuário na página e dando feedback visual
  const handleAddToCart = (product: any) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => {
      setAddedId(null);
    }, 2000); 
  };

  // Categorias dinâmicas extraídas e normalizadas dos produtos (evita duplicatas por casing/espaço)
  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((p: any) => {
      const trimmed = p.category?.trim();
      if (trimmed) {
        const lowerKey = trimmed.toLowerCase();
        if (!map.has(lowerKey)) {
          map.set(lowerKey, trimmed);
        }
      }
    });
    return ['Todos', ...map.values()];
  }, [products]);

  // Produtos filtrados por busca e categoria
  const filteredProducts = useMemo(() => {
    return products.filter((product: any) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'Todos' || 
                              product.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Função para calcular as parcelas em até 3x automaticamente com base no preço atual
  const getInstallmentText = (priceStr: string) => {
    const cleanNum = parseFloat(priceStr.replace(',', '.')) || 0;
    if (cleanNum <= 0) return null;
    const installmentValue = (cleanNum / 3).toFixed(2).replace('.', ',');
    return `ou até 3x de R$ ${installmentValue} sem juros`;
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setOldPrice('');
    setCategory('');
    setImg('https://images.unsplash.com/photo-1608248597359-994b5952b654?auto=format&fit=crop&w=800');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setOldPrice(product.oldPrice || '');
    setCategory(product.category);
    setImg(product.img);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const updated = products.map((p: any) => p.id === editingProduct.id ? { ...p, name, price, oldPrice, category, img } : p);
      await saveToFirebase(updated);
    } else {
      const newProd = { id: Date.now(), name, price, oldPrice, category, img: img || 'https://images.unsplash.com/photo-1608248597359-994b5952b654?auto=format&fit=crop&w=800' };
      await saveToFirebase([...products, newProd]);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    const updated = products.filter((p: any) => p.id !== deleteConfirm.id);
    await saveToFirebase(updated);
    setDeleteConfirm({ isOpen: false, id: null, name: '' });
  };

  return (
    <section id="produtos" className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-[var(--color-gold)]/20 pb-8">
        <div>
          <span className="uppercase tracking-[0.25em] text-[var(--color-gold)] text-xs font-semibold block mb-3 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-[var(--color-gold)]"></span> Home Care Exclusivo
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[var(--color-dark)]">
            Nossos <span className="italic text-[var(--color-gold)]">Produtos</span>
          </h2>
          <p className="text-[#555] font-light mt-3 max-w-xl text-sm md:text-base leading-relaxed">
            Leve a experiência de cuidado profissional do Beauty Club para a sua rotina diária.
          </p>
        </div>

        {isAdmin && (
          <button 
            onClick={handleOpenAdd} 
            className="bg-[var(--color-dark)] text-white px-6 py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-[var(--color-gold)] transition-all duration-300 flex items-center gap-2.5 rounded-xl shadow-lg cursor-pointer group"
          >
            <i className="ph ph-plus-circle text-lg text-[var(--color-gold)] group-hover:text-white transition"></i> 
            Novo Produto
          </button>
        )}
      </div>

      {/* Barra de Pesquisa e Filtros de Categoria */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <i className="ph ph-magnifying-glass text-lg"></i>
          </span>
          <input 
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs md:text-sm outline-none focus:border-[var(--color-gold)] transition"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-black">
              <i className="ph ph-x"></i>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat: any) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[var(--color-dark)] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="max-w-7xl mx-auto px-2 md:px-8 grid grid-cols-3 md:grid-cols-4 gap-2.5 md:gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product: any, index: number) => {
            const installmentText = getInstallmentText(product.price);
            const hasOffer = product.oldPrice && product.oldPrice.trim() !== '';

            return (
              <div 
                key={product.id} 
                style={{ animationDelay: `${index * 50}ms` }}
                className="group flex flex-col justify-between bg-white rounded-xl md:rounded-3xl p-2.5 md:p-5 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 relative animate-in fade-in zoom-in-95"
              >
                {isAdmin && (
                  <div className="absolute top-2 right-2 z-20 flex gap-1">
                    <button onClick={() => handleOpenEdit(product)} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-white/90 text-[var(--color-dark)] rounded-full shadow hover:text-[var(--color-gold)] transition cursor-pointer" title="Editar">
                      <i className="ph-fill ph-pencil-simple text-[10px] md:text-xs"></i>
                    </button>
                    <button onClick={() => setDeleteConfirm({ isOpen: true, id: product.id, name: product.name })} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-white/90 text-[var(--color-dark)] rounded-full shadow hover:text-red-500 transition cursor-pointer" title="Excluir">
                      <i className="ph-fill ph-trash text-[10px] md:text-xs"></i>
                    </button>
                  </div>
                )}

                {/* Tag de Oferta */}
                {hasOffer && (
                  <span className="absolute top-2 left-2 z-20 bg-red-500 text-white px-2 py-0.5 rounded-full text-[8px] md:text-[9px] uppercase font-bold tracking-widest shadow-sm">
                    Oferta
                  </span>
                )}

                <div>
                  <div className="relative overflow-hidden rounded-lg md:rounded-2xl mb-2 md:mb-4 aspect-square bg-gray-50">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                    />
                    <span className="absolute bottom-1.5 left-1.5 md:bottom-2.5 md:left-2.5 bg-white/90 backdrop-blur-md text-[var(--color-dark)] px-2 py-0.5 rounded-full text-[8px] md:text-[10px] uppercase font-bold tracking-widest shadow-sm">
                      {product.category}
                    </span>
                  </div>

                  <h3 className="font-serif text-xs sm:text-sm md:text-lg text-[var(--color-dark)] mb-1 group-hover:text-[var(--color-gold)] transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </div>

                <div className="mt-auto pt-2 border-t border-gray-50">
                  <div className="flex flex-col mb-2">
                    <div className="flex items-baseline gap-1.5">
                      {hasOffer && (
                        <span className="text-gray-400 line-through text-[10px] md:text-xs font-medium">
                          R$ {product.oldPrice}
                        </span>
                      )}
                      <span className="font-serif font-bold text-xs sm:text-sm md:text-base text-[var(--color-dark)]">
                        R$ {product.price}
                      </span>
                    </div>

                    {/* Parcelamento automático em até 3x */}
                    {installmentText && (
                      <span className="text-[9px] md:text-[11px] text-gray-500 font-medium">
                        {installmentText}
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-2 rounded-lg text-[9px] md:text-xs uppercase font-bold tracking-widest transition shadow-sm cursor-pointer ${
                      addedId === product.id 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-[var(--color-dark)] text-white hover:bg-[var(--color-gold)]'
                    }`}
                  >
                    {addedId === product.id ? 'Adicionado! ✓' : 'Adicionar'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-gray-400">
            <i className="ph ph-package text-4xl mb-2 block"></i>
            <p className="text-sm">Nenhum produto encontrado para sua busca.</p>
          </div>
        )}
      </div>

      {/* Modal de Adicionar/Editar Produto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-black cursor-pointer"><i className="ph ph-x text-xl"></i></button>
            <h3 className="font-serif text-2xl text-[var(--color-dark)] mb-6">{editingProduct ? "Editar Produto" : "Novo Produto"}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-600 mb-1.5 tracking-wider">Nome do Produto</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[var(--color-gold)] transition" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase font-bold text-gray-600 mb-1.5 tracking-wider">Preço Atual (R$)</label>
                  <input type="text" placeholder="89,90" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[var(--color-gold)] transition" required />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-bold text-gray-600 mb-1.5 tracking-wider">Preço Antigo (Opcional)</label>
                  <input type="text" placeholder="110,00" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[var(--color-gold)] transition" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-600 mb-1.5 tracking-wider">Categoria</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[var(--color-gold)] transition" required />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-bold text-gray-600 mb-1.5 tracking-wider">URL da Imagem</label>
                <input 
                  type="url" 
                  placeholder="https://exemplo.com/produto.jpg"
                  value={img} 
                  onChange={(e) => setImg(e.target.value)} 
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[var(--color-gold)] transition bg-white text-gray-700" 
                  required
                />
                {img && <img src={img} alt="Preview" className="mt-3 h-24 w-full object-cover rounded-xl shadow-md bg-gray-100" />}
              </div>
              <button type="submit" className="w-full bg-[var(--color-dark)] text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-[var(--color-gold)] transition rounded-xl mt-2 cursor-pointer shadow-lg">
                Salvar Produto
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Exclusão */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              <i className="ph-fill ph-warning"></i>
            </div>
            <h3 className="font-serif text-xl text-[var(--color-dark)] mb-2">Excluir Produto?</h3>
            <p className="text-gray-500 text-xs mb-6">Tem certeza que deseja excluir &quot;{deleteConfirm.name}&quot;?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition cursor-pointer">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-600 transition cursor-pointer">
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}