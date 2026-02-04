'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useCart } from '@/context/CartContext';

type AuthUser = {
    email?: string;
    user_metadata?: {
        full_name?: string;
    };
};

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const router = useRouter();
    const { cart } = useCart();
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            if (event === 'SIGNED_OUT') {
                router.refresh();
            }
        });

        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            authListener.subscription.unsubscribe();
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsProfileOpen(false);
        setIsOpen(false);
        setUser(null);
        router.push('/');
        alert('Çıkış yapıldı!');
    };

    const getUserName = () => {
        if (!user) return '';
        return user.user_metadata?.full_name || user.email?.split('@')[0];
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-[#cfcfcf] bg-[#e6e6e6] text-[#202020]">
            <div className="mx-auto flex h-14 w-full max-w-[980px] items-center justify-between px-4">
                <Link href="/" className="bg-[#ef3218] px-2 py-0.5 text-lg font-black leading-none tracking-tight text-white italic">
                    serseri
                </Link>

                <div className="hidden items-center gap-6 text-[12px] tracking-[0.14em] md:flex">
                    <Link href="/" className="hover:underline">ana sayfa</Link>
                    <Link href="/sanatcilar" className="hover:underline">sanatçılar</Link>
                    <Link href="/biz-kimiz" className="hover:underline">hakkımızda</Link>
                    <span>🇹🇷 İstanbul</span>

                    {user ? (
                        <div className="ml-2 flex items-center gap-3">
                            <Link href="/sepet" className="relative rounded border border-[#cbcbcb] px-2 py-1 text-[11px] hover:border-[#9c9c9c]">
                                sepet
                                {cart.length > 0 && (
                                    <span className="ml-1 rounded bg-[#ef3218] px-1.5 py-0.5 text-[10px] font-bold text-white">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>

                            <div className="relative" ref={profileMenuRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="rounded border border-[#cbcbcb] px-2 py-1 text-[11px] hover:border-[#9c9c9c]"
                                >
                                    {getUserName()}
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-52 border border-[#cfcfcf] bg-[#efefef] p-1 shadow-sm">
                                        {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="block px-3 py-2 text-[11px] tracking-[0.12em] hover:bg-[#dcdcdc]"
                                            >
                                                yönetim paneli
                                            </Link>
                                        )}

                                        <Link
                                            href="/siparislerim"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="block px-3 py-2 text-[11px] tracking-[0.12em] hover:bg-[#dcdcdc]"
                                        >
                                            siparişlerim
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="block w-full px-3 py-2 text-left text-[11px] tracking-[0.12em] text-[#b4331e] hover:bg-[#dcdcdc]"
                                        >
                                            çıkış yap
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Link href="/giris" className="border border-[#cbcbcb] px-2 py-1 text-[11px] hover:border-[#9c9c9c]">
                            giriş
                        </Link>
                    )}
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded border border-[#cbcbcb] p-1.5 md:hidden"
                    aria-label="Menü"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div className="border-t border-[#cfcfcf] bg-[#ececec] px-4 py-3 md:hidden">
                    <div className="mx-auto flex max-w-[980px] flex-col gap-2 text-[12px] tracking-[0.12em]">
                        <Link href="/" onClick={() => setIsOpen(false)} className="hover:underline">ana sayfa</Link>
                        <Link href="/sanatcilar" onClick={() => setIsOpen(false)} className="hover:underline">sanatçılar</Link>
                        <Link href="/biz-kimiz" onClick={() => setIsOpen(false)} className="hover:underline">hakkımızda</Link>
                        <span>🇹🇷 İstanbul</span>

                        {user ? (
                            <>
                                {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                                    <Link href="/admin" onClick={() => setIsOpen(false)} className="hover:underline">
                                        yönetim paneli
                                    </Link>
                                )}
                                <Link href="/sepet" onClick={() => setIsOpen(false)} className="hover:underline">
                                    sepet ({cart.length})
                                </Link>
                                <Link href="/siparislerim" onClick={() => setIsOpen(false)} className="hover:underline">
                                    siparişlerim
                                </Link>
                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-left text-[#b4331e]">
                                    çıkış yap
                                </button>
                            </>
                        ) : (
                            <Link href="/giris" onClick={() => setIsOpen(false)} className="hover:underline">
                                giriş
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
