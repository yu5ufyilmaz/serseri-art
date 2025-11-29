'use client'; // Durum (Açık/Kapalı) tutacağımız için bu gerekli

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false); // Menü açık mı kapalı mı?

    return (
        <nav className="w-full bg-black text-white border-b border-zinc-800 relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold tracking-tighter hover:text-gray-300 transition">
                            serseri.art
                        </Link>
                    </div>

                    {/* MASAÜSTÜ MENÜ (Telefonda Gizli) */}
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
                            <button className="bg-white text-black px-4 py-1 rounded text-sm font-bold hover:bg-gray-200 transition">
                                Giriş Yap
                            </button>
                        </div>
                    </div>

                    {/* MOBİL MENÜ BUTONU (Sadece Telefonda Görünür) */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
                        >
                            <span className="sr-only">Menüyü Aç</span>
                            {/* İkon: Menü Açıkken X, Kapalıyken 3 Çizgi */}
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

            {/* MOBİL MENÜ LİSTESİ (Açılınca Görünür) */}
            {isOpen && (
                <div className="md:hidden bg-zinc-900 border-b border-zinc-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
                        <Link
                            href="/"
                            className="hover:bg-zinc-800 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsOpen(false)} // Tıklayınca menüyü kapat
                        >
                            Ana Sayfa
                        </Link>
                        <Link
                            href="/sanatcilar"
                            className="hover:bg-zinc-800 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Sanatçılar
                        </Link>
                        <Link
                            href="/biz-kimiz"
                            className="hover:bg-zinc-800 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Biz Kimiz
                        </Link>
                        <button className="mt-4 w-full bg-white text-black px-4 py-2 rounded text-sm font-bold hover:bg-gray-200 transition">
                            Giriş Yap
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}