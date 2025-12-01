import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import BuyButton from '@/components/BuyButton';
import AddToCartButton from '@/components/AddToCartButton';
import Link from 'next/link';

export default async function EserDetayPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    // 1. Eseri ve Sanatçısını Çek
    const { data: work } = await supabase
        .from('works')
        .select(`
      *,
      artists (
        id,
        name,
        department,
        image_url
      )
    `)
        .eq('id', id)
        .single();

    if (!work) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Eser bulunamadı.</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white pb-20">

            {/* Breadcrumb (Yol Haritası) */}
            <div className="container mx-auto px-4 py-4 text-sm text-gray-500 flex gap-2 items-center">
                <Link href="/" className="hover:text-white">Ana Sayfa</Link>
                <span>/</span>
                <Link href="/sanatcilar" className="hover:text-white">Sanatçılar</Link>
                <span>/</span>
                <Link href={`/sanatcilar/${work.artists?.id}`} className="hover:text-white">{work.artists?.name}</Link>
                <span>/</span>
                <span className="text-white truncate max-w-[150px]">{work.title}</span>
            </div>

            <div className="container mx-auto px-4 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* SOL: BÜYÜK GÖRSEL */}
                    <div className="bg-zinc-900 rounded-2xl p-2 border border-zinc-800">
                        <div className="relative w-full aspect-[4/5] md:aspect-square overflow-hidden rounded-xl">
                            {work.image_url ? (
                                <img
                                    src={work.image_url}
                                    alt={work.title}
                                    className="w-full h-full object-cover hover:scale-105 transition duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">Görsel Yok</div>
                            )}
                        </div>
                    </div>

                    {/* SAĞ: BİLGİLER VE BUTONLAR */}
                    <div className="flex flex-col justify-center">

                        {/* Sanatçı Kartı (Ufak) */}
                        <Link href={`/sanatcilar/${work.artists?.id}`} className="flex items-center gap-3 mb-6 group w-fit">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-700 group-hover:border-white transition">
                                {work.artists?.image_url ? (
                                    <img src={work.artists.image_url} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">🎨</div>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Sanatçı</p>
                                <p className="text-lg font-bold group-hover:underline">{work.artists?.name}</p>
                            </div>
                        </Link>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{work.title}</h1>

                        <div className="flex items-end gap-4 mb-8">
                            <span className="text-4xl font-mono font-bold text-green-400">{work.price} ₺</span>
                            <span className="text-gray-500 mb-1 text-sm line-through opacity-50">{(work.price * 1.2).toFixed(0)} ₺</span>
                        </div>

                        {/* Butonlar */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="h-14">
                                <AddToCartButton product={work} />
                            </div>
                            <div className="h-14">
                                <BuyButton price={work.price} productName={work.title} id={work.id} />
                            </div>
                        </div>

                        {/* Özellikler Kutusu */}
                        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-4">
                            <div className="flex justify-between border-b border-zinc-800 pb-2">
                                <span className="text-gray-400">Kategori</span>
                                <span>{work.artists?.department || 'Serbest'}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-800 pb-2">
                                <span className="text-gray-400">Orijinallik</span>
                                <span className="text-green-400">Tek ve Orijinal Eser</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-800 pb-2">
                                <span className="text-gray-400">Kargo</span>
                                <span>Alıcı Ödemeli</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">İade</span>
                                <span>Kargoda hasar durumunda</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ALT KISIM: AÇIKLAMALAR */}
                <div className="mt-20 max-w-4xl">
                    <h3 className="text-2xl font-bold mb-6 border-b border-zinc-800 pb-4">Eser Hakkında</h3>
                    <div className="space-y-4 text-gray-300 leading-relaxed">
                        <p>
                            Bu eser, <strong>{work.artists?.name}</strong> tarafından Muğla Sıtkı Koçman Üniversitesi atölyelerinde üretilmiş orijinal bir çalışmadır.
                            Sanatçının {work.artists?.department} bölümündeki çalışmaları kapsamında ortaya çıkan bu eser,
                            eşsiz (unique) olup sadece bir adet bulunmaktadır.
                        </p>
                        <p>
                            Eseri satın alarak hem genç bir yeteneğe destek olmuş olacak hem de yaşam alanınıza
                            hikayesi olan özgün bir parça katacaksınız.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}