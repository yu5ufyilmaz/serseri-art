import React from 'react';
import Link from 'next/link';

export default function BizKimizPage() {
    return (
        <div className="min-h-screen bg-black text-white">

            {/* --- HERO BÖLÜMÜ (Başlık) --- */}
            <div className="relative py-20 px-4 text-center border-b border-zinc-800">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-white via-gray-400 to-gray-600 bg-clip-text text-transparent">
                    Sanatın Diploması Olmaz.
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Biz, galerilerin beyaz duvarlarına sığmayanlarız.
                </p>
            </div>

            {/* --- HİKAYE BÖLÜMÜ --- */}
            <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">

                {/* Sol Taraf: Yazı */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-white">Neden "Serseri"?</h2>
                    <p className="text-gray-300 leading-relaxed">
                        Çünkü sanatın kuralları, kalıpları ve "piyasası" olduğuna inanmıyoruz.
                        Öğrencilerin yeteneklerini sergilemek için mezun olmayı veya bir galeri sahibini
                        ikna etmeyi beklemesine karşıyız.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        Serseri.art, henüz keşfedilmemiş yeteneklerin, hamarat ellerin ve
                        özgür ruhların dijital sokağıdır. Burada komisyoncular yok, sadece
                        sanatçı ve sanatsever var.
                    </p>

                    <div className="pt-4">
                        <h3 className="text-xl font-bold text-white mb-2">Misyonumuz</h3>
                        <ul className="list-disc list-inside text-gray-400 space-y-2">
                            <li>Öğrencilere ekonomik özgürlük sağlamak.</li>
                            <li>Ulaşılabilir sanat eserleri sunmak.</li>
                            <li>Sanatı "elit" bir hobi olmaktan çıkarmak.</li>
                        </ul>
                    </div>
                </div>

                {/* Sağ Taraf: Görsel (Temsili) */}
                <div className="relative h-[400px] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group">
                    {/* Buraya kendi ekibinle bir fotoğrafını koyabilirsin */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop"
                        alt="Sanat Atölyesi"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-60"
                    />
                    <div className="absolute bottom-6 left-6 z-20">
                        <p className="text-white font-mono text-sm">📍 Kampüs Atölyeleri, 2024</p>
                    </div>
                </div>

            </div>

            {/* --- İLETİŞİM / ÇAĞRI --- */}
            <div className="bg-zinc-900 py-20 text-center px-4">
                <h2 className="text-3xl font-bold mb-6">Sen de Aramıza Katıl</h2>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                    Eğer sen de işlerini sergilemek isteyen bir öğrenciysen veya projeye destek olmak istiyorsan, kapımız her zaman açık.
                </p>

                <div className="flex flex-col md:flex-row justify-center gap-4">
                    <a
                        href="mailto:iletisim@serseri.art"
                        className="bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition"
                    >
                        Bize Yaz
                    </a>
                    <Link
                        href="/sanatcilar"
                        className="border border-zinc-600 text-white px-8 py-3 rounded font-bold hover:bg-zinc-800 transition"
                    >
                        Sanatçıları Keşfet
                    </Link>
                </div>
            </div>

        </div>
    );
}