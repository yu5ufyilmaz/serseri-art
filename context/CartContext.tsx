'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Sepetteki bir ürünün şablonu
type CartItem = {
    id: any;
    title: string;
    price: number;
    image_url: string;
    artist_name: string;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: any) => void;
    clearCart: () => void;
    totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // 1. Sayfa açılınca eski sepeti yükle (LocalStorage)
    useEffect(() => {
        const savedCart = localStorage.getItem('serseriCart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // 2. Sepet değişince kaydet
    useEffect(() => {
        localStorage.setItem('serseriCart', JSON.stringify(cart));
    }, [cart]);

    // Sepete Ekle
    const addToCart = (item: CartItem) => {
        // Aynı ürün eklenmiş mi kontrol et (Opsiyonel, şimdilik izin verelim veya engelleyelim)
        const exists = cart.find((i) => i.id === item.id);
        if (exists) {
            alert("Bu eser zaten sepetinde!");
            return;
        }
        setCart([...cart, item]);
        alert("Sepete Eklendi!");
    };

    // Sepetten Çıkar
    const removeFromCart = (id: any) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    // Sepeti Boşalt
    const clearCart = () => {
        setCart([]);
    };

    // Toplam Tutar
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
}