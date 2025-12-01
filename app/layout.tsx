import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Yazı tipi
import "./globals.css";
import Navbar from "@/components/Navbar"; // Az önce yaptığımız Navbar'ı çağırdık
import {CartProvider} from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "serseri.art",
    description: "Öğrencilerin bağımsız sanat platformu",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr">
        <body className={inter.className}>
        {/* Navbar'ı en tepeye koyduk */}
        <CartProvider> 
        <Navbar />

        {/* Burası değişen sahne (Sayfa İçeriği) */}
        <main className="min-h-screen bg-black text-white">
            {children}
        </main>
        </CartProvider>
        </body>
        </html>
    );
}