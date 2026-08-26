import { Lato, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import CartSidebar from '@/components/CartSidebar'; // 1. Importa a gaveta do carrinho

const lato = Lato({ 
  subsets: ['latin'], 
  weight: ['300', '400', '700'],
  variable: '--font-lato'
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair'
});

export const metadata = {
  title: 'BEAUTY CLUB: ESTÉTICA CAPILAR E FACIAL',
  description: 'Elevando o padrão dos salões de beleza e estética.',
  icons: {
    icon: '/logo-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <script src="https://unpkg.com/@phosphor-icons/web" async></script>
      </head>
      <body className={`${lato.variable} ${playfair.variable} antialiased font-sans`}>
        <CartProvider>
          {children}
          <CartSidebar /> {/* 2. Renderiza o carrinho globalmente aqui */}
        </CartProvider>
      </body>
    </html>
  );
}