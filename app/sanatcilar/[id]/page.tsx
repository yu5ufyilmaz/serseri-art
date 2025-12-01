import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import BuyButton from '@/components/BuyButton';
import AddToCartButton from '@/components/AddToCartButton';
import Link from 'next/link';

export default async function ArtistDetailPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    // 1. Sanatçı Bilgisi
    const { data: artist } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single();

    // 2. Eserleri
    const { data: works } = await supabase
        .from('works')
        .select('*')
        .eq('artist_id', id);

    if (!artist) {
        return <div className="text-white text-center mt-20">Sanatçı bulunamadı.</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white">

            {/* --- HERO: Sanatçı Profili --- */}
            <div className="relative h-[40vh] bg-zinc-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />

                <div className="z-20 text-center px-4">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white mb-4 bg-zinc-800">
                        {artist.image_url ? (
                            <img src={artist.image_url} alt={artist.name} className="w-full h-full object-cover"/>
                        ) : (
                            <span className="text-4xl flex items-center justify-center h-full">😎</span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">{artist.name}</h1>
                    <p className="mt-2 text-xl text-gray-300">{artist.department}</p>
                    <p className="mt-4 max-w-2xl mx-auto text-gray-400">{artist.bio}</p>
                </div>
            </div>

            {/* --- VİTRİN: Eserler --- */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-8 border-l-4 border-white pl-4">Eserler</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {works && works.map((work) => (
                        <div key={work.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition duration-300 flex flex-col">

                            {/* Eser Resmi (LİNK İLE SARILDI) */}
                            <Link href={`/eser/${work.id}`} className="h-64 bg-zinc-800 w-full relative group block cursor-pointer">
                                {work.image_url ? (
                                    <img src={work.image_url} alt={work.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600">Görsel Yok</div>
                                )}
                            </Link>

                            {/* Alt Bilgi Kutusu */}
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold mb-1">{work.title}</h3>
                                <p className="text-sm text-gray-400 mb-4">Orijinal Eser</p>

                                {/* Fiyat ve Butonlar */}
                                <div className="mt-auto pt-4 border-t border-zinc-800 flex flex-col gap-3">
                                    <div className="text-2xl font-mono font-bold text-green-400">
                                        {work.price} ₺
                                    </div>

                                    <div className="flex gap-2 w-full">
                                        {/* Sepet Butonu */}
                                        <div className="flex-1">
                                            <AddToCartButton product={work} />
                                        </div>
                                        {/* Satın Al Butonu */}
                                        <div className="flex-[2]">
                                            <BuyButton price={work.price} productName={work.title} id={work.id} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {works?.length === 0 && (
                        <p className="text-gray-500">Bu sanatçı henüz eser yüklememiş.</p>
                    )}
                </div>
            </div>

        </div>
    );
}