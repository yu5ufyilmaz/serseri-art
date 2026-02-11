'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type AuthUser = {
    email?: string;
    user_metadata?: {
        full_name?: string;
    };
};

export default function HomeQuickActions() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };
        init();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
            setMenuOpen(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setMenuOpen(false);
        router.refresh();
    };

    if (loading) {
        return <div className="mb-6 h-[28px]" />;
    }

    if (user) {
        const displayName =
            user.user_metadata?.full_name?.trim() ||
            user.email?.split('@')[0] ||
            'profil';
        const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

        return (
            <div className="mb-6 flex flex-wrap items-center justify-end gap-2 text-[11px] tracking-[0.12em]">
                <Link href="/sepet" className="border border-[#bdbdbd] px-2.5 py-1 hover:border-[#999]">
                    sepet
                </Link>
                <Link href="/siparislerim" className="border border-[#bdbdbd] px-2.5 py-1 hover:border-[#999]">
                    siparişlerim
                </Link>
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="border border-[#bdbdbd] px-2.5 py-1 hover:border-[#999] uppercase tracking-[0.14em]"
                    >
                        {displayName}
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 z-20 mt-2 min-w-[160px] border border-[#cfcfcf] bg-white text-[11px] uppercase tracking-[0.16em] text-[#1e1e1e] shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-3 py-2 hover:bg-[#f3f3f3]"
                                >
                                    yönetim paneli
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="block w-full px-3 py-2 text-left hover:bg-[#f3f3f3]"
                            >
                                çıkış
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6 flex flex-wrap items-center justify-end gap-2 text-[11px] tracking-[0.12em]">
            <Link href="/giris" className="border border-[#bdbdbd] px-2.5 py-1 hover:border-[#999]">
                giriş
            </Link>
            <Link href="/kayit" className="border border-[#bdbdbd] px-2.5 py-1 hover:border-[#999]">
                kayıt
            </Link>
            <Link href="/sepet" className="border border-[#bdbdbd] px-2.5 py-1 hover:border-[#999]">
                sepet
            </Link>
        </div>
    );
}
