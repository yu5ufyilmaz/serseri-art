import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import BuyButton from '@/components/BuyButton';
import Link from 'next/link';

// Sayfa veritabanından veri çekeceği için 'async' yapıyoruz
export default async function Home() {

    // 1. Eserleri ve o eserin sahibinin (sanatçının) adını çekiyoruz
    // Not: artists(name) kısmı, ilişkili tablodan veri çekmek içindir (Join işlemi)
    const { data: works, error } = await supabase
        .from('works')
        .select(`
      *,
      artists (
        name,
        id
      )
    `)
        .order('created_at', { ascending: false }); // En son eklenen en başta

    if (error) {
        console.error("Ana sayfa veri hatası:", error);
    }

    return (
        <div className="min-h-screen bg-black text-white">

            {/* --- HERO BÖLÜMÜ (VİTRİN TABELASI) --- */}
            <div className="relative bg-zinc-900 border-b border-zinc-800 py-20 px-4 overflow-hidden">
                {/* Arka plan süslemeleri */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

                <div className="container mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
                        Duvarların Konuşsun.
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        Öğrencilerin elinden çıkan, eşi benzeri olmayan eserleri keşfet.
                        Aracı yok, komisyoncu yok. Sadece sanat var.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/sanatcilar" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition">
                            Tüm Sanatçılar
                        </Link>
                        <Link href="/biz-kimiz" className="border border-zinc-700 text-white px-8 py-3 rounded-full font-bold hover:bg-zinc-800 transition">
                            Hikayemiz
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- ÜRÜN VİTRİNİ --- */}
            <div className="container mx-auto px-4 py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold border-l-4 border-purple-500 pl-4">Yeni Eklenenler</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {works?.map((work: any) => (
                        <div key={work.id} className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition duration-300 flex flex-col">

                            {/* Eser Resmi */}
                            <div className="h-64 overflow-hidden relative">
                                {work.image_url ? (
                                    <img
                                        src={work.image_url}
                                        alt={work.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">
                                        Görsel Yok
                                    </div>
                                )}

                                {/* Sanatçı Etiketi (Resmin Üstünde) */}
                                <Link
                                    href={`/sanatcilar/${work.artists?.id}`}
                                    className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full hover:bg-black transition flex items-center gap-1"
                                >
                                    <span>🎨</span>
                                    <span>{work.artists?.name || 'Anonim'}</span>
                                </Link>
                            </div>

                            {/* Bilgiler ve Satın Al */}
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold mb-1">{work.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">Orijinal Eser</p>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-800">
                  <span className="text-xl font-mono font-bold text-green-400">
                    {work.amount || work.price} ₺
                  </span>
                                    {/* Satın Al Butonu - Küçük Versiyon */}
                                    <div className="scale-90 origin-right">
                                        <BuyButton price={work.price} productName={work.title} id={work.id} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}

                    {/* Eğer hiç eser yoksa */}
                    {(!works || works.length === 0) && (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            <p className="text-xl">Henüz vitrine eser konmadı.</p>
                            <p className="text-sm mt-2">Ama yakında buralar çok değerlenecek.</p>
                        </div>
                    )}

                </div>
            </div>

            {/* --- ALT BİLGİ (FOOTER) --- */}
            <footer className="border-t border-zinc-900 mt-20 py-10 text-center text-zinc-600 text-sm">
                <p>&copy; 2024 serseri.art | Öğrenci İşi</p>
            </footer>

        </div>
    );
}