import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient'; // Az önce oluşturduğumuz bağlantı köprüsü

// Sayfayı 'async' yaptık çünkü veri gelmesini bekleyecek (Await)
export default async function SanatcilarPage() {

    // 1. Supabase'e git, 'artists' tablosundaki her şeyi (*) getir
    const { data: artists, error } = await supabase
        .from('artists')
        .select('*');

    // Eğer hata varsa konsola yaz (Debug için)
    if (error) {
        console.error("Veri çekme hatası:", error);
    }

    return (
        <div className="container mx-auto px-4 py-8">

            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Sanatçılarımız</h1>
                <p className="text-gray-400">Serseri ruhlu yetenekleri keşfet. (Canlı Veri)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Eğer veri geldiyse listele, gelmediyse boşluk göster */}
                {artists?.map((sanatci) => (
                    <Link
                        href={`/sanatcilar/${sanatci.id}`}
                        key={sanatci.id}
                        className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-white transition-colors duration-300"
                    >

                        {/* Resim Alanı (Resim yoksa renkli kutu göster) */}
                        <div className="h-48 w-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                            {sanatci.image_url ? (
                                <img src={sanatci.image_url} alt={sanatci.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl opacity-50">🎨</span>
                            )}
                        </div>

                        <div className="p-4">
                            <h2 className="text-xl font-bold text-white group-hover:text-gray-200">
                                {sanatci.name} {/* Veritabanındaki sütun adı: name */}
                            </h2>
                            <span className="inline-block px-2 py-1 mt-2 text-xs font-semibold text-black bg-white rounded">
                {sanatci.department} {/* Veritabanındaki sütun adı: department */}
              </span>
                            <p className="mt-3 text-sm text-gray-400 line-clamp-2">
                                {sanatci.bio} {/* Veritabanındaki sütun adı: bio */}
                            </p>
                        </div>

                    </Link>
                ))}

                {/* Eğer hiç sanatçı yoksa bu mesajı göster */}
                {artists?.length === 0 && (
                    <p className="text-white">Henüz hiç sanatçı eklenmemiş.</p>
                )}

            </div>
        </div>
    );
}