'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function EserEklePage() {
    const [loading, setLoading] = useState(false);
    const [artists, setArtists] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]); // Kategoriler için state
    const [supportsCollectionFields, setSupportsCollectionFields] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        artist_id: '',
        category_id: '',
        is_collection_item: false,
        collection_tag: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            // Sanatçıları çek
            const { data: artistsData } = await supabase.from('artists').select('id, name');
            if (artistsData) setArtists(artistsData);

            // Kategorileri çek
            const { data: categoriesData } = await supabase.from('categories').select('id, name');
            if (categoriesData) setCategories(categoriesData);

            // Koleksiyon alanları aktif mi?
            const { error: collectionFieldError } = await supabase
                .from('works')
                .select('is_collection_item')
                .limit(1);

            setSupportsCollectionFields(!collectionFieldError);
        };
        fetchData();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (imageFiles.length === 0) {
            alert("Lütfen en az bir resim seçin!");
            return;
        }
        if (!formData.category_id) {
            alert("Lütfen bir kategori seçin!");
            return;
        }
        if (supportsCollectionFields && formData.is_collection_item && !formData.collection_tag.trim()) {
            alert("Koleksiyon ürünleri için bir drop/koleksiyon adı girin!");
            return;
        }
        setLoading(true);

        try {
            const uploadedUrls: string[] = [];

            // 1. Resimleri Yükle
            for (const file of imageFiles) {
                const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
                const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
                uploadedUrls.push(publicUrl);
            }

            // 2. Eseri Kaydet (Kategori ID ile)
            const workPayload: any = {
                title: formData.title,
                price: Number(formData.price),
                artist_id: formData.artist_id,
                category_id: Number(formData.category_id),
                image_url: uploadedUrls[0]
            };

            if (supportsCollectionFields) {
                workPayload.is_collection_item = formData.is_collection_item;
                workPayload.collection_tag = formData.is_collection_item
                    ? formData.collection_tag.trim()
                    : null;
            }

            const { data: workData, error: dbError } = await supabase
                .from('works')
                .insert([workPayload])
                .select()
                .single();

            if (dbError) throw dbError;

            // 3. Galeriye Ekle
            const galleryInserts = uploadedUrls.map(url => ({
                work_id: workData.id,
                image_url: url
            }));

            const { error: galleryError } = await supabase.from('work_gallery').insert(galleryInserts);
            if (galleryError) throw galleryError;

            alert('✅ Eser başarıyla yüklendi!');
            setFormData({
                title: '',
                price: '',
                artist_id: '',
                category_id: '',
                is_collection_item: false,
                collection_tag: ''
            });
            setImageFiles([]);

        } catch (error: any) {
            alert('Hata: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-[26px] font-semibold tracking-tight mb-6 text-[#1e1e1e]">Yeni Eser Ekle</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-sm border border-[#cfcfcf]">

                <div>
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-[#6b6b6b] mb-2">Eser Adı</label>
                    <input required type="text" value={formData.title}
                           onChange={(e) => setFormData({...formData, title: e.target.value})}
                           className="w-full bg-white border border-[#cfcfcf] rounded-sm p-3 text-[#1e1e1e] outline-none focus:border-[#1e1e1e]" placeholder="Örn: Gece Yürüyüşü" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] uppercase tracking-[0.18em] text-[#6b6b6b] mb-2">Fiyat (TL)</label>
                        <input required type="number" value={formData.price}
                               onChange={(e) => setFormData({...formData, price: e.target.value})}
                               className="w-full bg-white border border-[#cfcfcf] rounded-sm p-3 text-[#1e1e1e] outline-none focus:border-[#1e1e1e]" placeholder="500" />
                    </div>
                    <div>
                        <label className="block text-[11px] uppercase tracking-[0.18em] text-[#6b6b6b] mb-2">Sanatçı</label>
                        <select required value={formData.artist_id}
                                onChange={(e) => setFormData({...formData, artist_id: e.target.value})}
                                className="w-full bg-white border border-[#cfcfcf] rounded-sm p-3 text-[#1e1e1e] outline-none focus:border-[#1e1e1e] appearance-none">
                            <option value="">Seçiniz...</option>
                            {artists.map(artist => <option key={artist.id} value={artist.id}>{artist.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* KATEGORİ SEÇİMİ (YENİ) */}
                <div>
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-[#6b6b6b] mb-2">Kategori</label>
                    <select required value={formData.category_id}
                            onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                            className="w-full bg-white border border-[#cfcfcf] rounded-sm p-3 text-[#1e1e1e] outline-none focus:border-[#1e1e1e] appearance-none">
                        <option value="">Kategori Seçiniz...</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </div>

                {supportsCollectionFields && (
                    <div className="space-y-4 rounded-sm border border-[#d4d4d4] bg-[#f4f4f4] p-4">
                        <label className="flex items-center gap-3 text-[#1e1e1e]">
                            <input
                                type="checkbox"
                                checked={formData.is_collection_item}
                                onChange={(e) => setFormData({...formData, is_collection_item: e.target.checked})}
                                className="h-4 w-4 accent-[#ef3218]"
                            />
                            <span className="font-semibold">Bu ürün ana sayfada koleksiyonda görünsün</span>
                        </label>

                        {formData.is_collection_item && (
                            <div>
                                <label className="block text-[11px] uppercase tracking-[0.18em] text-[#6b6b6b] mb-2">Drop / Koleksiyon Adı</label>
                                <input
                                    type="text"
                                    value={formData.collection_tag}
                                    onChange={(e) => setFormData({...formData, collection_tag: e.target.value})}
                                    className="w-full bg-white border border-[#cfcfcf] rounded-sm p-3 text-[#1e1e1e] outline-none focus:border-[#ef3218]"
                                    placeholder="Örn: Winter 26 Drop"
                                />
                            </div>
                        )}
                    </div>
                )}

                {!supportsCollectionFields && (
                    <div className="rounded-sm border border-amber-600/40 bg-amber-200/40 p-4 text-sm text-amber-900">
                        Koleksiyon alanları veritabanında henüz aktif görünmüyor.
                        `db/collection-schema-and-seed.sql` dosyasını bir kez çalıştırırsan bu özellik açılır.
                    </div>
                )}

                <div>
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-[#6b6b6b] mb-2">Görseller (Çoklu Seçim)</label>
                    <div className="relative border-2 border-dashed border-[#cfcfcf] rounded-sm p-6 hover:border-[#1e1e1e] transition cursor-pointer bg-white">
                        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="text-center">
                            <span className="text-3xl mb-2 block">📸</span>
                            <p className="text-xs uppercase tracking-[0.18em] text-[#8a8a8a]">
                                {imageFiles.length > 0 ? `${imageFiles.length} dosya seçildi` : "Resimleri buraya sürükle veya tıkla"}
                            </p>
                        </div>
                    </div>
                </div>

                <button disabled={loading} type="submit" className="w-full bg-[#1e1e1e] hover:bg-black text-white font-semibold py-3 rounded-sm transition">
                    {loading ? 'Yükleniyor...' : 'Eseri Yayınla'}
                </button>

            </form>
        </div>
    );
}
