import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import ProductShowcase from '@/components/ProductShowcase';

type HomeWork = {
    id: string | number;
    title: string;
    image_url: string | null;
    collection_tag?: string | null;
};

export default async function Home() {
    // Kategori listesi (koleksiyon alanı yoksa fallback için)
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

    const { error: collectionFieldError } = await supabase
        .from('works')
        .select('is_collection_item')
        .limit(1);

    let works: HomeWork[] = [];

    // Yeni şema: ana sayfada sadece koleksiyon ürünleri
    if (!collectionFieldError) {
        const { data: collectionWorks } = await supabase
            .from('works')
            .select('id, title, image_url, collection_tag')
            .eq('is_collection_item', true)
            .order('created_at', { ascending: false });

        works = (collectionWorks as HomeWork[]) || [];
    } else {
        // Eski şema fallback: adı "koleksiyon" geçen kategoriler
        const collectionCategoryIds = (categories || [])
            .filter((category) => /koleksiyon/i.test(String(category.name || '')))
            .map((category) => category.id);

        if (collectionCategoryIds.length > 0) {
            const { data: fallbackWorks } = await supabase
                .from('works')
                .select('id, title, image_url, collection_tag')
                .in('category_id', collectionCategoryIds)
                .order('created_at', { ascending: false });

            works = (fallbackWorks as HomeWork[]) || [];
        }
    }

    const istanbulNow = new Date();
    const dateLabel = new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Europe/Istanbul'
    }).format(istanbulNow);

    const timeLabel = new Intl.DateTimeFormat('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Istanbul'
    }).format(istanbulNow);

    return (
        <div className="min-h-screen text-[#1e1e1e]">
            <div className="mx-auto flex min-h-screen max-w-[980px] flex-col justify-between px-4 py-10 md:py-14">
                <section>
                    <div className="mx-auto flex max-w-[720px] flex-col items-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center bg-[#ef3218] px-3 py-1 text-[54px] font-black leading-none tracking-tight text-white italic"
                        >
                            serseri
                        </Link>
                        <p className="mt-4 text-[12px] tracking-[0.16em]">
                            {dateLabel} {timeLabel} İSTANBUL
                        </p>
                    </div>

                    <div className="mt-12">
                        <ProductShowcase works={works} />
                    </div>
                </section>

                <footer className="mx-auto mt-12 flex w-full max-w-[720px] items-center justify-between text-[12px] tracking-[0.12em]">
                    <Link href="/" className="hover:underline">
                        ana sayfa
                    </Link>

                    <div className="flex items-center gap-4">
                        <span>🇹🇷 TR</span>
                        <Link href="/sanatcilar" className="hover:underline">tüm ürünler</Link>
                        <Link href="/biz-kimiz" className="hover:underline">kargo</Link>
                        <Link href="/biz-kimiz" className="hover:underline">şartlar</Link>
                        <Link href="/biz-kimiz" className="hover:underline">gizlilik</Link>
                        <Link href="/biz-kimiz" className="hover:underline">s.s.s.</Link>
                    </div>
                </footer>
            </div>
        </div>
    );
}
