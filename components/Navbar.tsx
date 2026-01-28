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
        <nav className="w-full bg-white text-black border-b border-black relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* LOGO */}
                    <div className="flex-shrink-0">
                        <Link
                            href="/"
                            className="inline-flex items-center bg-[#e10600] text-white px-3 py-1 text-lg font-black uppercase tracking-tight italic"
                        >
                            serseri.art
                        </Link>
                    </div>

                    {/* MASAÜSTÜ MENÜ */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/" className="hover:text-[#e10600] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition">
                                Ana Sayfa
                            </Link>
                            <Link href="/sanatcilar" className="hover:text-[#e10600] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition">
                                Sanatçılar
                            </Link>
                            <Link href="/biz-kimiz" className="hover:text-[#e10600] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition">
                                Biz Kimiz
                            </Link>

                            {/* KULLANICI ALANI */}
                            {user ? (
                                <div className="flex items-center gap-4 ml-4">

                                    {/* 1. SEPET İKONU */}
                                    <Link href="/sepet" className="relative p-2 text-black hover:text-[#e10600] transition group">
                                        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                        {cart.length > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                {cart.length}
                            </span>
                                        )}
                                    </Link>

                                    {/* 2. PROFİL MENÜSÜ */}
                                    <div className="relative" ref={profileMenuRef}>
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center gap-2 bg-white border border-black text-black px-4 py-2 hover:bg-black hover:text-white transition focus:outline-none uppercase text-xs tracking-widest"
                                        >
                                            <span className="text-xs font-bold">👤 {getUserName()}</span>
                                            <svg className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </button>

                                        {/* Açılır Kutu (Dropdown) */}
                                        {isProfileOpen && (
                                            <div className="absolute right-0 mt-2 w-52 bg-white border border-black shadow-xl py-1 z-50 overflow-hidden">
                                                <div className="px-4 py-2 border-b border-black text-xs uppercase tracking-widest text-gray-500">
                                                    Hesabım
                                                </div>

                                                {/* --- ADMIN LİNKİ (Sadece Patron Görür) --- */}
                                                {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                                                    <Link
                                                        href="/admin"
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="block px-4 py-3 text-xs text-purple-700 hover:bg-black hover:text-white transition font-bold uppercase tracking-widest border-b border-black"
                                                    >
                                                        👑 Yönetim Paneli
                                                    </Link>
                                                )}

                                                <Link href="/siparislerim" onClick={() => setIsProfileOpen(false)} className="block px-4 py-3 text-xs text-black hover:bg-black hover:text-white transition uppercase tracking-widest">
                                                    📦 Siparişlerim
                                                </Link>

                                                <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-xs text-[#e10600] hover:bg-black hover:text-white transition uppercase tracking-widest">
                                                    🚪 Çıkış Yap
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <Link href="/giris" className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#e10600] transition">
                                    Giriş Yap
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* MOBİL MENÜ BUTONU */}
                    <div className="-mr-2 flex md:hidden gap-4 items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 text-black hover:text-[#e10600] focus:outline-none"
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
                <div className="md:hidden bg-white border-b border-black">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
                        <Link href="/" onClick={() => setIsOpen(false)} className="hover:bg-black hover:text-white block px-3 py-2 text-sm font-semibold uppercase tracking-[0.2em]">Ana Sayfa</Link>
                        <Link href="/sanatcilar" onClick={() => setIsOpen(false)} className="hover:bg-black hover:text-white block px-3 py-2 text-sm font-semibold uppercase tracking-[0.2em]">Sanatçılar</Link>
                        <Link href="/biz-kimiz" onClick={() => setIsOpen(false)} className="hover:bg-black hover:text-white block px-3 py-2 text-sm font-semibold uppercase tracking-[0.2em]">Biz Kimiz</Link>

                        {user ? (
                            <div className="border-t border-black mt-4 pt-4 pb-2">
                                <div className="px-3 flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm">👤</div>
                                    <div>
                                        <div className="text-black font-bold text-sm">{getUserName()}</div>
                                        <div className="text-gray-500 text-xs">{user.email}</div>
                                    </div>
                                </div>

                                {/* Admin Mobilde Görünürlük */}
                                {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-2 text-sm font-semibold text-purple-700 hover:text-white hover:bg-black uppercase tracking-widest"
                                    >
                                        👑 Yönetim Paneli
                                    </Link>
                                )}

                                <Link href="/sepet" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm font-semibold text-black hover:text-white hover:bg-black flex items-center justify-between uppercase tracking-widest">
                                    <span>🛒 Sepetim</span>
                                    {cart.length > 0 && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">{cart.length}</span>}
                                </Link>

                                <Link href="/siparislerim" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm font-semibold text-black hover:text-white hover:bg-black uppercase tracking-widest">
                                    📦 Siparişlerim
                                </Link>

                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="mt-2 w-full text-left px-3 py-2 text-sm font-semibold text-[#e10600] hover:bg-black hover:text-white uppercase tracking-widest">
                                    🚪 Çıkış Yap
                                </button>
                            </div>
                        ) : (
                            <Link href="/giris" onClick={() => setIsOpen(false)} className="mt-4 w-full bg-black text-white px-4 py-3 font-bold uppercase tracking-widest hover:bg-[#e10600] transition text-center block">
                                Giriş Yap
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
