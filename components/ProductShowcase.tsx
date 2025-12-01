'use client';

import { useState } from 'react';
import Link from 'next/link';
import BuyButton from '@/components/BuyButton';
import AddToCartButton from '@/components/AddToCartButton';

export default function ProductShowcase({ works, categories }: { works: any[], categories: any[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Filtreleme Mantığı
    const filteredWorks = selectedCategory === 'all'
        ? works
        : works.filter(work => String(work.category_id) === selectedCategory);

    return (
        <div className="container mx-auto px-4 py-16">

            {/* --- KATEGORİ FİLTRE BUTONLARI --- */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-6 py-2 rounded-full font-bold transition border ${
                        selectedCategory === 'all'
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-gray-400 border-zinc-700 hover:border-white hover:text-white'
                    }`}
                >
                    Tümü
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(String(cat.id))}
                        className={`px-6 py-2 rounded-full font-bold transition border ${
                            selectedCategory === String(cat.id)
                                ? 'bg-white text-black border-white'
                                : 'bg-transparent text-gray-400 border-zinc-700 hover:border-white hover:text-white'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* --- ÜRÜN LİSTESİ --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 auto-rows-fr">
                {filteredWorks.map((work) => (
                    <div key={work.id} className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition duration-300 flex flex-col h-full">

                        <Link href={`/eser/${work.id}`} className="h-64 w-full relative shrink-0 block cursor-pointer">
                            {work.image_url ? (
                                <img src={work.image_url} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
                            ) : (
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">Görsel Yok</div>
                            )}

                            <object>
                                <Link
                                    href={`/sanatcilar/${work.artists?.id}`}
                                    className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full hover:bg-black transition flex items-center gap-1 z-10"
                                >
                                    <span>🎨</span>
                                    <span>{work.artists?.name || 'Anonim'}</span>
                                </Link>
                            </object>
                        </Link>

                        <div className="p-5 flex flex-col flex-1 bg-zinc-900">
                            <h3 className="text-lg font-bold mb-1 text-white truncate">{work.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">Orijinal Eser</p>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-800 gap-2">
                  <span className="text-xl font-mono font-bold text-green-400 whitespace-nowrap">
                    {work.amount || work.price} ₺
                  </span>
                                <div className="flex gap-2 items-center">
                                    <div className="scale-90"><AddToCartButton product={work} /></div>
                                    <div className="scale-90 origin-right"><BuyButton price={work.price} productName={work.title} id={work.id} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredWorks.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        <p className="text-xl">Bu kategoride henüz eser yok.</p>
                    </div>
                )}
            </div>
        </div>
    );
}