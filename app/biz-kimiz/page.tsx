import React from 'react';
import Link from 'next/link';

export default function BizKimizPage() {
    return (
        <div className="mx-auto w-full max-w-[980px] px-4 py-10">
            <section className="border border-[#cfcfcf] bg-[#efefef] p-6">
                <p className="text-[12px] tracking-[0.14em] text-[#5e5e5e]">HAKKIMIZDA</p>
                <h1 className="mt-2 text-4xl font-black tracking-tight">Sanatın Diploması Olmaz.</h1>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#505050]">
                    Serseri, kampüsten çıkan bağımsız sanat üreticilerini izleyiciyle doğrudan buluşturan
                    minimal bir koleksiyon platformudur. Arada komisyoncu değil, sanatçı ve eser var.
                </p>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="border border-[#cfcfcf] bg-[#efefef] p-5">
                    <h2 className="text-xl font-bold">Misyon</h2>
                    <ul className="mt-3 space-y-2 text-sm text-[#555]">
                        <li>- öğrenci sanatçılara görünürlük ve gelir sağlamak</li>
                        <li>- koleksiyon ürünlerini ulaşılabilir hale getirmek</li>
                        <li>- dijital sokak kültürü ile sanat alışını birleştirmek</li>
                    </ul>
                </div>

                <div className="border border-[#cfcfcf] bg-[#efefef] p-5">
                    <h2 className="text-xl font-bold">İletişim</h2>
                    <p className="mt-3 text-sm text-[#555]">
                        iletisim@serseri.art
                    </p>
                    <div className="mt-6 flex gap-2 text-[12px] tracking-[0.12em]">
                        <Link href="/sanatcilar" className="border border-[#bdbdbd] px-3 py-1 hover:border-[#9a9a9a]">
                            sanatçılar
                        </Link>
                        <Link href="/" className="border border-[#bdbdbd] px-3 py-1 hover:border-[#9a9a9a]">
                            koleksiyon
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
