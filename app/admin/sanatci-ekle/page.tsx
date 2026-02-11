'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SanatciEklePage() {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null); // Dosya için state

    const [formData, setFormData] = useState({
        name: '',
        department: '',
        bio: ''
    });

    // Dosya seçilince çalışacak fonksiyon
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!imageFile) {
            alert("Lütfen bir profil fotoğrafı seçin!");
            return;
        }

        setLoading(true);

        try {
            // 1. Resmi Storage'a Yükle
            // Dosya ismini benzersiz yapıyoruz (artist_zaman_dosyaadi)
            const fileName = `artist_${Date.now()}_${imageFile.name.replace(/\s/g, '_')}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(fileName, imageFile);

            if (uploadError) throw uploadError;

            // 2. Yüklenen resmin linkini al
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(fileName);

            // 3. Sanatçıyı veritabanına kaydet
            const { error: dbError } = await supabase
                .from('artists')
                .insert([{
                    name: formData.name,
                    department: formData.department,
                    bio: formData.bio,
                    image_url: publicUrl // Oluşan linki buraya koyuyoruz
                }]);

            if (dbError) throw dbError;

            alert('✅ Sanatçı başarıyla eklendi!');
            // Formu temizle
            setFormData({ name: '', department: '', bio: '' });
            setImageFile(null);

        } catch (error: any) {
            alert('Hata: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-[26px] font-semibold tracking-tight mb-6 text-[#1e1e1e]">Yeni Sanatçı Ekle</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-sm border border-[#cfcfcf]">

                <div>
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-[#6b6b6b] mb-2">Sanatçı Adı</label>
                    <input required type="text" value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           className="w-full bg-white border border-[#cfcfcf] rounded-sm p-3 text-[#1e1e1e] outline-none focus:border-[#1e1e1e]"
                           placeholder="Örn: Ahmet Yılmaz" />
                </div>

                <div>
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-[#6b6b6b] mb-2">Bölümü</label>
                    <input required type="text" value={formData.department}
                           onChange={(e) => setFormData({...formData, department: e.target.value})}
                           className="w-full bg-white border border-[#cfcfcf] rounded-sm p-3 text-[#1e1e1e] outline-none focus:border-[#1e1e1e]"
                           placeholder="Örn: Heykel" />
                </div>

                {/* DOSYA YÜKLEME ALANI (Yeni) */}
                <div>
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-[#6b6b6b] mb-2">Profil Fotoğrafı</label>
                    <div className="relative border-2 border-dashed border-[#cfcfcf] rounded-sm p-6 hover:border-[#1e1e1e] transition group cursor-pointer bg-white">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center">
                            <span className="text-3xl mb-2 block">📸</span>
                            <p className="text-xs uppercase tracking-[0.18em] text-[#8a8a8a] group-hover:text-[#1e1e1e] transition">
                                {imageFile ? `Seçilen: ${imageFile.name}` : "Fotoğrafı buraya bırak veya seç"}
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-[#6b6b6b] mb-2">Biyografi</label>
                    <textarea required rows={4} value={formData.bio}
                              onChange={(e) => setFormData({...formData, bio: e.target.value})}
                              className="w-full bg-white border border-[#cfcfcf] rounded-sm p-3 text-[#1e1e1e] outline-none focus:border-[#1e1e1e] resize-none"
                              placeholder="Sanatçı hakkında kısa bilgi..." />
                </div>

                <button disabled={loading} type="submit" className="w-full bg-[#1e1e1e] hover:bg-black text-white font-semibold py-3 rounded-sm transition">
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>

            </form>
        </div>
    );
}
