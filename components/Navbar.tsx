'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false); // Mobil menü durumu
    const [isProfileOpen, setIsProfileOpen] = useState(false); // Profil menüsü durumu
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const { cart } = useCart();

    // Profil menüsü dışına tıklanınca kapanması için referans
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

        // Dışarı tıklamayı dinle
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
        alert("Çıkış yapıldı!");
    };

    const getUserName = () => {
        if (!user) return '';
        return user.user_metadata?.full_name || user.email?.split('@')[0];
    };

    return (
        <nav className="w-full bg-black text-white border-b border-zinc-800 relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* LOGO */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold tracking-tighter hover:text-gray-300 transition">
                            serseri.art
                        </Link>
                    </div>

                    {/* MASAÜSTÜ MENÜ */}
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

                            {/* KULLANICI ALANI */}
                            {user ? (
                                <div className="flex items-center gap-4 ml-4">

                                    {/* 1. SEPET İKONU */}
                                    <Link href="/sepet" className="relative p-2 text-gray-400 hover:text-white transition group">
                                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                        {cart.length > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                {cart.length}
                            </span>
                                        )}
                                    </Link>

                                    {/* 2. PROFİL MENÜSÜ */}
                                    <div className="relative" ref={profileMenuRef}>
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition focus:outline-none"
                                        >
                                            <span className="text-sm font-bold">👤 {getUserName()}</span>
                                            <svg className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </button>

                                        {/* Açılır Kutu (Dropdown) */}
                                        {isProfileOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl py-1 z-50 overflow-hidden">
                                                <div className="px-4 py-2 border-b border-zinc-800 text-xs text-gray-500">
                                                    Hesabım
                                                </div>

                                                {/* --- ADMIN LİNKİ (Sadece Patron Görür) --- */}
                                                {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                                                    <Link
                                                        href="/admin"
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="block px-4 py-3 text-sm text-purple-400 hover:bg-zinc-800 hover:text-purple-300 transition font-bold border-b border-zinc-800"
                                                    >
                                                        👑 Yönetim Paneli
                                                    </Link>
                                                )}

                                                <Link href="/siparislerim" onClick={() => setIsProfileOpen(false)} className="block px-4 py-3 text-sm text-gray-200 hover:bg-zinc-800 hover:text-white transition">
                                                    📦 Siparişlerim
                                                </Link>

                                                <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 transition">
                                                    🚪 Çıkış Yap
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <Link href="/giris" className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition">
                                    Giriş Yap
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* MOBİL MENÜ BUTONU */}
                    <div className="-mr-2 flex md:hidden gap-4 items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
                        >
                            <span className="sr-only">Menüyü Aç</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBİL MENÜ LİSTESİ */}
            {isOpen && (
                <div className="md:hidden bg-zinc-900 border-b border-zinc-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
                        <Link href="/" onClick={() => setIsOpen(false)} className="hover:bg-zinc-800 block px-3 py-2 rounded-md text-base font-medium">Ana Sayfa</Link>
                        <Link href="/sanatcilar" onClick={() => setIsOpen(false)} className="hover:bg-zinc-800 block px-3 py-2 rounded-md text-base font-medium">Sanatçılar</Link>
                        <Link href="/biz-kimiz" onClick={() => setIsOpen(false)} className="hover:bg-zinc-800 block px-3 py-2 rounded-md text-base font-medium">Biz Kimiz</Link>

                        {user ? (
                            <div className="border-t border-zinc-800 mt-4 pt-4 pb-2">
                                <div className="px-3 flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-sm">👤</div>
                                    <div>
                                        <div className="text-white font-bold text-sm">{getUserName()}</div>
                                        <div className="text-zinc-500 text-xs">{user.email}</div>
                                    </div>
                                </div>

                                {/* Admin Mobilde Görünürlük */}
                                {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-purple-400 hover:text-purple-300 hover:bg-zinc-800"
                                    >
                                        👑 Yönetim Paneli
                                    </Link>
                                )}

                                <Link href="/sepet" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-zinc-800 flex items-center justify-between">
                                    <span>🛒 Sepetim</span>
                                    {cart.length > 0 && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">{cart.length}</span>}
                                </Link>

                                <Link href="/siparislerim" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-zinc-800">
                                    📦 Siparişlerim
                                </Link>

                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="mt-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-zinc-800 hover:text-red-300">
                                    🚪 Çıkış Yap
                                </button>
                            </div>
                        ) : (
                            <Link href="/giris" onClick={() => setIsOpen(false)} className="mt-4 w-full bg-white text-black px-4 py-3 rounded font-bold hover:bg-gray-200 transition text-center block">
                                Giriş Yap
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}