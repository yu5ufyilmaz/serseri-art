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
        <div className="min-h-screen bg-black text-white">

            {/* Hero Bölümü */}
            <div className="relative bg-zinc-900 border-b border-zinc-800 py-20 px-4 overflow-hidden">
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

            {/* VİTRİN BİLEŞENİ (Filtreleme burada yapılacak) */}
            <ProductShowcase works={works || []} categories={categories || []} />

        </div>
    );
}