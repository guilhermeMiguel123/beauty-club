'use client';
import { useState } from 'react';

const perguntas = [
  { q: "Como agendar um horário no salão?", a: "O agendamento é feito de forma 100% personalizada através do nosso WhatsApp. Você pode clicar em qualquer botão do site para ser redirecionada à nossa recepção." },
  { q: "Como funciona o frete da loja online?", a: "Realizamos envios para todo o Brasil ou retirada no local. O frete é calculado pelo WhatsApp com base no seu CEP. Compras acima de R$ 300,00 possuem Frete Grátis!" },
  { q: "Quais as formas de pagamento aceitas?", a: "No salão, aceitamos Cartões de Crédito (parcelamento disponível), Débito, Pix e Dinheiro. Para compras online, o pagamento é feito via Pix ou link de pagamento seguro." },
  { q: "Posso devolver um produto que comprei online?", a: "Sim. De acordo com o Código de Defesa do Consumidor, você tem até 7 dias corridos para solicitar devolução, desde que o produto não tenha sido aberto ou utilizado." }
];

export default function FAQ() {
  const [aberto, setAberto] = useState<number | null>(null);

  const toggle = (index: number) => {
    setAberto(aberto === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="uppercase tracking-[0.2em] text-[var(--color-gold)] text-xs font-bold block mb-4">Tire suas dúvidas</span>
          <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-dark)]">Perguntas Frequentes</h2>
        </div>

        <div className="space-y-4">
          {perguntas.map((item, index) => (
            <div key={index} className="border-b border-[var(--color-nude)] pb-4">
              <button onClick={() => toggle(index)} className="w-full flex justify-between items-center text-left py-4 text-lg md:text-xl font-serif text-[var(--color-dark)] hover:text-[var(--color-gold)] transition focus:outline-none">
                {item.q}
                <i className={`ph ph-caret-down text-2xl text-[var(--color-gold)] transition-transform duration-300 ${aberto === index ? 'rotate-180' : ''}`}></i>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${aberto === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-[#4D4D4D] font-light pb-6 pt-2 leading-relaxed text-sm md:text-base">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}