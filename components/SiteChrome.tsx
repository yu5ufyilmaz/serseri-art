'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SiteChrome({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isLandingPage = pathname === '/';

    return (
        <>
            {!isLandingPage && <Navbar />}

            <main className={`flex-grow ${isLandingPage ? 'bg-[#e6e6e6] text-black' : 'bg-[#e6e6e6] text-[#1e1e1e]'}`}>
                {children}
            </main>

            {!isLandingPage && <Footer />}
        </>
    );
}
