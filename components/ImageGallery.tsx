'use client';

import { useState } from 'react';

export default function ImageGallery({ images, title }: { images: string[], title: string }) {
    // İlk başta listedeki ilk resmi göster
    const [mainImage, setMainImage] = useState(images[0]);

    if (images.length === 0) return <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">Görsel Yok</div>;

    return (
        <div className="flex flex-col gap-4">

            {/* BÜYÜK GÖRSEL ALANI */}
            <div className="bg-zinc-900 rounded-2xl p-2 border border-zinc-800">
                <div className="relative w-full aspect-[4/5] md:aspect-square overflow-hidden rounded-xl">
                    <img
                        src={mainImage}
                        alt={title}
                        className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                    />
                </div>
            </div>

            {/* KÜÇÜK RESİMLER (THUMBNAILS) */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setMainImage(img)}
                            className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition ${
                                mainImage === img ? 'border-white opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                        >
                            <img src={img} alt={`${title} ${index}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

        </div>
    );
}