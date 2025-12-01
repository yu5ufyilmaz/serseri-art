import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import BuyButton from '@/components/BuyButton';
import AddToCartButton from '@/components/AddToCartButton';
import ImageGallery from '@/components/ImageGallery'; // Yeni Galeri Bileşeni
import Link from 'next/link';

export default async function EserDetayPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    // 1. Eseri Çek
    const { data: work } = await supabase
        .from('works')
        .select(`
      *,
      artists (id, name, department, image_url)
    `)
        .eq('id', id)
        .single();

    // 2. Galerideki Resimleri Çek
    const { data: gallery } = await supabase
        .from('work_gallery')
        .select('image_url')
        .eq('work_id', id);

    if (!work) return <div className="text-white">Eser yok.</div>;

    // Tüm resimleri birleştiriyoruz (Eğer galeride resim yoksa ana resmi kullan)
    // Gallery verisi [{image_url: '...'}, {image_url: '...'}] şeklinde gelir, bunu düz diziye çeviriyoruz.
    const galleryImages = gallery && gallery.length > 0
        ? gallery.map(item => item.image_url)
        : [work.image_url];

    return (
        <div className="min-h-screen bg-black text-white pb-20">

            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-4 text-sm text-gray-500 flex gap-2 items-center">
                <Link href="/" className="hover:text-white">Ana Sayfa</Link>
                <span>/</span>
                <span className="text-white truncate">{work.title}</span>
            </div>

            <div className="container mx-auto px-4 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* SOL TARAF: GALERİ BİLEŞENİ */}
                    <div>
                        {/* Eski <img ... /> yerine artık bu var: */}
                        <ImageGallery images={galleryImages} title={work.title} />
                    </div>

                    {/* SAĞ TARAF: BİLGİLER (AYNI KALIYOR) */}
                    <div className="flex flex-col justify-center">

                        {/* Sanatçı */}
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
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="h-14"><AddToCartButton product={work} /></div>
                            <div className="h-14"><BuyButton price={work.price} productName={work.title} id={work.id} /></div>
                        </div>

                        {/* Özellikler Tablosu (Aynı) */}
                        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-4">
                            <div className="flex justify-between border-b border-zinc-800 pb-2">
                                <span className="text-gray-400">Kategori</span>
                                <span>{work.artists?.department || 'Serbest'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Orijinallik</span>
                                <span className="text-green-400">Tek ve Orijinal Eser</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Alt Açıklama (Aynı) */}
                <div className="mt-20 max-w-4xl">
                    <h3 className="text-2xl font-bold mb-6 border-b border-zinc-800 pb-4">Eser Hakkında</h3>
                    <p className="text-gray-300 leading-relaxed">
                        Bu eser, <strong>{work.artists?.name}</strong> tarafından üretilmiş orijinal bir çalışmadır.
                    </p>
                </div>

            </div>
        </div>
    );
}