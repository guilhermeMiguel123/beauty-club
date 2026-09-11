// components/ImagePickerModal.tsx
'use client';

import { useState, useEffect } from 'react';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  defaultFolder?: 'products' | 'carousel' | 'services';
}

export default function ImagePickerModal({ isOpen, onClose, onSelect, defaultFolder = 'products' }: ImagePickerModalProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'carousel' | 'services'>(defaultFolder);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchImages(activeTab);
    }
  }, [isOpen, activeTab]);

  const fetchImages = async (folder: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/images?folder=${folder}`);
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error("Erro ao buscar imagens:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col relative animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-black cursor-pointer">
          <i className="ph ph-x text-xl"></i>
        </button>

        <h3 className="font-serif text-xl text-[var(--color-dark)] mb-4">Selecionar Imagem da Galeria</h3>

        {/* Abas de Pastas */}
        <div className="flex gap-2 border-b border-gray-100 pb-3 mb-4">
          {(['products', 'carousel', 'services'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === tab ? 'bg-[var(--color-dark)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab === 'products' ? 'Produtos' : tab === 'carousel' ? 'Carrossel' : 'Serviços'}
            </button>
          ))}
        </div>

        {/* Grid de Imagens */}
        <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-3 pr-1 min-h-[250px]">
          {loading ? (
            <div className="col-span-full flex items-center justify-center text-gray-400 text-sm">
              Carregando imagens...
            </div>
          ) : images.length > 0 ? (
            images.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelect(imgUrl);
                  onClose();
                }}
                className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-[var(--color-gold)] cursor-pointer group relative bg-gray-50 shadow-sm"
              >
                <img src={imgUrl} alt="Opção" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded-md shadow">Selecionar</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-12">
              <i className="ph ph-folder-open text-3xl mb-2"></i>
              <p className="text-xs">Nenhuma imagem encontrada nesta pasta.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}