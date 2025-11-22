import Link from 'next/link';

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">

            {/* Yeşil Onay Kutusu */}
            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 text-center max-w-md w-full shadow-2xl shadow-green-900/20">

                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                    <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>

                <h1 className="text-3xl font-bold mb-2">Ödeme Başarılı!</h1>
                <p className="text-gray-400 mb-8">
                    Siparişin alındı. Sanata verdiğin destek için teşekkürler serseri.
                </p>

                <div className="space-y-3">
                    <Link
                        href="/sanatcilar"
                        className="block w-full bg-white text-black font-bold py-3 rounded hover:bg-gray-200 transition"
                    >
                        Alışverişe Devam Et
                    </Link>

                    <Link
                        href="/"
                        className="block w-full bg-transparent border border-zinc-700 text-gray-300 font-bold py-3 rounded hover:bg-zinc-800 transition"
                    >
                        Ana Sayfaya Dön
                    </Link>
                </div>

            </div>

        </div>
    );
}