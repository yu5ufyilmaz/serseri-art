'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation'; // usePathname ekledik
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname(); // Şu an hangi sayfadayız?

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
                alert("Bu alana girmeye yetkiniz yok!");
                router.push('/');
            } else {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [router]);

    // Linkin aktif olup olmadığını kontrol eden küçük bir fonksiyon
    const isActive = (path: string) => pathname === path ? "bg-zinc-800 text-white" : "text-gray-400 hover:text-white hover:bg-zinc-900";

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Yetki Kontrolü...</div>;

    return (
        <div className="min-h-screen bg-black text-white flex">

            {/* --- SOL MENÜ (SIDEBAR) --- */}
            <aside className="w-64 border-r border-zinc-800 p-6 hidden md:flex flex-col h-screen sticky top-0">

                <div className="mb-8 flex items-center gap-2 text-purple-500">
                    <span className="text-2xl">👑</span>
                    <h2 className="text-xl font-bold">Yönetim</h2>
                </div>

                <nav className="space-y-8 flex-1">

                    {/* GRUP 1: GENEL */}
                    <div>
                        <p className="text-xs text-zinc-600 uppercase font-bold mb-3 px-2">Genel</p>
                        <Link href="/admin" className={`block p-2 rounded transition mb-1 ${isActive('/admin')}`}>
                            📊 Panelo
                        </Link>
                        <Link href="/" className="block p-2 rounded text-gray-400 hover:text-white hover:bg-zinc-900 transition">
                            🏠 Siteyi Görüntüle
                        </Link>
                    </div>

                    {/* GRUP 2: SANATÇILAR */}
                    <div>
                        <p className="text-xs text-zinc-600 uppercase font-bold mb-3 px-2">Sanatçılar</p>
                        <Link href="/admin/sanatcilar" className={`block p-2 rounded transition mb-1 flex items-center gap-2 ${isActive('/admin/sanatcilar')}`}>
                            👥 Listele / Düzenle
                        </Link>
                        <Link href="/admin/sanatci-ekle" className={`block p-2 rounded transition flex items-center gap-2 ${isActive('/admin/sanatci-ekle')}`}>
                            ➕ Yeni Ekle
                        </Link>
                    </div>

                    {/* GRUP 3: ESERLER */}
                    <div>
                        <p className="text-xs text-zinc-600 uppercase font-bold mb-3 px-2">Eserler</p>
                        <Link href="/admin/eserler" className={`block p-2 rounded transition mb-1 flex items-center gap-2 ${isActive('/admin/eserler')}`}>
                            📦 Listele / Düzenle
                        </Link>
                        <Link href="/admin/eser-ekle" className={`block p-2 rounded transition flex items-center gap-2 ${isActive('/admin/eser-ekle')}`}>
                            ➕ Yeni Ekle
                        </Link>
                    </div>

                </nav>

                {/* ALT KISIM */}
                <div className="pt-6 border-t border-zinc-800">
                    <p className="text-xs text-zinc-600">Serseri Art Admin v1.0</p>
                </div>

            </aside>

            {/* --- İÇERİK ALANI --- */}
            <main className="flex-1 p-8 overflow-y-auto h-screen bg-black">
                {children}
            </main>

        </div>
    );
}