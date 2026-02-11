'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function SanatcilarYonet() {
    const [artists, setArtists] = useState<any[]>([]);

    const fetchArtists = async () => {
        const { data } = await supabase.from('artists').select('*').order('id', { ascending: false });
        if (data) setArtists(data);
    };

    useEffect(() => {
        fetchArtists();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Bu sanatçıyı ve ona ait TÜM ESERLERİ silmek istediğine emin misin?")) return;

        const { error } = await supabase.from('artists').delete().eq('id', id);
        if (error) alert("Hata: " + error.message);
        else fetchArtists(); // Listeyi yenile
    };

    return (
        <div>
            <h1 className="text-[22px] font-semibold tracking-tight mb-6 text-[#1e1e1e]">Sanatçıları Yönet</h1>
            <div className="bg-white rounded-sm overflow-hidden border border-[#cfcfcf]">
                <table className="w-full text-left text-sm text-[#3a3a3a]">
                    <thead className="bg-[#f3f3f3] text-[#5a5a5a] uppercase tracking-[0.16em] text-[11px]">
                    <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Foto</th>
                        <th className="p-4">İsim</th>
                        <th className="p-4">Bölüm</th>
                        <th className="p-4 text-right">İşlem</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e2e2]">
                    {artists.map((artist) => (
                        <tr key={artist.id} className="hover:bg-[#f6f6f6]">
                            <td className="p-4">{artist.id}</td>
                            <td className="p-4">
                                <img src={artist.image_url} className="w-10 h-10 rounded-full object-cover bg-[#e6e6e6]"/>
                            </td>
                            <td className="p-4 font-semibold text-[#1e1e1e]">{artist.name}</td>
                            <td className="p-4">{artist.department}</td>
                            <td className="p-4 text-right space-x-2">
                                <Link href={`/admin/sanatcilar/${artist.id}`} className="px-3 py-1 border border-[#1e1e1e] text-[#1e1e1e] rounded-sm text-xs uppercase tracking-[0.14em] hover:bg-[#1e1e1e] hover:text-white transition">Düzenle</Link>
                                <button onClick={() => handleDelete(artist.id)} className="px-3 py-1 border border-[#ef3218] text-[#ef3218] rounded-sm text-xs uppercase tracking-[0.14em] hover:bg-[#ef3218] hover:text-white transition">Sil</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
