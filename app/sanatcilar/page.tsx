import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type Artist = {
    id: string | number;
    name: string;
    department: string | null;
    bio: string | null;
    image_url: string | null;
};

export default async function SanatcilarPage() {
    const { data: artists, error } = await supabase
        .from('artists')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Veri cekme hatasi:', error);
    }

    return (
        <div className="mx-auto w-full max-w-[980px] px-4 py-10">
            <header className="mb-10 border-b border-[#cfcfcf] pb-6">
                <h1 className="text-3xl font-black tracking-tight">Sanatçı Dizini</h1>
                <p className="mt-2 text-[12px] tracking-[0.14em] text-[#5a5a5a]">
                    SEÇİLİ SANATÇILAR / KOLEKSİYON İÇİN ÜRETENLER
                </p>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(artists as Artist[] | null)?.map((artist) => (
                    <Link
                        key={artist.id}
                        href={`/sanatcilar/${artist.id}`}
                        className="group border border-[#cfcfcf] bg-[#efefef] p-3 transition hover:border-[#a0a0a0]"
                    >
                        <div className="mb-3 h-56 overflow-hidden border border-[#d8d8d8] bg-[#d7d7d7]">
                            {artist.image_url ? (
                                <img
                                    src={artist.image_url}
                                    alt={artist.name}
                                    className="h-full w-full object-cover grayscale transition group-hover:grayscale-0"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-[11px] tracking-[0.15em] text-[#6b6b6b]">
                                    GÖRSEL YOK
                                </div>
                            )}
                        </div>

                        <div className="border-t border-[#d4d4d4] pt-3">
                            <h2 className="text-lg font-bold">{artist.name}</h2>
                            <p className="mt-1 text-[11px] tracking-[0.12em] text-[#555]">
                                {artist.department || 'Multidisipliner'}
                            </p>
                            <p className="mt-2 line-clamp-2 text-sm text-[#666]">
                                {artist.bio || 'Bu sanatçı için açıklama eklenecek.'}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {(artists?.length || 0) === 0 && (
                <div className="mt-10 border border-dashed border-[#bdbdbd] p-10 text-center text-[12px] tracking-[0.14em] text-[#6c6c6c]">
                    HENÜZ SANATÇI EKLENMEMİŞ
                </div>
            )}
        </div>
    );
}
