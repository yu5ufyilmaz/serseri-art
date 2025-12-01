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
            <h1 className="text-2xl font-bold mb-6 text-blue-400">Sanatçıları Yönet</h1>
            <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-zinc-950 text-gray-200 uppercase font-bold">
                    <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Foto</th>
                        <th className="p-4">İsim</th>
                        <th className="p-4">Bölüm</th>
                        <th className="p-4 text-right">İşlem</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                    {artists.map((artist) => (
                        <tr key={artist.id} className="hover:bg-zinc-800/50">
                            <td className="p-4">{artist.id}</td>
                            <td className="p-4">
                                <img src={artist.image_url} className="w-10 h-10 rounded-full object-cover bg-zinc-800"/>
                            </td>
                            <td className="p-4 font-bold text-white">{artist.name}</td>
                            <td className="p-4">{artist.department}</td>
                            <td className="p-4 text-right space-x-2">
                                <Link href={`/admin/sanatcilar/${artist.id}`} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500">Düzenle</Link>
                                <button onClick={() => handleDelete(artist.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500">Sil</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}