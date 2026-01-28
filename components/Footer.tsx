import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-black pt-16 pb-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                    {/* 1. Marka & Slogan */}
                    <div>
                        <Link href="/" className="inline-flex items-center bg-[#e10600] text-white px-3 py-1 text-lg font-black uppercase tracking-tight italic">
                            serseri.art
                        </Link>
                        <p className="mt-4 text-gray-600 text-sm leading-relaxed max-w-xs uppercase tracking-widest">
                            Öğrencilerin bağımsız sanat platformu.
                            Diplomasız yeteneklerin, özgür ruhların ve
                            sanatın dijital sokağı.
                        </p>
                    </div>

                    {/* 2. Hızlı Linkler */}
                    <div>
                        <h3 className="text-black font-bold mb-4 uppercase tracking-widest">Keşfet</h3>
                        <ul className="space-y-2 text-sm text-gray-600 uppercase tracking-widest">
                            <li><Link href="/sanatcilar" className="hover:text-[#e10600] transition">Tüm Sanatçılar</Link></li>
                            <li><Link href="/biz-kimiz" className="hover:text-[#e10600] transition">Hikayemiz</Link></li>
                            <li><Link href="/giris" className="hover:text-[#e10600] transition">Giriş Yap / Üye Ol</Link></li>
                        </ul>
                    </div>

                    {/* 3. İletişim */}
                    <div>
                        <h3 className="text-black font-bold mb-4 uppercase tracking-widest">Bize Ulaşın</h3>
                        <div className="space-y-3 text-sm text-gray-600 uppercase tracking-widest">
                            <p className="flex items-start gap-2">
                                <span>📍</span>
                                <span>Muğla Sıtkı Koçman Üniversitesi<br/>Kötekli Kampüsü, 48000 Muğla</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <span>📧</span>
                                <a href="mailto:iletisim@serseri.art" className="hover:text-[#e10600] transition">iletisim@serseri.art</a>
                            </p>

                            {/* Sosyal Medya İkonları */}
                            <div className="flex gap-4 pt-4">
                                <a href="#" className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition">
                                    📸
                                </a>
                                <a href="#" className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition">
                                    🐦
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Alt Çizgi - Telif */}
                <div className="border-t border-black pt-8 text-center text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4 uppercase tracking-widest">
                    <p>&copy; {new Date().getFullYear()} serseri.art. Tüm hakları saklıdır.</p>
                    <div className="flex gap-4">
                        <span className="hover:text-black cursor-pointer">Gizlilik Politikası</span>
                        <span className="hover:text-black cursor-pointer">Kullanım Şartları</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
