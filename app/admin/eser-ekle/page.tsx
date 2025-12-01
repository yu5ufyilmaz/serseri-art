'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function EserEklePage() {
    const [loading, setLoading] = useState(false);
    const [artists, setArtists] = useState<any[]>([]); // Sanatçı listesi

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        image_url: '',
        artist_id: ''
    });

    // Sayfa açılınca sanatçıları çek (Dropdown için)
    useEffect(() => {
        const fetchArtists = async () => {
            const { data } = await supabase.from('artists').select('id, name');
            if (data) setArtists(data);
        };
        fetchArtists();
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('works')
            .insert([{
                ...formData,
                price: Number(formData.price) // Fiyatı sayıya çevir
            }]);

        if (error) {
            alert('Hata: ' + error.message);
        } else {
            alert('✅ Eser başarıyla yüklendi!');
            setFormData({ title: '', price: '', image_url: '', artist_id: '' });
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-green-400">Yeni Eser Yükle</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-8 rounded-xl border border-zinc-800">

                <div>
                    <label className="block text-gray-400 mb-2">Eser Adı</label>
                    <input required type="text" value={formData.title}
                           onChange={(e) => setFormData({...formData, title: e.target.value})}
                           className="w-full bg-black border border-zinc-700 rounded p-3 text-white outline-none focus:border-green-500"
                           placeholder="Örn: Gece Yürüyüşü" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 mb-2">Fiyat (TL)</label>
                        <input required type="number" value={formData.price}
                               onChange={(e) => setFormData({...formData, price: e.target.value})}
                               className="w-full bg-black border border-zinc-700 rounded p-3 text-white outline-none focus:border-green-500"
                               placeholder="500" />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Sanatçı Seç</label>
                        <select required value={formData.artist_id}
                                onChange={(e) => setFormData({...formData, artist_id: e.target.value})}
                                className="w-full bg-black border border-zinc-700 rounded p-3 text-white outline-none focus:border-green-500 appearance-none"
                        >
                            <option value="">Seçiniz...</option>
                            {artists.map(artist => (
                                <option key={artist.id} value={artist.id}>{artist.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Eser Görseli Linki (URL)</label>
                    <input required type="url" value={formData.image_url}
                           onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                           className="w-full bg-black border border-zinc-700 rounded p-3 text-white outline-none focus:border-green-500"
                           placeholder="https://..." />
                </div>

                <button disabled={loading} type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition">
                    {loading ? 'Yükleniyor...' : 'Eseri Yayınla'}
                </button>

            </form>
        </div>
    );
}