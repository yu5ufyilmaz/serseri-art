import React from 'react';
import Link from 'next/link';

export default function GizlilikPage() {
    return (
        <div className="mx-auto w-full max-w-[980px] px-4 py-10">
            <section className="border border-[#cfcfcf] bg-[#efefef] p-6">
                <p className="text-[12px] tracking-[0.14em] text-[#5e5e5e]">GİZLİLİK</p>
                <h1 className="mt-2 text-4xl font-black tracking-tight">Gizlilik Politikası</h1>
                <p className="mt-3 text-sm text-[#6a6a6a]">Son güncelleme: 11 Şubat 2026</p>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#505050]">
                    Bu politika, serseri.art üzerinde oluşturduğun hesap ve verdiğin siparişlerle ilgili
                    kişisel verilerin nasıl işlendiğini özetler. Amacımız sade: gerekli olanı toplarız,
                    güvenli tutarız ve üçüncü taraflarla sadece hizmet için zorunlu olduğunda paylaşırız.
                </p>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="border border-[#cfcfcf] bg-[#efefef] p-5">
                    <h2 className="text-xl font-bold">Toplanan Veriler</h2>
                    <ul className="mt-3 space-y-2 text-sm text-[#555]">
                        <li>- ad, soyad ve e-posta</li>
                        <li>- telefon ve teslimat adresi</li>
                        <li>- sipariş ve ödeme sonucu (kart bilgisi tutulmaz)</li>
                        <li>- hesap güvenliği için teknik oturum verileri</li>
                    </ul>
                </div>

                <div className="border border-[#cfcfcf] bg-[#efefef] p-5">
                    <h2 className="text-xl font-bold">Kullanım Amaçları</h2>
                    <ul className="mt-3 space-y-2 text-sm text-[#555]">
                        <li>- hesap oluşturma ve giriş doğrulama</li>
                        <li>- siparişleri işleme ve teslimat</li>
                        <li>- müşteri desteği ve güvenlik</li>
                        <li>- yasal yükümlülüklerin yerine getirilmesi</li>
                    </ul>
                </div>
            </section>

            <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="border border-[#cfcfcf] bg-[#efefef] p-5">
                    <h2 className="text-xl font-bold">Üçüncü Taraflar</h2>
                    <ul className="mt-3 space-y-2 text-sm text-[#555]">
                        <li>- kimlik ve veri yönetimi: Supabase</li>
                        <li>- ödeme altyapısı: Iyzico</li>
                        <li>- sosyal giriş: Google (isteğe bağlı)</li>
                    </ul>
                    <p className="mt-3 text-xs text-[#666]">
                        Bu sağlayıcılarla sadece hizmeti sunmak için gerekli veriler paylaşılır.
                    </p>
                </div>

                <div className="border border-[#cfcfcf] bg-[#efefef] p-5">
                    <h2 className="text-xl font-bold">Hakların</h2>
                    <ul className="mt-3 space-y-2 text-sm text-[#555]">
                        <li>- verilerine erişme ve güncelleme</li>
                        <li>- hesabını silme ve verileri kaldırma</li>
                        <li>- veri işlenmesine itiraz</li>
                    </ul>
                    <p className="mt-3 text-xs text-[#666]">
                        Talepler için: iletisim@serseri.art
                    </p>
                </div>
            </section>

            <section className="mt-6 border border-[#cfcfcf] bg-[#efefef] p-5">
                <h2 className="text-xl font-bold">İletişim</h2>
                <p className="mt-3 text-sm text-[#555]">Soruların için: iletisim@serseri.art</p>
                <div className="mt-4 flex gap-2 text-[12px] tracking-[0.12em]">
                    <Link href="/" className="border border-[#bdbdbd] px-3 py-1 hover:border-[#9a9a9a]">
                        ana sayfa
                    </Link>
                    <Link href="/biz-kimiz" className="border border-[#bdbdbd] px-3 py-1 hover:border-[#9a9a9a]">
                        hakkımızda
                    </Link>
                </div>
            </section>
        </div>
    );
}
