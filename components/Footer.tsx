import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-[#cfcfcf] bg-[#e6e6e6] py-6">
            <div className="mx-auto flex w-full max-w-[980px] flex-col items-center justify-between gap-4 px-4 text-[11px] tracking-[0.12em] text-[#2b2b2b] md:flex-row">
                <p>© {new Date().getFullYear()} serseri - 🇹🇷 Bodrum</p>

                <div className="flex items-center gap-4">
                    <Link href="/" className="hover:underline">ana sayfa</Link>
                    <Link href="/sanatcilar" className="hover:underline">sanatçılar</Link>
                    <Link href="/biz-kimiz" className="hover:underline">hakkımızda</Link>
                    <Link href="/giris" className="hover:underline">giriş</Link>
                </div>
            </div>
        </footer>
    );
}
