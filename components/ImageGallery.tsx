'use client';

import { useState } from 'react';

export default function ImageGallery({ images, title }: { images: string[], title: string }) {
    // İlk başta listedeki ilk resmi göster
    const [mainImage, setMainImage] = useState(images[0]);

    if (images.length === 0) return <div className="flex h-full w-full items-center justify-center bg-[#d8d8d8] text-[#666]">Görsel Yok</div>;

    return (
        <div className="flex flex-col gap-4">

            {/* BÜYÜK GÖRSEL ALANI */}
            <div className="border border-[#d5d5d5] bg-[#f5f5f5] p-2">
                <div className="relative w-full aspect-[4/5] overflow-hidden border border-[#d7d7d7] bg-[#d8d8d8]">
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
                            className={`relative h-20 w-20 shrink-0 overflow-hidden border transition ${
                                mainImage === img
                                    ? 'border-[#909090] opacity-100'
                                    : 'border-[#dbdbdb] opacity-65 hover:opacity-100'
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
