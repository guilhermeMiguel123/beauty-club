'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import { 
  MessageCircle, 
  MapPin, 
  Globe, 
  Scissors, 
  ExternalLink, 
  Clock 
} from 'lucide-react';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  order: number;
  iconType?: 'whatsapp' | 'instagram' | 'map' | 'globe' | 'default';
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function LinksTreePage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const q = query(collection(db, 'links'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const linksData: LinkItem[] = [];
        querySnapshot.forEach((doc) => {
          linksData.push({ id: doc.id, ...doc.data() } as LinkItem);
        });
        setLinks(linksData);
      } catch (error) {
        console.error("Erro ao carregar links do Firestore:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLinks();
  }, []);

  const defaultLinks: LinkItem[] = [
    {
      id: '1',
      title: 'Agendar Horário via WhatsApp',
      url: 'https://wa.me/556291128449?text=Olá!%20Vim%20pelo%20Instagram%20e%20gostaria%20de%20agendar%20um%20horário.',
      order: 1,
      iconType: 'whatsapp',
    },
    {
      id: '2',
      title: 'Visite Nosso Site Oficial',
      url: 'https://salaobeautyclub.com.br',
      order: 2,
      iconType: 'globe',
    },
    {
      id: '3',
      title: 'Nossa Localização (Google Maps)',
      url: 'https://maps.app.goo.gl/6hJ3PXzTgDDdbHX48',
      order: 3,
      iconType: 'map',
    },
    {
      id: '4',
      title: 'Ver Destaques e Novidades no Instagram',
      url: 'https://www.instagram.com/p/DYDhyLGiH9y/?img_index=5&igsh=dzRuNm04ejg2enlo&igsi=dzRuNm04ejg2enlo',
      order: 4,
      iconType: 'instagram',
    },
  ];

  const activeLinks = links.length > 0 ? links : defaultLinks;

  const renderIcon = (type?: string) => {
    switch (type) {
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5 text-emerald-600 transition-colors" />;
      case 'instagram':
        return <InstagramIcon className="w-5 h-5 text-rose-600 transition-colors" />;
      case 'map':
        return <MapPin className="w-5 h-5 text-amber-700 transition-colors" />;
      case 'globe':
        return <Globe className="w-5 h-5 text-sky-600 transition-colors" />;
      default:
        return <Scissors className="w-5 h-5 text-amber-700 transition-colors" />;
    }
  };

  return (
    <main className="relative min-h-screen bg-[#f9f6f0] text-neutral-900 flex flex-col items-center justify-between py-12 px-4 sm:px-6 selection:bg-amber-200 selection:text-neutral-900">
      
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        {/* Foto limpa e sem brilho em volta */}
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-amber-900/15 shadow-md mb-4 bg-neutral-200">
          <Image 
            src="/monica.png" 
            alt="Mônica Monteiro - Founder & Master Stylist"
            fill
            className="object-cover object-top"
            priority
          />
        </div>

        <div className="flex items-center gap-1.5 mb-1">
          <h1 className="text-2xl font-serif font-bold tracking-tight text-neutral-900 text-center">@monicamonteiro</h1>
        </div>

        <p className="text-xs uppercase tracking-[0.25em] text-amber-800 font-semibold mb-8">
          Beauty Club • Anápolis
        </p>

        {/* Lista de Links Minimalista */}
        <div className="w-full flex flex-col gap-3.5">
          {loading ? (
            <div className="flex flex-col gap-3 w-full">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="w-full h-16 bg-white/60 border border-amber-900/10 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            activeLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full p-4 bg-white hover:bg-amber-100/70 border border-amber-900/15 hover:border-amber-300 rounded-2xl font-medium text-center transition-all duration-300 flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#f9f6f0] group-hover:bg-amber-200/60 border border-amber-900/10 group-hover:border-amber-300 transition-colors">
                    {renderIcon(link.iconType)}
                  </div>
                  <span className="text-sm sm:text-base font-medium tracking-wide text-neutral-800 group-hover:text-neutral-950 transition-colors text-left">
                    {link.title}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#f9f6f0] group-hover:bg-amber-300 group-hover:text-neutral-950 flex items-center justify-center border border-amber-900/10 group-hover:border-amber-300 transition-all text-neutral-500">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            ))
          )}
        </div>

        <div className="w-full mt-6 p-4 rounded-2xl bg-white/50 border border-amber-900/10 backdrop-blur-sm flex items-center gap-3 text-neutral-600 text-xs">
          <Clock className="w-5 h-5 text-amber-700 shrink-0" />
          <div>
            <p className="font-medium text-neutral-800">Horário de Atendimento</p>
            <p>Segunda-feira, das 13h às 18h.

Terça-feira a sábado, das 07h às 18h. • Anápolis, GO</p>
          </div>
        </div>

      </div>

      <footer className="relative z-10 mt-12 text-xs text-neutral-500 text-center tracking-wider flex flex-col items-center gap-1">
        <p className="font-medium text-neutral-700">Salao Beauty Club</p>
        <p>© {new Date().getFullYear()} • Todos os direitos reservados</p>
      </footer>

    </main>
  );
}