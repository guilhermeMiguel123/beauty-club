import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About'; // Movido para cima
import Services from '@/components/Services';
import Products from '@/components/Products';
import Reviews from '@/components/Reviews';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

// Força a página a ser dinâmica, evitando erros de pré-renderização no build da Vercel
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <Hero />
      <About /> {/* Agora o Sobre fica logo abaixo do carrossel/Hero */}
      <Services />
      <Products />
      <Reviews />
      <FAQ />
      <Footer />
    </main>
  );
}