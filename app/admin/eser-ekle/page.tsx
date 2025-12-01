'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function EserEklePage() {
    const [loading, setLoading] = useState(false);
    const [artists, setArtists] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]); // Kategoriler için state
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        artist_id: '',
        category_id: '' // Yeni alan
    });

    useEffect(() => {
        const fetchData = async () => {
            // Sanatçıları çek
            const { data: artistsData } = await supabase.from('artists').select('id, name');
            if (artistsData) setArtists(artistsData);

            // Kategorileri çek
            const { data: categoriesData } = await supabase.from('categories').select('id, name');
            if (categoriesData) setCategories(categoriesData);
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
            const { data: workData, error: dbError } = await supabase
                .from('works')
                .insert([{
                    title: formData.title,
                    price: Number(formData.price),
                    artist_id: formData.artist_id,
                    category_id: Number(formData.category_id), // Kategoriyi ekledik
                    image_url: uploadedUrls[0]
                }])
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
            setFormData({ title: '', price: '', artist_id: '', category_id: '' });
            setImageFiles([]);

        } catch (error: any) {
            alert('Hata: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-green-400">Yeni Eser Yükle</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-8 rounded-xl border border-zinc-800">

                <div>
                    <label className="block text-gray-400 mb-2">Eser Adı</label>
                    <input required type="text" value={formData.title}
                           onChange={(e) => setFormData({...formData, title: e.target.value})}
                           className="w-full bg-black border border-zinc-700 rounded p-3 text-white outline-none focus:border-green-500" placeholder="Örn: Gece Yürüyüşü" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 mb-2">Fiyat (TL)</label>
                        <input required type="number" value={formData.price}
                               onChange={(e) => setFormData({...formData, price: e.target.value})}
                               className="w-full bg-black border border-zinc-700 rounded p-3 text-white outline-none focus:border-green-500" placeholder="500" />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Sanatçı</label>
                        <select required value={formData.artist_id}
                                onChange={(e) => setFormData({...formData, artist_id: e.target.value})}
                                className="w-full bg-black border border-zinc-700 rounded p-3 text-white outline-none focus:border-green-500 appearance-none">
                            <option value="">Seçiniz...</option>
                            {artists.map(artist => <option key={artist.id} value={artist.id}>{artist.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* KATEGORİ SEÇİMİ (YENİ) */}
                <div>
                    <label className="block text-gray-400 mb-2">Kategori</label>
                    <select required value={formData.category_id}
                            onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                            className="w-full bg-black border border-zinc-700 rounded p-3 text-white outline-none focus:border-green-500 appearance-none">
                        <option value="">Kategori Seçiniz...</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-400 mb-2">Görseller (Çoklu Seçim)</label>
                    <div className="relative border-2 border-dashed border-zinc-700 rounded-lg p-6 hover:border-green-500 transition cursor-pointer">
                        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="text-center">
                            <span className="text-4xl mb-2 block">📸</span>
                            <p className="text-sm text-gray-400">{imageFiles.length > 0 ? `${imageFiles.length} dosya seçildi` : "Resimleri buraya sürükle veya tıkla"}</p>
                        </div>
                    </div>
                </div>

                <button disabled={loading} type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition">
                    {loading ? 'Yükleniyor...' : 'Eseri Yayınla'}
                </button>

            </form>
        </div>
    );
}