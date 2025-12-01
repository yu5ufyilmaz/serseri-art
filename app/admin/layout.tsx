'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            // Güvenlik Kontrolü: Giriş yapmış mı VE E-postası Admin mi?
            if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
                alert("Bu alana girmeye yetkiniz yok!");
                router.push('/'); // Ana sayfaya şutla
            } else {
                setLoading(false); // Hoşgeldin patron
            }
        };

        checkAdmin();
    }, [router]);

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Yetki Kontrolü...</div>;

    return (
        <div className="min-h-screen bg-black text-white flex">

            {/* --- SOL MENÜ (SIDEBAR) --- */}
            <aside className="w-64 border-r border-zinc-800 p-6 hidden md:block">
                <h2 className="text-2xl font-bold mb-8 text-purple-500">Yönetim Paneli</h2>
                <nav className="space-y-4">
                    <Link href="/admin" className="block text-gray-300 hover:text-white hover:bg-zinc-900 p-2 rounded transition">
                        📊 Genel Bakış
                    </Link>
                    <Link href="/admin/sanatci-ekle" className="block text-gray-300 hover:text-white hover:bg-zinc-900 p-2 rounded transition">
                        🎨 Sanatçı Ekle
                    </Link>
                    <Link href="/admin/eser-ekle" className="block text-gray-300 hover:text-white hover:bg-zinc-900 p-2 rounded transition">
                        🖼️ Eser Ekle
                    </Link>
                    <Link href="/" className="block text-gray-500 hover:text-white mt-8 p-2 text-sm">
                        ← Siteye Dön
                    </Link>
                </nav>
            </aside>

            {/* --- İÇERİK ALANI --- */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>

        </div>
    );
}