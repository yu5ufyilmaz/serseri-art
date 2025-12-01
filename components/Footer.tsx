import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-zinc-900 border-t border-zinc-800 pt-16 pb-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                    {/* 1. Marka & Slogan */}
                    <div>
                        <Link href="/" className="text-2xl font-bold tracking-tighter text-white hover:text-gray-300 transition">
                            serseri.art
                        </Link>
                        <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-xs">
                            Öğrencilerin bağımsız sanat platformu.
                            Diplomasız yeteneklerin, özgür ruhların ve
                            sanatın dijital sokağı.
                        </p>
                    </div>

                    {/* 2. Hızlı Linkler */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Keşfet</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/sanatcilar" className="hover:text-white transition">Tüm Sanatçılar</Link></li>
                            <li><Link href="/biz-kimiz" className="hover:text-white transition">Hikayemiz</Link></li>
                            <li><Link href="/giris" className="hover:text-white transition">Giriş Yap / Üye Ol</Link></li>
                        </ul>
                    </div>

                    {/* 3. İletişim */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Bize Ulaşın</h3>
                        <div className="space-y-3 text-sm text-gray-400">
                            <p className="flex items-start gap-2">
                                <span>📍</span>
                                <span>Muğla Sıtkı Koçman Üniversitesi<br/>Kötekli Kampüsü, 48000 Muğla</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <span>📧</span>
                                <a href="mailto:iletisim@serseri.art" className="hover:text-white transition">iletisim@serseri.art</a>
                            </p>

                            {/* Sosyal Medya İkonları */}
                            <div className="flex gap-4 pt-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition">
                                    📸
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition">
                                    🐦
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Alt Çizgi - Telif */}
                <div className="border-t border-zinc-800 pt-8 text-center text-xs text-zinc-600 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>&copy; {new Date().getFullYear()} serseri.art. Tüm hakları saklıdır.</p>
                    <div className="flex gap-4">
                        <span className="hover:text-zinc-400 cursor-pointer">Gizlilik Politikası</span>
                        <span className="hover:text-zinc-400 cursor-pointer">Kullanım Şartları</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}