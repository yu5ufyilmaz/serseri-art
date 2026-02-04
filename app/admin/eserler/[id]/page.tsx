'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function EserDuzenle({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string>('');

    // Listeler
    const [artists, setArtists] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [supportsCollectionFields, setSupportsCollectionFields] = useState(false);

    // Form Verileri
    const [formData, setFormData] = useState<any>({
        is_collection_item: false,
        collection_tag: ''
    });
    const [newMainImage, setNewMainImage] = useState<File | null>(null); // Ana resim değişecekse

    // Galeri Yönetimi
    const [galleryImages, setGalleryImages] = useState<any[]>([]); // Mevcut galeri resimleri
    const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]); // Eklenecek yeni resimler

    useEffect(() => {
        params.then(p => {
            setId(p.id);
            fetchData(p.id);
        });
    }, [params]);

    const fetchData = async (workId: string) => {
        const { error: collectionFieldError } = await supabase
            .from('works')
            .select('is_collection_item')
            .limit(1);
        const hasCollectionFields = !collectionFieldError;
        setSupportsCollectionFields(hasCollectionFields);

        // 1. Eser Detayı
        const { data: work } = await supabase.from('works').select('*').eq('id', workId).single();
        if (work) {
            setFormData({
                ...work,
                is_collection_item: Boolean(work.is_collection_item),
                collection_tag: work.collection_tag || ''
            });
        }

        // 2. Galeri Resimleri (BU ESERE AİT OLANLAR)
        const { data: gallery } = await supabase.from('work_gallery').select('*').eq('work_id', workId);
        if (gallery) setGalleryImages(gallery);

        // 3. Listeler (Sanatçı & Kategori)
        const { data: artistList } = await supabase.from('artists').select('id, name');
        if (artistList) setArtists(artistList);

        const { data: categoryList } = await supabase.from('categories').select('id, name');
        if (categoryList) setCategories(categoryList);

        setLoading(false);
    };

    // --- RESİM SEÇME FONKSİYONLARI ---

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewMainImage(e.target.files[0]);
        }
    };

    const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setNewGalleryFiles(Array.from(e.target.files));
        }
    };

    // --- GALERİDEN RESİM SİLME ---
    const handleDeleteGalleryImage = async (imageId: number) => {
        if(!confirm("Bu resmi galeriden silmek istiyor musun?")) return;

        const { error } = await supabase.from('work_gallery').delete().eq('id', imageId);

        if (error) {
            alert("Silinirken hata oluştu: " + error.message);
        } else {
            // Listeyi ekrandan da güncelle
            setGalleryImages(prev => prev.filter(img => img.id !== imageId));
        }
    };

    // --- KAYDETME ---
    const handleUpdate = async (e: any) => {
        e.preventDefault();
        if (supportsCollectionFields && formData.is_collection_item && !String(formData.collection_tag || '').trim()) {
            alert("Koleksiyon ürünü için bir drop/koleksiyon adı girin.");
            return;
        }
        setLoading(true);

        try {
            let mainImageUrl = formData.image_url;

            // A. ANA RESİM GÜNCELLEME (Eğer seçildiyse)
            if (newMainImage) {
                const fileName = `${Date.now()}-main-${newMainImage.name.replace(/\s/g, '_')}`;
                const { error: uploadError } = await supabase.storage.from('images').upload(fileName, newMainImage);
                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
                mainImageUrl = publicUrl;
            }

            // B. ESER BİLGİLERİNİ GÜNCELLE
            const updatePayload: any = {
                title: formData.title,
                price: Number(formData.price),
                artist_id: formData.artist_id,
                category_id: formData.category_id,
                image_url: mainImageUrl
            };

            if (supportsCollectionFields) {
                updatePayload.is_collection_item = Boolean(formData.is_collection_item);
                updatePayload.collection_tag = formData.is_collection_item
                    ? String(formData.collection_tag || '').trim()
                    : null;
            }

            const { error: updateError } = await supabase.from('works').update(updatePayload).eq('id', id);

            if (updateError) throw updateError;

            // C. YENİ GALERİ RESİMLERİNİ YÜKLE VE EKLE
            if (newGalleryFiles.length > 0) {
                const galleryInserts = [];

                for (const file of newGalleryFiles) {
                    const fileName = `${Date.now()}-gallery-${file.name.replace(/\s/g, '_')}`;
                    const { error: upErr } = await supabase.storage.from('images').upload(fileName, file);
                    if (upErr) throw upErr;

                    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);

                    galleryInserts.push({
                        work_id: id,
                        image_url: publicUrl
                    });
                }

                const { error: galleryError } = await supabase.from('work_gallery').insert(galleryInserts);
                if (galleryError) throw galleryError;
            }

            alert("✅ Güncelleme Başarılı!");
            // Sayfayı yenile ki yeni resimler görünsün
            window.location.reload();

        } catch (error: any) {
            alert("Hata: " + error.message);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white p-10">Yükleniyor...</div>;

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <h1 className="text-2xl font-bold mb-6 text-yellow-400">Eseri Düzenle</h1>

            <form onSubmit={handleUpdate} className="space-y-8 bg-zinc-900 p-8 rounded-xl border border-zinc-800">

                {/* 1. ANA RESİM ALANI */}
                <div className="flex flex-col items-center gap-4 border-b border-zinc-800 pb-6">
                    <span className="text-gray-400 text-sm">Kapak Görseli</span>
                    <div className="h-48 w-auto rounded-lg overflow-hidden border-2 border-zinc-700 relative group">
                        <img src={newMainImage ? URL.createObjectURL(newMainImage) : formData.image_url} className="h-full object-contain" />
                        {/* Üzerine gelince değiştir ikonu */}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <span className="text-white text-sm">Değiştir</span>
                        </div>
                    </div>
                    <input type="file" accept="image/*" onChange={handleMainImageChange} className="text-sm text-gray-500" />
                </div>

                {/* 2. BİLGİ ALANLARI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">Eser Adı</label>
                        <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                               className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-yellow-500 outline-none" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">Fiyat (TL)</label>
                        <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                               className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-yellow-500 outline-none" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">Sanatçı</label>
                        <select value={formData.artist_id} onChange={e => setFormData({...formData, artist_id: e.target.value})}
                                className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-yellow-500 outline-none appearance-none">
                            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">Kategori</label>
                        <select value={formData.category_id || ''} onChange={e => setFormData({...formData, category_id: e.target.value})}
                                className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-yellow-500 outline-none appearance-none">
                            <option value="">Kategori Seçin</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                {supportsCollectionFields && (
                    <div className="rounded-lg border border-zinc-700 bg-zinc-950/60 p-4 space-y-4">
                        <label className="flex items-center gap-3 text-white">
                            <input
                                type="checkbox"
                                checked={Boolean(formData.is_collection_item)}
                                onChange={(e) => setFormData({...formData, is_collection_item: e.target.checked})}
                                className="h-4 w-4 accent-red-600"
                            />
                            <span className="font-bold">Ana sayfa koleksiyonunda göster</span>
                        </label>

                        {formData.is_collection_item && (
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Drop / Koleksiyon Adı</label>
                                <input
                                    type="text"
                                    value={formData.collection_tag || ''}
                                    onChange={(e) => setFormData({...formData, collection_tag: e.target.value})}
                                    className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-red-500 outline-none"
                                    placeholder="Örn: Winter 26 Drop"
                                />
                            </div>
                        )}
                    </div>
                )}

                {!supportsCollectionFields && (
                    <div className="rounded-lg border border-amber-600/40 bg-amber-950/30 p-4 text-sm text-amber-300">
                        Koleksiyon alanları henüz aktif değil.
                        `db/collection-schema-and-seed.sql` dosyasını çalıştırdıktan sonra ürünleri koleksiyon ürünü olarak işaretleyebilirsin.
                    </div>
                )}

                {/* 3. GALERİ YÖNETİMİ (MEVCUT RESİMLER) */}
                <div className="border-t border-zinc-800 pt-6">
                    <label className="text-sm text-gray-400 block mb-4">Galeri Resimleri (Mevcut)</label>

                    {galleryImages.length === 0 ? (
                        <p className="text-sm text-zinc-600 italic">Bu eserin ek görseli yok.</p>
                    ) : (
                        <div className="flex flex-wrap gap-4">
                            {galleryImages.map((img) => (
                                <div key={img.id} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-zinc-700">
                                    <img src={img.image_url} className="w-full h-full object-cover" />
                                    {/* Silme Butonu */}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteGalleryImage(img.id)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition transform hover:scale-110"
                                        title="Resmi Sil"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 4. YENİ RESİM EKLEME */}
                <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 border-dashed">
                    <label className="text-sm text-gray-300 block mb-2 font-bold">+ Galeriye Yeni Resim Ekle</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryFilesChange}
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-black hover:file:bg-yellow-500 cursor-pointer"
                    />
                    {newGalleryFiles.length > 0 && (
                        <p className="text-xs text-green-400 mt-2">{newGalleryFiles.length} yeni dosya seçildi (Kaydet'e basınca yüklenecek)</p>
                    )}
                </div>

                <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded font-bold text-gray-400 hover:text-white transition">Vazgeç</button>
                    <button disabled={loading} type="submit" className="flex-1 bg-yellow-600 text-black py-3 rounded font-bold hover:bg-yellow-500 transition">
                        {loading ? 'İşleniyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                </div>

            </form>
        </div>
    );
}
