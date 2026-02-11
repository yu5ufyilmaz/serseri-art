import React from 'react';
import Link from 'next/link';

export default function SartlarPage() {
    return (
        <div className="mx-auto w-full max-w-[980px] px-4 py-10">
            <section className="border border-[#cfcfcf] bg-[#efefef] p-6">
                <p className="text-[12px] tracking-[0.14em] text-[#5e5e5e]">ŞARTLAR</p>
                <h1 className="mt-2 text-4xl font-black tracking-tight">Kullanım Şartları</h1>
                <p className="mt-3 text-sm text-[#6a6a6a]">Son güncelleme: 11 Şubat 2026</p>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#505050]">
                    serseri.art hizmetlerini kullanarak aşağıdaki şartları kabul etmiş olursun. Bu şartlar
                    hesap oluşturma, alışveriş ve platform kullanımını kapsar.
                </p>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="border border-[#cfcfcf] bg-[#efefef] p-5">
                    <h2 className="text-xl font-bold">Hesap ve Güvenlik</h2>
                    <ul className="mt-3 space-y-2 text-sm text-[#555]">
                        <li>- doğru ve güncel bilgi vermek senin sorumluluğundadır</li>
                        <li>- hesabın ve şifrenin güvenliği sana aittir</li>
                        <li>- yetkisiz kullanım tespitinde hesabı askıya alabiliriz</li>
                    </ul>
                </div>

                <div className="border border-[#cfcfcf] bg-[#efefef] p-5">
                    <h2 className="text-xl font-bold">Sipariş ve Ödeme</h2>
                    <ul className="mt-3 space-y-2 text-sm text-[#555]">
                        <li>- fiyatlar TL cinsindendir ve stok durumuna göre değişebilir</li>
                        <li>- ödemeler Iyzico altyapısı ile güvenli şekilde işlenir</li>
                        <li>- kart bilgileri tarafımızdan saklanmaz</li>
                    </ul>
                </div>
            </section>

            <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="border border-[#cfcfcf] bg-[#efefef] p-5">
                    <h2 className="text-xl font-bold">İade ve Teslimat</h2>
                    <ul className="mt-3 space-y-2 text-sm text-[#555]">
                        <li>- teslimat süreleri kargo ve bölgeye göre değişir</li>
                        <li>- iade ve iptal süreçleri için bizimle iletişime geçebilirsin</li>
                        <li>- özel üretim eserlerde süreçler ürün açıklamasına göre değişebilir</li>
                    </ul>
                </div>

                <div className="border border-[#cfcfcf] bg-[#efefef] p-5">
                    <h2 className="text-xl font-bold">İçerik ve Haklar</h2>
                    <ul className="mt-3 space-y-2 text-sm text-[#555]">
                        <li>- sitedeki içerikler ilgili sanatçılara ve serseri.art'a aittir</li>
                        <li>- izinsiz kopyalama veya ticari kullanım yasaktır</li>
                    </ul>
                </div>
            </section>

            <section className="mt-6 border border-[#cfcfcf] bg-[#efefef] p-5">
                <h2 className="text-xl font-bold">Değişiklikler</h2>
                <p className="mt-3 text-sm text-[#555]">
                    Şartlar zaman zaman güncellenebilir. Güncel metin her zaman bu sayfada yayınlanır.
                </p>
                <div className="mt-4 flex gap-2 text-[12px] tracking-[0.12em]">
                    <Link href="/" className="border border-[#bdbdbd] px-3 py-1 hover:border-[#9a9a9a]">
                        ana sayfa
                    </Link>
                    <Link href="/gizlilik" className="border border-[#bdbdbd] px-3 py-1 hover:border-[#9a9a9a]">
                        gizlilik
                    </Link>
                </div>
            </section>
        </div>
    );
}
