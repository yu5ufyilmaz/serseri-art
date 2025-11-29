export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-center px-4">
                serseri.art
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-400 text-center px-4">
                öğrencilerin sanat alanı çok yakında.
            </p>
            <button className="mt-8 rounded bg-white px-6 py-3 text-black hover:bg-gray-200 transition">
                Keşfetmeye Başla
            </button>
        </div>
    );
}