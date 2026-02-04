import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import BuyButton from '@/components/BuyButton';
import AddToCartButton from '@/components/AddToCartButton';
import ImageGallery from '@/components/ImageGallery';

type Work = {
    id: string | number;
    title: string;
    price: number;
    image_url: string | null;
    collection_tag?: string | null;
    artists?: {
        id: string | number;
        name: string;
        department?: string | null;
        image_url?: string | null;
    } | null;
};

export default async function EserDetayPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data: work } = await supabase
        .from('works')
        .select(`
            *,
            artists (id, name, department, image_url)
        `)
        .eq('id', id)
        .single();

    const { data: gallery } = await supabase
        .from('work_gallery')
        .select('image_url')
        .eq('work_id', id);

    if (!work) {
        return <div className="mx-auto max-w-[980px] px-4 py-20 text-center">Eser bulunamadı.</div>;
    }

    const safeWork = work as Work;
    const galleryImages = gallery && gallery.length > 0
        ? gallery.map((item: { image_url: string }) => item.image_url)
        : [safeWork.image_url || ''];

    return (
        <div className="mx-auto w-full max-w-[980px] px-4 py-10">
            <div className="mb-6 text-[12px] tracking-[0.12em]">
                <Link href="/" className="hover:underline">ana sayfa</Link>
                <span className="mx-2 text-[#666]">/</span>
                <span className="text-[#5d5d5d]">eser</span>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="border border-[#cfcfcf] bg-[#efefef] p-3">
                    <ImageGallery images={galleryImages} title={safeWork.title} />
                </div>

                <div className="border border-[#cfcfcf] bg-[#efefef] p-5">
                    {safeWork.artists?.id && (
                        <Link href={`/sanatcilar/${safeWork.artists.id}`} className="inline-flex items-center gap-3 hover:underline">
                            <div className="h-10 w-10 overflow-hidden rounded-full border border-[#bbbbbb] bg-[#d3d3d3]">
                                {safeWork.artists?.image_url ? (
                                    <img src={safeWork.artists.image_url} alt={safeWork.artists.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xs">🎨</div>
                                )}
                            </div>
                            <div>
                                <p className="text-[11px] tracking-[0.12em] text-[#666]">sanatçı</p>
                                <p className="text-sm font-bold">{safeWork.artists?.name}</p>
                            </div>
                        </Link>
                    )}

                    <h1 className="mt-5 text-4xl font-black tracking-tight">{safeWork.title}</h1>
                    <p className="mt-2 text-[12px] tracking-[0.12em] text-[#5f5f5f]">
                        {(safeWork.collection_tag || 'GENEL SEÇKİ').toUpperCase()}
                    </p>
                    <p className="mt-4 text-4xl font-bold">{safeWork.price} ₺</p>

                    <div className="mt-6 grid grid-cols-2 gap-2">
                        <AddToCartButton product={safeWork} />
                        <BuyButton price={safeWork.price} productName={safeWork.title} id={safeWork.id} />
                    </div>

                    <div className="mt-6 border-t border-[#d2d2d2] pt-4 text-sm">
                        <div className="mb-2 flex justify-between">
                            <span className="text-[#666]">Kategori</span>
                            <span>{safeWork.artists?.department || 'Serbest'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#666]">Orijinallik</span>
                            <span>Tek ve orijinal eser</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
