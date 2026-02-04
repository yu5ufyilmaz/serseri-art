import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import SiteChrome from "@/components/SiteChrome";

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
        <body className={`${inter.className} flex flex-col min-h-screen`}>
            <CartProvider>
                <SiteChrome>
                    {children}
                </SiteChrome>
            </CartProvider>
        </body>
        </html>
    );
}
