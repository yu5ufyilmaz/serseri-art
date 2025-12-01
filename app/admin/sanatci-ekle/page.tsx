'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SanatciEklePage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        bio: '',
        image_url: ''
    });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('artists')
            .insert([formData]);

        if (error) {
            alert('Hata: ' + error.message);
        } else {
            alert('✅ Sanatçı başarıyla eklendi!');
            setFormData({ name: '', department: '', bio: '', image_url: '' }); // Formu temizle
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-purple-400">Yeni Sanatçı Ekle</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-8 rounded-xl border border-zinc-800">

                <div>
                    <label className="block text-gray-400 mb-2">Sanatçı Adı</label>
                    <input required type="text" value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           className="w-full bg-black border border-zinc-700 rounded p-3 text-white outline-none focus:border-purple-500"
                           placeholder="Örn: Ahmet Yılmaz" />
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Bölümü</label>
                    <input required type="text" value={formData.department}
                           onChange={(e) => setFormData({...formData, department: e.target.value})}
                           className="w-full bg-black border border-zinc-700 rounded p-3 text-white outline-none focus:border-purple-500"
                           placeholder="Örn: Heykel" />
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Profil Fotoğrafı Linki (URL)</label>
                    <input required type="url" value={formData.image_url}
                           onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                           className="w-full bg-black border border-zinc-700 rounded p-3 text-white outline-none focus:border-purple-500"
                           placeholder="https://..." />
                    <p className="text-xs text-gray-600 mt-1">Şimdilik hızlıresim vb. linki kullanabilirsin.</p>
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Biyografi</label>
                    <textarea required rows={4} value={formData.bio}
                              onChange={(e) => setFormData({...formData, bio: e.target.value})}
                              className="w-full bg-black border border-zinc-700 rounded p-3 text-white outline-none focus:border-purple-500 resize-none"
                              placeholder="Sanatçı hakkında kısa bilgi..." />
                </div>

                <button disabled={loading} type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded transition">
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>

            </form>
        </div>
    );
}