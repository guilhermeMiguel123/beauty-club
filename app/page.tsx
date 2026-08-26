import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Products from '@/components/Products';
import About from '@/components/About';
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
      <Services />
      <Products />
      <About />
      <Reviews />
      <FAQ />
      <Footer />
    </main>
  );
}