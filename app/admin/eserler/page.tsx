'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function EserlerYonet() {
    const [works, setWorks] = useState<any[]>([]);

    const fetchWorks = async () => {
        const { data } = await supabase.from('works').select('*, artists(name)').order('id', { ascending: false });
        if (data) setWorks(data);
    };

    useEffect(() => {
        fetchWorks();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Bu eseri silmek istediğine emin misin?")) return;
        const { error: galleryError } = await supabase.from('work_gallery').delete().eq('work_id', id);
        if (galleryError) {
            alert("Hata (galeri): " + galleryError.message);
            return;
        }

        const { error } = await supabase.from('works').delete().eq('id', id);
        if (error) alert("Hata (eser): " + error.message);
        else fetchWorks();
    };

    return (
        <div>
            <h1 className="text-[22px] font-semibold tracking-tight mb-6 text-[#1e1e1e]">Eserleri Yönet</h1>
            <div className="bg-white rounded-sm overflow-hidden border border-[#cfcfcf]">
                <table className="w-full text-left text-sm text-[#3a3a3a]">
                    <thead className="bg-[#f3f3f3] text-[#5a5a5a] uppercase tracking-[0.16em] text-[11px]">
                    <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Görsel</th>
                        <th className="p-4">Başlık</th>
                        <th className="p-4">Fiyat</th>
                        <th className="p-4">Sanatçı</th>
                        <th className="p-4">Koleksiyon</th>
                        <th className="p-4 text-right">İşlem</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e2e2]">
                    {works.map((work) => (
                        <tr key={work.id} className="hover:bg-[#f6f6f6]">
                            <td className="p-4">{work.id}</td>
                            <td className="p-4">
                                <img src={work.image_url} className="w-12 h-12 rounded-sm object-cover bg-[#e6e6e6]"/>
                            </td>
                            <td className="p-4 font-semibold text-[#1e1e1e]">{work.title}</td>
                            <td className="p-4 font-mono text-[#1e1e1e]">{work.price} ₺</td>
                            <td className="p-4">{work.artists?.name}</td>
                            <td className="p-4">
                                {work.is_collection_item ? (
                                    <div className="flex flex-col gap-1">
                                        <span className="inline-flex w-fit px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ef3218] text-white">
                                            Koleksiyon
                                        </span>
                                        {work.collection_tag && (
                                            <span className="text-xs text-[#6b6b6b]">{work.collection_tag}</span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-xs text-[#8a8a8a]">Normal ürün</span>
                                )}
                            </td>
                            <td className="p-4 text-right space-x-2">
                                <Link href={`/admin/eserler/${work.id}`} className="px-3 py-1 border border-[#1e1e1e] text-[#1e1e1e] rounded-sm text-xs uppercase tracking-[0.14em] hover:bg-[#1e1e1e] hover:text-white transition">Düzenle</Link>
                                <button onClick={() => handleDelete(work.id)} className="px-3 py-1 border border-[#ef3218] text-[#ef3218] rounded-sm text-xs uppercase tracking-[0.14em] hover:bg-[#ef3218] hover:text-white transition">Sil</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
