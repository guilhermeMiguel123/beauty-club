'use client';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Products from '@/components/Products';
import Reviews from '@/components/Reviews';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            obs.unobserve(entry.target); // Anima uma única vez para fluidez máxima
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A]">
      <CartSidebar />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Products />
      <Reviews />
      <Footer />
    </main>
  );
}