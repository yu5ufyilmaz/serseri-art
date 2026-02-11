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

    if (loading) return <div className="text-[#1e1e1e] p-10">Yükleniyor...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-[22px] font-semibold tracking-tight mb-6 text-[#1e1e1e]">Sanatçıyı Düzenle</h1>

            <form onSubmit={handleUpdate} className="space-y-6 bg-white p-6 sm:p-8 rounded-sm border border-[#cfcfcf]">

                {/* Mevcut Resim Gösterimi */}
                <div className="flex justify-center mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border border-[#cfcfcf] bg-[#f3f3f3]">
                        <img src={newImageFile ? URL.createObjectURL(newImageFile) : formData.image_url} className="w-full h-full object-cover" />
                    </div>
                </div>

                <div>
                    <label className="text-[11px] uppercase tracking-[0.18em] text-[#6b6b6b] block mb-2">İsim</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                           className="w-full bg-white border border-[#cfcfcf] rounded-sm p-3 text-[#1e1e1e] focus:border-[#1e1e1e] outline-none" />
                </div>

                <div>
                    <label className="text-[11px] uppercase tracking-[0.18em] text-[#6b6b6b] block mb-2">Bölüm</label>
                    <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                           className="w-full bg-white border border-[#cfcfcf] rounded-sm p-3 text-[#1e1e1e] focus:border-[#1e1e1e] outline-none" />
                </div>

                <div>
                    <label className="text-[11px] uppercase tracking-[0.18em] text-[#6b6b6b] block mb-2">Yeni Fotoğraf (İsteğe Bağlı)</label>
                    <input type="file" accept="image/*" onChange={handleImageChange}
                           className="w-full bg-white border border-[#cfcfcf] rounded-sm p-3 text-[#8a8a8a] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:uppercase file:tracking-[0.18em] file:bg-[#1e1e1e] file:text-white hover:file:bg-black cursor-pointer" />
                </div>

                <div>
                    <label className="text-[11px] uppercase tracking-[0.18em] text-[#6b6b6b] block mb-2">Biyografi</label>
                    <textarea rows={5} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}
                              className="w-full bg-white border border-[#cfcfcf] rounded-sm p-3 text-[#1e1e1e] focus:border-[#1e1e1e] outline-none resize-none" />
                </div>

                <button disabled={loading} type="submit" className="w-full bg-[#1e1e1e] py-3 rounded-sm font-semibold hover:bg-black transition text-white">
                    {loading ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
            </form>
        </div>
    );
}
