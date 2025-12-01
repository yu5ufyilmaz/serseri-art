'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SanatciDuzenle({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string>('');

    // Form Verileri
    const [formData, setFormData] = useState<any>({});
    const [newImageFile, setNewImageFile] = useState<File | null>(null); // Yeni resim seçilirse burada duracak

    useEffect(() => {
        params.then(p => {
            setId(p.id);
            fetchArtist(p.id);
        });
    }, [params]);

    const fetchArtist = async (artistId: string) => {
        const { data } = await supabase.from('artists').select('*').eq('id', artistId).single();
        if (data) {
            setFormData(data);
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewImageFile(e.target.files[0]);
        }
    };

    const handleUpdate = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.image_url; // Varsayılan olarak eski resim kalsın

            // 1. EĞER YENİ RESİM SEÇİLDİYSE YÜKLE
            if (newImageFile) {
                const fileName = `artist_${Date.now()}_${newImageFile.name.replace(/\s/g, '_')}`;
                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(fileName, newImageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('images')
                    .getPublicUrl(fileName);

                imageUrl = publicUrl; // Yeni linki kullanacağız
            }

            // 2. VERİTABANINI GÜNCELLE
            const { error } = await supabase
                .from('artists')
                .update({
                    name: formData.name,
                    department: formData.department,
                    bio: formData.bio,
                    image_url: imageUrl
                })
                .eq('id', id);

            if (error) throw error;

            alert("✅ Sanatçı güncellendi!");
            router.push('/admin/sanatcilar');

        } catch (error: any) {
            alert("Hata: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white p-10">Yükleniyor...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-blue-400">Sanatçıyı Düzenle</h1>

            <form onSubmit={handleUpdate} className="space-y-6 bg-zinc-900 p-8 rounded-xl border border-zinc-800">

                {/* Mevcut Resim Gösterimi */}
                <div className="flex justify-center mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-700">
                        <img src={newImageFile ? URL.createObjectURL(newImageFile) : formData.image_url} className="w-full h-full object-cover" />
                    </div>
                </div>

                <div>
                    <label className="text-sm text-gray-400 block mb-2">İsim</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                           className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-blue-500 outline-none" />
                </div>

                <div>
                    <label className="text-sm text-gray-400 block mb-2">Bölüm</label>
                    <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                           className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-blue-500 outline-none" />
                </div>

                <div>
                    <label className="text-sm text-gray-400 block mb-2">Yeni Fotoğraf (İsteğe Bağlı)</label>
                    <input type="file" accept="image/*" onChange={handleImageChange}
                           className="w-full bg-black border border-zinc-700 rounded p-3 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
                </div>

                <div>
                    <label className="text-sm text-gray-400 block mb-2">Biyografi</label>
                    <textarea rows={5} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}
                              className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-blue-500 outline-none resize-none" />
                </div>

                <button disabled={loading} type="submit" className="w-full bg-blue-600 py-3 rounded font-bold hover:bg-blue-500 transition text-white">
                    {loading ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
            </form>
        </div>
    );
}