import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Hoşgeldin Patron</h1>
            <p className="text-gray-400 mb-8">Buradan dükkanı yönetebilirsin.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* EKLEME BÖLÜMÜ */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2">Yeni Ekle</h2>

                    <Link href="/admin/sanatci-ekle" className="flex items-center gap-4 bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-purple-500 transition group">
                        <div className="text-3xl">🎨</div>
                        <div>
                            <h3 className="font-bold group-hover:text-purple-400">Sanatçı Ekle</h3>
                            <p className="text-sm text-gray-500">Yeni yetenek kaydet</p>
                        </div>
                    </Link>

                    <Link href="/admin/eser-ekle" className="flex items-center gap-4 bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-green-500 transition group">
                        <div className="text-3xl">🖼️</div>
                        <div>
                            <h3 className="font-bold group-hover:text-green-400">Eser Ekle</h3>
                            <p className="text-sm text-gray-500">Vitrine ürün koy</p>
                        </div>
                    </Link>
                </div>

                {/* YÖNETME BÖLÜMÜ (YENİ) */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2">Düzenle / Sil</h2>

                    <Link href="/admin/sanatcilar" className="flex items-center gap-4 bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-blue-500 transition group">
                        <div className="text-3xl">👥</div>
                        <div>
                            <h3 className="font-bold group-hover:text-blue-400">Sanatçıları Yönet</h3>
                            <p className="text-sm text-gray-500">Listele, düzenle, sil</p>
                        </div>
                    </Link>

                    <Link href="/admin/eserler" className="flex items-center gap-4 bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-yellow-500 transition group">
                        <div className="text-3xl">📦</div>
                        <div>
                            <h3 className="font-bold group-hover:text-yellow-400">Eserleri Yönet</h3>
                            <p className="text-sm text-gray-500">Fiyat güncelle, sil</p>
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    );
}