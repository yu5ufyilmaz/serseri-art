import Link from 'next/link';

export default function PaymentSuccessPage() {
    return (
        <div className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-[980px] items-center justify-center px-4 py-10">
            <div className="w-full max-w-md border border-[#cfcfcf] bg-[#efefef] p-8 text-center">
                <p className="text-[12px] tracking-[0.14em] text-[#5d5d5d]">ÖDEME</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight">Ödeme Başarılı</h1>
                <p className="mt-3 text-sm text-[#5a5a5a]">
                    Siparişin alındı. Koleksiyonu desteklediğin için teşekkürler.
                </p>

                <div className="mt-6 space-y-2">
                    <Link
                        href="/sanatcilar"
                        className="block border border-[#bdbdbd] bg-white py-2 text-[12px] tracking-[0.12em] hover:border-[#989898]"
                    >
                        sanatçılar
                    </Link>
                    <Link
                        href="/"
                        className="block border border-[#bdbdbd] py-2 text-[12px] tracking-[0.12em] hover:border-[#989898]"
                    >
                        koleksiyon
                    </Link>
                </div>
            </div>
        </div>
    );
}
