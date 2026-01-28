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
                    className={`px-6 py-2 font-bold transition border uppercase tracking-widest text-xs ${
                        selectedCategory === 'all'
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-black border-black hover:bg-black hover:text-white'
                    }`}
                >
                    Tümü
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(String(cat.id))}
                        className={`px-6 py-2 font-bold transition border uppercase tracking-widest text-xs ${
                            selectedCategory === String(cat.id)
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-black border-black hover:bg-black hover:text-white'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* --- ÜRÜN LİSTESİ --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 auto-rows-fr">
                {filteredWorks.map((work) => (
                    <div key={work.id} className="group bg-white border border-black overflow-hidden hover:shadow-[8px_8px_0_0_#000] transition duration-300 flex flex-col h-full">

                        <Link href={`/eser/${work.id}`} className="h-64 w-full relative shrink-0 block cursor-pointer">
                            {work.image_url ? (
                                <img src={work.image_url} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 uppercase tracking-widest text-xs">Görsel Yok</div>
                            )}

                            <object>
                                <Link
                                    href={`/sanatcilar/${work.artists?.id}`}
                                    className="absolute bottom-3 left-3 bg-[#e10600] text-white text-[10px] px-3 py-1 uppercase tracking-widest font-bold hover:bg-black transition flex items-center gap-1 z-10"
                                >
                                    <span>🎨</span>
                                    <span>{work.artists?.name || 'Anonim'}</span>
                                </Link>
                            </object>
                        </Link>

                        <div className="p-5 flex flex-col flex-1 bg-white">
                            <h3 className="text-lg font-black mb-1 text-black uppercase tracking-tight truncate">{work.title}</h3>
                            <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest">Orijinal Eser</p>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-black gap-2">
                  <span className="text-xl font-black text-black whitespace-nowrap">
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
