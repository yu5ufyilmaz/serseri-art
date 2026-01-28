'use client';

import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ product }: { product: any }) {
    const { addToCart } = useCart();

    const handleAdd = () => {
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image_url: product.image_url,
            artist_name: product.artists?.name || 'Sanatçı'
        });
    };

    return (
        <button
            onClick={handleAdd}
            className="bg-black border border-black text-white px-4 py-2 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition flex items-center justify-center gap-2 w-full md:w-auto whitespace-nowrap h-full text-xs"
        >
            <span>🛒</span>
            <span className="hidden md:inline">Sepet</span>
        </button>
    );
}
