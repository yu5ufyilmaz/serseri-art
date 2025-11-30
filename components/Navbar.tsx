'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

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

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        alert("Çıkış yapıldı!");
        setUser(null);
        router.push('/');
    };

    // KULLANICI İSMİNİ ALMA FONKSİYONU
    // Meta veride 'full_name' varsa onu al, yoksa email'in başını al (@'den öncesi)
    const getUserName = () => {
        if (!user) return '';
        return user.user_metadata?.full_name || user.email?.split('@')[0];
    };

    return (
        <nav className="w-full bg-black text-white border-b border-zinc-800 relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold tracking-tighter hover:text-gray-300 transition">
                            serseri.art
                        </Link>
                    </div>

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

                            {user ? (
                                <div className="flex items-center gap-4">
                                    {/* İSİM BURADA GÖRÜNECEK */}
                                    <span className="text-sm font-bold text-white bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
                        👤 {getUserName()}
                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-400 hover:text-white text-sm font-medium transition"
                                    >
                                        Çıkış
                                    </button>
                                </div>
                            ) : (
                                <Link href="/giris" className="bg-white text-black px-4 py-1 rounded text-sm font-bold hover:bg-gray-200 transition">
                                    Giriş Yap
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
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

            {isOpen && (
                <div className="md:hidden bg-zinc-900 border-b border-zinc-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
                        <Link href="/" onClick={() => setIsOpen(false)} className="hover:bg-zinc-800 block px-3 py-2 rounded-md text-base font-medium">Ana Sayfa</Link>
                        <Link href="/sanatcilar" onClick={() => setIsOpen(false)} className="hover:bg-zinc-800 block px-3 py-2 rounded-md text-base font-medium">Sanatçılar</Link>
                        <Link href="/biz-kimiz" onClick={() => setIsOpen(false)} className="hover:bg-zinc-800 block px-3 py-2 rounded-md text-base font-medium">Biz Kimiz</Link>

                        {user ? (
                            <>
                                <div className="px-3 py-2 text-white font-bold border-t border-zinc-800 mt-2">
                                    👤 {getUserName()}
                                </div>
                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="mt-2 w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-2 rounded text-sm font-bold">
                                    Çıkış Yap
                                </button>
                            </>
                        ) : (
                            <Link href="/giris" onClick={() => setIsOpen(false)} className="mt-4 w-full bg-white text-black px-4 py-2 rounded text-sm font-bold hover:bg-gray-200 transition text-center block">
                                Giriş Yap
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}