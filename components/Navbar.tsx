import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="w-full bg-black text-white border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo Kısmı */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold tracking-tighter hover:text-gray-300 transition">
                            serseri.art
                        </Link>
                    </div>

                    {/* Menü Linkleri */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition">
                                Ana Sayfa
                            </Link>
                            <Link href="/sanatcilar" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition">
                                Sanatçılar
                            </Link>
                            <Link href="/biz-kimiz" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition">
                                Biz Kimiz
                            </Link>
                        </div>
                    </div>

                    {/* Sağ Taraf (Sepet veya Giriş butonu gelebilir) */}
                    <div>
                        <button className="bg-white text-black px-4 py-1 rounded text-sm font-bold hover:bg-gray-200 transition">
                            Giriş Yap
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
}