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
            className="bg-zinc-800 border border-zinc-600 text-white px-4 py-2 rounded font-bold hover:bg-zinc-700 transition flex items-center justify-center gap-2 w-full md:w-auto whitespace-nowrap h-full"
        >
            <span>🛒</span>
            <span className="hidden md:inline">Sepet</span>
        </button>
    );
}