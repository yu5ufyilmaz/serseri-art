import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // YENİ: Footer'ı çağırdık
import { CartProvider } from "@/context/CartContext";

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
        <body className={`${inter.className} flex flex-col min-h-screen`}> {/* flex-col ve min-h-screen ekledik */}
        <CartProvider>
            <Navbar />

            {/* Ana içerik */}
            <main className="flex-grow bg-black text-white"> {/* flex-grow ekledik ki footer hep en alta itilsin */}
                {children}
            </main>

            {/* Footer her sayfanın en altında olacak */}
            <Footer />
        </CartProvider>
        </body>
        </html>
    );
}