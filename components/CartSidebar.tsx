'use client';
import { useCart } from '@/context/CartContext';

export default function CartSidebar() {
  const { cart, isCartOpen, toggleCart, cartTotal, updateQuantity, removeFromCart, checkoutWhatsApp } = useCart();
  
  const formatPrice = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
  
  const freeShippingThreshold = 300;
  const remainingForFreeShipping = freeShippingThreshold - cartTotal;
  const progressPercent = Math.min((cartTotal / freeShippingThreshold) * 100, 100);

  return (
    <>
      {/* Fundo Escuro */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity" 
          onClick={toggleCart}
        ></div>
      )}

      {/* Gaveta Lateral */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[var(--color-nude-light)] shadow-2xl z-[110] transform transition-transform duration-500 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Cabeçalho */}
        <div className="p-6 md:p-8 border-b border-[var(--color-nude)] flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <i className="ph ph-handbag text-3xl text-[var(--color-gold)]"></i>
            <h2 className="font-serif text-2xl text-[var(--color-dark)]">Sua Sacola</h2>
          </div>
          <button onClick={toggleCart} className="text-gray-400 hover:text-[var(--color-dark)] transition bg-[var(--color-nude)] p-2 rounded-full">
            <i className="ph ph-x text-xl"></i>
          </button>
        </div>

        {/* Progresso de Frete Grátis */}
        <div className="bg-[var(--color-rose-light)] p-5 text-center text-xs font-bold text-[var(--color-dark)] border-b border-[var(--color-rose)] shadow-inner">
          {remainingForFreeShipping > 0 ? (
            <p>Faltam <span className="text-[var(--color-gold)] text-sm">{formatPrice(remainingForFreeShipping)}</span> para Frete Grátis!</p>
          ) : (
            <p className="text-[var(--color-gold)]"><i className="ph-fill ph-check-circle text-lg align-text-bottom"></i> Parabéns! Você ganhou Frete Grátis.</p>
          )}
          <div className="w-full bg-white h-2.5 rounded-full mt-4 overflow-hidden border border-[var(--color-rose)]/50 relative">
            <div className="bg-[var(--color-gold)] h-full transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Lista de Produtos */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60 mt-10">
              <i className="ph ph-handbag text-7xl mb-6 text-[var(--color-nude)] drop-shadow-sm"></i>
              <p className="font-light uppercase tracking-widest text-xs">Sacola vazia.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white p-4 border border-[var(--color-nude)] relative rounded-sm shadow-sm">
                <img src={item.img} alt={item.name} className="w-20 h-24 object-cover bg-[var(--color-nude)]" />
                <div className="flex-1 flex flex-col justify-between">
                  <h5 className="text-xs md:text-sm font-bold text-[var(--color-dark)] pr-6 leading-tight">{item.name}</h5>
                  <span className="font-serif text-[var(--color-gold)] text-base">{formatPrice(item.price)}</span>
                  <div className="flex items-center border border-[var(--color-nude)] w-fit rounded-sm mt-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 text-gray-500 hover:bg-[var(--color-dark)] hover:text-white transition"><i className="ph ph-minus text-xs"></i></button>
                    <span className="px-3 py-1 text-xs font-bold w-8 text-center bg-[var(--color-nude-light)]">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 text-gray-500 hover:bg-[var(--color-dark)] hover:text-white transition"><i className="ph ph-plus text-xs"></i></button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-400 transition bg-white rounded-full p-1 shadow-sm">
                  <i className="ph ph-trash text-lg"></i>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Rodapé e Botão de Finalizar */}
        <div className="p-6 md:p-8 bg-white shadow-[0_-15px_30px_rgba(0,0,0,0.04)] border-t border-[var(--color-nude)] z-10">
          <div className="flex justify-between text-[var(--color-dark)] mb-6 font-bold text-lg md:text-xl items-end">
            <span>Total</span>
            <span className="font-serif text-[var(--color-gold)] text-3xl leading-none">{formatPrice(cartTotal)}</span>
          </div>
          <button 
            onClick={checkoutWhatsApp}
            disabled={cart.length === 0}
            className="w-full bg-[#25D366] hover:bg-[#1EBE5A] disabled:bg-gray-300 text-white py-5 uppercase font-bold tracking-widest text-xs flex items-center justify-center gap-3 rounded-md shadow-lg transition-transform hover:-translate-y-1"
          >
            <i className="ph-fill ph-whatsapp-logo text-2xl"></i> Finalizar Pedido
          </button>
        </div>
      </aside>
    </>
  );
}