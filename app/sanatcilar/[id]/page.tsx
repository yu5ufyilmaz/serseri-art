import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import BuyButton from '@/components/BuyButton';
import AddToCartButton from '@/components/AddToCartButton';

type Artist = {
    id: string | number;
    name: string;
    department: string | null;
    bio: string | null;
    image_url: string | null;
};

type Work = {
    id: string | number;
    title: string;
    price: number;
    image_url: string | null;
    collection_tag?: string | null;
    is_collection_item?: boolean;
};

export default async function ArtistDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data: artist } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single();

    const { data: works } = await supabase
        .from('works')
        .select('*')
        .eq('artist_id', id)
        .order('created_at', { ascending: false });

    if (!artist) {
        return <div className="mx-auto max-w-[980px] px-4 py-20 text-center">Sanatçı bulunamadı.</div>;
    }

    const safeArtist = artist as Artist;
    const safeWorks = (works as Work[] | null) || [];

    return (
        <div className="mx-auto w-full max-w-[980px] px-4 py-10">
            <section className="grid grid-cols-1 gap-6 border border-[#cfcfcf] bg-[#efefef] p-4 md:grid-cols-[220px_1fr]">
                <div className="h-[220px] overflow-hidden border border-[#d6d6d6] bg-[#d2d2d2]">
                    {safeArtist.image_url ? (
                        <img src={safeArtist.image_url} alt={safeArtist.name} className="h-full w-full object-cover grayscale" />
                    ) : (
                        <div className="flex h-full items-center justify-center text-[11px] tracking-[0.14em] text-[#666]">
                            GÖRSEL YOK
                        </div>
                    )}
                </div>

                <div>
                    <h1 className="text-4xl font-black tracking-tight">{safeArtist.name}</h1>
                    <p className="mt-2 text-[12px] tracking-[0.14em] text-[#5e5e5e]">
                        {safeArtist.department || 'Multidisipliner'}
                    </p>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#4c4c4c]">
                        {safeArtist.bio || 'Bu sanatçının biyografisi yakında eklenecek.'}
                    </p>
                </div>
            </section>

            <section className="mt-10">
                <div className="mb-4 flex items-center justify-between border-b border-[#cfcfcf] pb-3">
                    <h2 className="text-2xl font-black">Eserler</h2>
                    <Link href="/" className="text-[12px] tracking-[0.12em] hover:underline">
                        koleksiyona dön
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {safeWorks.map((work) => (
                        <div key={work.id} className="border border-[#cfcfcf] bg-[#efefef] p-3">
                            <Link href={`/eser/${work.id}`} className="group block h-60 overflow-hidden border border-[#d8d8d8] bg-[#d6d6d6]">
                                {work.image_url ? (
                                    <img src={work.image_url} alt={work.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-[11px] tracking-[0.14em] text-[#666]">
                                        GÖRSEL YOK
                                    </div>
                                )}
                            </Link>

                            <div className="mt-3">
                                <h3 className="text-lg font-bold">{work.title}</h3>
                                <p className="mt-1 text-[11px] tracking-[0.12em] text-[#5d5d5d]">
                                    {work.collection_tag || (work.is_collection_item ? 'KOLEKSİYON' : 'ARŞİV')}
                                </p>
                                <p className="mt-2 text-xl font-bold">{work.price} ₺</p>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <AddToCartButton product={work} />
                                <BuyButton price={work.price} productName={work.title} id={work.id} />
                            </div>
                        </div>
                    ))}
                </div>

                {safeWorks.length === 0 && (
                    <div className="mt-6 border border-dashed border-[#bdbdbd] p-10 text-center text-[12px] tracking-[0.14em] text-[#6c6c6c]">
                        BU SANATÇININ HENÜZ EKLENMİŞ ESERİ YOK
                    </div>
                )}
            </section>
        </div>
    );
}
