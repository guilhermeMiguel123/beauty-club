'use client';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const initialProducts = [
  { id: 1, name: "Kit Home Care Pós-Mechas", price: "189,90", desc: "Manutenção da cor e hidratação profunda em casa.", img: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800" },
  { id: 2, name: "Óleo Reparador de Argan", price: "89,90", desc: "Brilho instantâneo e proteção térmica para os fios.", img: "https://images.unsplash.com/photo-1608248597359-994b633094c7?auto=format&fit=crop&w=800" },
  { id: 3, name: "Máscara de Reconstrução Ozonizada", price: "149,90", desc: "Tratamento de alto impacto para cabelos danificados.", img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800" },
  { id: 4, name: "Leave-in Defrizante Térmico", price: "79,90", desc: "Proteção contra secador e chapinha com efeito antifrizz.", img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800" }
];

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function Products() {
  const { addToCart, isAdmin } = useCart();
  const [products, setProducts] = useState(initialProducts);
  const [isMounted, setIsMounted] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState('');

  useEffect(() => {
    setIsMounted(true);
    async function loadProducts() {
      try {
        const docRef = doc(db, "site_content", "products_grid");
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
        await setDoc(doc(db, "site_content", "products_grid"), { value: newProducts });
      } catch (err: any) {
        if (err.name === 'AbortError' || err.message?.includes('aborted')) return;
        alert("Erro ao salvar produtos no Firebase: " + err.message);
      }
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setDesc('');
    setImg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price);
    setDesc(p.desc);
    setImg(p.img);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const updated = products.map((p: any) => p.id === editingProduct.id ? { ...p, name, price, desc, img } : p);
      await saveToFirebase(updated);
    } else {
      const newP = { id: Date.now(), name, price, desc, img: img || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800' };
      await saveToFirebase([...products, newP]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      const updated = products.filter((p: any) => p.id !== id);
      await saveToFirebase(updated);
    }
  };

  return (
    <section id="produtos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100 pb-6">
        <div>
          <span className="uppercase tracking-[0.2em] text-[var(--color-gold)] text-xs md:text-sm font-bold block mb-4">Home Care & Manutenção</span>
          <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-dark)] mb-4">Nossos <span className="italic text-[var(--color-gold)]">Produtos</span></h2>
          <p className="text-[#4D4D4D] font-light max-w-2xl">Leve a experiência e o cuidado profissional do Beauty Club para o seu dia a dia.</p>
        </div>

        {isAdmin && (
          <button onClick={handleOpenAdd} className="bg-[var(--color-dark)] text-white px-6 py-3 text-xs uppercase font-bold tracking-widest hover:bg-[var(--color-gold)] transition flex items-center gap-2 rounded-sm shadow-xl cursor-pointer">
            <i className="ph ph-plus-circle text-xl"></i> Novo Produto
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product: any) => (
          <div key={product.id} className="group bg-[var(--color-nude)] p-6 rounded-sm flex flex-col relative border border-transparent hover:border-[var(--color-gold)] transition duration-500 shadow-sm">
            {isAdmin && (
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button onClick={() => handleOpenEdit(product)} className="w-8 h-8 flex items-center justify-center bg-white text-[var(--color-dark)] rounded-full shadow hover:text-[var(--color-gold)] transition cursor-pointer" title="Editar">
                  <i className="ph-fill ph-pencil-simple text-xs"></i>
                </button>
                <button onClick={() => handleDelete(product.id)} className="w-8 h-8 flex items-center justify-center bg-white text-[var(--color-dark)] rounded-full shadow hover:text-red-500 transition cursor-pointer" title="Excluir">
                  <i className="ph-fill ph-trash text-xs"></i>
                </button>
              </div>
            )}

            <div className="relative overflow-hidden mb-6 bg-white rounded-sm aspect-square flex items-center justify-center">
              <img src={product.img} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" />
            </div>

            <h3 className="font-serif text-xl text-[var(--color-dark)] mb-2">{product.name}</h3>
            <p className="text-[#4D4D4D] text-xs font-light mb-4 flex-1">{product.desc}</p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--color-rose)]">
              <span className="font-serif text-lg font-bold text-[var(--color-dark)]">
                {typeof product.price === 'number' ? `R$ ${product.price.toFixed(2).replace('.', ',')}` : (product.price.includes('R$') ? product.price : `R$ ${product.price}`)}
              </span>
              <button onClick={() => addToCart(product)} className="bg-[var(--color-dark)] text-white px-4 py-2 uppercase text-[10px] font-bold tracking-widest hover:bg-[var(--color-gold)] transition rounded-sm cursor-pointer flex items-center gap-1 shadow">
                <i className="ph ph-shopping-bag text-sm"></i> Comprar
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-sm shadow-2xl max-w-md w-full relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer"><i className="ph ph-x text-xl"></i></button>
            <h3 className="font-serif text-2xl text-[var(--color-dark)] mb-6">{editingProduct ? "Editar Produto" : "Novo Produto"}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="block text-xs uppercase font-bold text-gray-600 mb-1">Nome do Produto</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-3 text-sm outline-none focus:border-[var(--color-gold)]" required /></div>
              <div><label className="block text-xs uppercase font-bold text-gray-600 mb-1">Preço (ex: 89,90)</label><input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border p-3 text-sm outline-none focus:border-[var(--color-gold)]" required /></div>
              <div><label className="block text-xs uppercase font-bold text-gray-600 mb-1">Descrição</label><textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full border p-3 text-sm outline-none focus:border-[var(--color-gold)] h-20 resize-none" required /></div>
              
              <div>
                <label className="block text-xs uppercase font-bold text-gray-600 mb-1">Selecionar Imagem do Computador</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const base64 = await convertFileToBase64(file);
                      setImg(base64);
                    }
                  }} 
                  className="w-full border p-2 text-sm outline-none bg-white text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:bg-[var(--color-dark)] file:text-white hover:file:bg-[var(--color-gold)] cursor-pointer" 
                />
                {img && <img src={img} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded shadow" />}
              </div>

              <button type="submit" className="w-full bg-[var(--color-dark)] text-white py-4 uppercase text-xs font-bold tracking-widest hover:bg-[var(--color-gold)] transition mt-4 cursor-pointer">
                Salvar Produto
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}