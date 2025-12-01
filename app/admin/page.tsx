import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Hoşgeldin Patron</h1>
            <p className="text-gray-400 mb-8">Buradan dükkanı yönetebilirsin.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Link href="/admin/sanatci-ekle" className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 hover:border-purple-500 transition group">
                    <div className="text-4xl mb-4">🎨</div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400">Yeni Sanatçı Ekle</h3>
                    <p className="text-gray-500">Sisteme yeni bir yetenek kaydet.</p>
                </Link>

                <Link href="/admin/eser-ekle" className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 hover:border-green-500 transition group">
                    <div className="text-4xl mb-4">🖼️</div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-green-400">Yeni Eser Yükle</h3>
                    <p className="text-gray-500">Satışa çıkacak yeni bir ürün ekle.</p>
                </Link>

            </div>
        </div>
    );
}