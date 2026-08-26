'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebaseClient';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

type CartItem = { id: number; name: string; price: number; img: string; quantity: number; };

type AppContextType = {
  cart: CartItem[];
  isCartOpen: boolean;
  cartTotal: number;
  cartItemCount: number;
  isAdmin: boolean;
  user: any;
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, change: number) => void;
  toggleCart: () => void;
  checkoutWhatsApp: () => void;
  loginWithGoogle: () => Promise<void>;
  logoutGoogle: () => Promise<void>;
};

const CartContext = createContext<AppContextType | undefined>(undefined);

// 📋 LISTA DE E-MAILS AUTORIZADOS A SEREM ADMINISTRADORES

const ADMIN_EMAILS = [
  "guilherme12miguel123@gmail.com",
  "monicaesteticista10@gmail.com"
];

export function CartProvider({ children }: { children: ReactNode }) {
  // Inicializa o carrinho buscando do localStorage para não perder ao atualizar a página
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('beauty_club_cart');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Erro ao carregar carrinho:", e);
        }
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Sempre que o carrinho mudar, salva no localStorage automaticamente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('beauty_club_cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Monitora o login do Firebase via Google
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser && currentUser.email && ADMIN_EMAILS.includes(currentUser.email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      alert("Erro ao fazer login com Google: " + err.message);
    }
  };

  const logoutGoogle = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
    } catch (err: any) {
      console.error("Erro ao sair:", err);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      
      let numericPrice = 0;
      if (typeof product.price === 'number') {
        numericPrice = product.price;
      } else {
        const strPrice = String(product.price || "0").replace("R$", "").trim().replace(",", ".");
        numericPrice = parseFloat(strPrice);
        if (isNaN(numericPrice)) numericPrice = 0;
      }

      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: numericPrice, 
        img: product.img || product.coverImg, 
        quantity: 1 
      }];
    });
  };

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((item) => item.id !== id));

  const updateQuantity = (id: number, change: number) => {
    setCart((prev) => prev.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + change;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    }));
  };

  const checkoutWhatsApp = () => {
    if (cart.length === 0) return;
    let text = "*🛍️ PEDIDO | BEAUTY CLUB*\n\nOlá! Gostaria de reservar os seguintes produtos:\n\n";
    
    cart.forEach(item => { 
      const itemTotal = (item.price * item.quantity).toFixed(2).replace('.', ',');
      text += `▫️ *${item.quantity}x* ${item.name} (R$ ${itemTotal})\n`; 
    });
    
    const totalFormatted = cartTotal.toFixed(2).replace('.', ',');
    text += `\n*Total:* R$ ${totalFormatted}\n\nComo seguimos com o pagamento?`;
    
    window.open(`https://wa.me/556291128449?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <CartContext.Provider value={{ 
      cart, isCartOpen, cartTotal, cartItemCount, isAdmin, user, 
      addToCart, removeFromCart, updateQuantity, toggleCart, checkoutWhatsApp, 
      loginWithGoogle, logoutGoogle 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro de um CartProvider');
  return context;
}