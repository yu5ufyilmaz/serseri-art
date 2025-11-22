export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
            <h1 className="text-6xl font-bold tracking-tighter">
                serseri.art
            </h1>
            <p className="mt-4 text-xl text-gray-400">
                öğrencilerin sanat alanı çok yakında.
            </p>
            <button className="mt-8 rounded bg-white px-6 py-3 text-black hover:bg-gray-200 transition">
                Keşfetmeye Başla
            </button>
        </div>
    );
}