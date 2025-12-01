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
        const { error } = await supabase.from('works').delete().eq('id', id);
        if (error) alert("Hata: " + error.message);
        else fetchWorks();
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-yellow-400">Eserleri Yönet</h1>
            <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-zinc-950 text-gray-200 uppercase font-bold">
                    <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Görsel</th>
                        <th className="p-4">Başlık</th>
                        <th className="p-4">Fiyat</th>
                        <th className="p-4">Sanatçı</th>
                        <th className="p-4 text-right">İşlem</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                    {works.map((work) => (
                        <tr key={work.id} className="hover:bg-zinc-800/50">
                            <td className="p-4">{work.id}</td>
                            <td className="p-4">
                                <img src={work.image_url} className="w-12 h-12 rounded object-cover bg-zinc-800"/>
                            </td>
                            <td className="p-4 font-bold text-white">{work.title}</td>
                            <td className="p-4 font-mono text-green-400">{work.price} ₺</td>
                            <td className="p-4">{work.artists?.name}</td>
                            <td className="p-4 text-right space-x-2">
                                <Link href={`/admin/eserler/${work.id}`} className="px-3 py-1 bg-yellow-600 text-black font-bold rounded hover:bg-yellow-500">Düzenle</Link>
                                <button onClick={() => handleDelete(work.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500">Sil</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}