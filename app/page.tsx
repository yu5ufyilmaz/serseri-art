import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import ProductShowcase from '@/components/ProductShowcase'; // Yeni bileşeni çağırıyoruz

export default async function Home() {

    // 1. Tüm eserleri çek
    const { data: works } = await supabase
        .from('works')
        .select(`*, artists ( name, id )`)
        .order('created_at', { ascending: false });

    // 2. Tüm kategorileri çek
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

    return (
        <div className="min-h-screen bg-white text-black">

            {/* Hero Bölümü */}
            <div className="relative bg-white border-b border-black py-20 px-4">
                <div className="container mx-auto relative z-10">
                    <div className="inline-flex items-center bg-[#e10600] text-white px-3 py-1 text-xs font-black uppercase tracking-[0.3em] mb-6">
                        serseri.art drop
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6 max-w-4xl">
                        Duvarların konuşsun. Sokak sanatının yeni vitrini.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 uppercase tracking-widest">
                        Öğrencilerin elinden çıkan, eşi benzeri olmayan eserleri keşfet. Aracı yok, komisyoncu yok. Sadece sanat var.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/sanatcilar" className="bg-black text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-[#e10600] transition">
                            Tüm Sanatçılar
                        </Link>
                        <Link href="/biz-kimiz" className="border border-black text-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-black hover:text-white transition">
                            Hikayemiz
                        </Link>
                    </div>
                </div>
            </div>

            {/* VİTRİN BİLEŞENİ (Filtreleme burada yapılacak) */}
            <ProductShowcase works={works || []} categories={categories || []} />

        </div>
    );
}
