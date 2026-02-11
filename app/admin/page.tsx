import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-[28px] font-semibold tracking-tight mb-3 text-[#1e1e1e]">Yönetim Paneli</h1>
            <p className="text-[13px] tracking-[0.12em] uppercase text-[#6b6b6b] mb-8">Koleksiyon işaretli ürünler ana sayfada görünür.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* EKLEME BÖLÜMÜ */}
                <div className="space-y-4">
                    <h2 className="text-[14px] uppercase tracking-[0.2em] text-[#6b6b6b] border-b border-[#d2d2d2] pb-2">Yeni Ekle</h2>

                    <Link href="/admin/sanatci-ekle" className="group flex items-center gap-4 bg-white p-6 rounded-sm border border-[#cfcfcf] hover:border-[#1e1e1e] transition">
                        <div className="text-2xl">🎨</div>
                        <div>
                            <h3 className="font-semibold text-[#1e1e1e]">Sanatçı Ekle</h3>
                            <p className="text-xs uppercase tracking-[0.18em] text-[#8a8a8a]">Yeni isim kaydet</p>
                        </div>
                    </Link>

                    <Link href="/admin/eser-ekle" className="group flex items-center gap-4 bg-white p-6 rounded-sm border border-[#cfcfcf] hover:border-[#1e1e1e] transition">
                        <div className="text-2xl">🖼️</div>
                        <div>
                            <h3 className="font-semibold text-[#1e1e1e]">Eser Ekle</h3>
                            <p className="text-xs uppercase tracking-[0.18em] text-[#8a8a8a]">Vitrine yeni iş</p>
                        </div>
                    </Link>
                </div>

                {/* YÖNETME BÖLÜMÜ (YENİ) */}
                <div className="space-y-4">
                    <h2 className="text-[14px] uppercase tracking-[0.2em] text-[#6b6b6b] border-b border-[#d2d2d2] pb-2">Düzenle / Sil</h2>

                    <Link href="/admin/sanatcilar" className="group flex items-center gap-4 bg-white p-6 rounded-sm border border-[#cfcfcf] hover:border-[#1e1e1e] transition">
                        <div className="text-2xl">👥</div>
                        <div>
                            <h3 className="font-semibold text-[#1e1e1e]">Sanatçıları Yönet</h3>
                            <p className="text-xs uppercase tracking-[0.18em] text-[#8a8a8a]">Listele, düzenle, sil</p>
                        </div>
                    </Link>

                    <Link href="/admin/eserler" className="group flex items-center gap-4 bg-white p-6 rounded-sm border border-[#cfcfcf] hover:border-[#1e1e1e] transition">
                        <div className="text-2xl">📦</div>
                        <div>
                            <h3 className="font-semibold text-[#1e1e1e]">Eserleri Yönet</h3>
                            <p className="text-xs uppercase tracking-[0.18em] text-[#8a8a8a]">Fiyat güncelle, sil</p>
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    );
}
