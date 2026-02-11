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
    const isActive = (path: string) =>
        pathname === path
            ? "bg-white text-[#1e1e1e] border border-[#cfcfcf]"
            : "text-[#6b6b6b] hover:text-[#1e1e1e] hover:bg-white/70";

    if (loading) return <div className="min-h-screen bg-[#e6e6e6] text-[#1e1e1e] flex items-center justify-center">Yetki Kontrolü...</div>;

    return (
        <div className="min-h-screen bg-[#e6e6e6] text-[#1e1e1e] flex">

            {/* --- SOL MENÜ (SIDEBAR) --- */}
            <aside className="w-64 border-r border-[#d2d2d2] bg-[#ededed] p-6 hidden md:flex flex-col h-screen sticky top-0">

                <div className="mb-8">
                    <span className="inline-flex items-center bg-[#ef3218] px-2 py-1 text-[20px] font-black italic leading-none text-white">
                        serseri
                    </span>
                    <p className="mt-2 text-[12px] uppercase tracking-[0.2em] text-[#6b6b6b]">yönetim</p>
                </div>

                <nav className="space-y-8 flex-1">

                    {/* GRUP 1: GENEL */}
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a8a8a] mb-3 px-2">Genel</p>
                        <Link href="/admin" className={`block px-3 py-2 rounded-sm transition mb-1 ${isActive('/admin')}`}>
                            Panel
                        </Link>
                        <Link href="/" className="block px-3 py-2 rounded-sm text-[#6b6b6b] hover:text-[#1e1e1e] hover:bg-white/70 transition">
                            Siteyi Görüntüle
                        </Link>
                    </div>

                    {/* GRUP 2: SANATÇILAR */}
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a8a8a] mb-3 px-2">Sanatçılar</p>
                        <Link href="/admin/sanatcilar" className={`block px-3 py-2 rounded-sm transition mb-1 ${isActive('/admin/sanatcilar')}`}>
                            Listele / Düzenle
                        </Link>
                        <Link href="/admin/sanatci-ekle" className={`block px-3 py-2 rounded-sm transition ${isActive('/admin/sanatci-ekle')}`}>
                            Yeni Ekle
                        </Link>
                    </div>

                    {/* GRUP 3: ESERLER */}
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a8a8a] mb-3 px-2">Eserler</p>
                        <Link href="/admin/eserler" className={`block px-3 py-2 rounded-sm transition mb-1 ${isActive('/admin/eserler')}`}>
                            Listele / Düzenle
                        </Link>
                        <Link href="/admin/eser-ekle" className={`block px-3 py-2 rounded-sm transition ${isActive('/admin/eser-ekle')}`}>
                            Yeni Ekle
                        </Link>
                    </div>

                </nav>

                {/* ALT KISIM */}
                <div className="pt-6 border-t border-[#d2d2d2]">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#8a8a8a]">Serseri Art Admin</p>
                </div>

            </aside>

            {/* --- İÇERİK ALANI --- */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto h-screen bg-[#e6e6e6]">
                {children}
            </main>

        </div>
    );
}
