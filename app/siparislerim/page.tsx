'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SiparislerimPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            // 1. Önce giriş yapmış kullanıcıyı bul
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // Giriş yapmamışsa giriş sayfasına at
                router.push('/giris');
                return;
            }

            // 2. Bu kullanıcının emailine ait siparişleri çek
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('buyer_email', user.email) // Email eşleşmesi
                .order('created_at', { ascending: false }); // En yeniden eskiye

            if (error) console.error(error);
            else setOrders(data || []);

            setLoading(false);
        };

        fetchOrders();
    }, [router]);

    if (loading) return <div className="min-h-screen bg-black text-white p-10 text-center">Yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 border-b border-zinc-800 pb-4">Sipariş Geçmişim</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <p className="mb-4">Henüz hiç siparişin yok.</p>
                        <Link href="/sanatcilar" className="bg-white text-black px-4 py-2 rounded font-bold hover:bg-gray-200">
                            Alışverişe Başla
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-zinc-700 transition">

                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-lg text-white">{order.product_name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded font-bold ${
                                            order.status === 'SUCCESS' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                                        }`}>
                        {order.status === 'SUCCESS' ? 'Ödendi' : 'Beklemede'}
                    </span>
                                    </div>
                                    <p className="text-sm text-gray-400">Tarih: {new Date(order.created_at).toLocaleDateString('tr-TR')}</p>
                                    <p className="text-sm text-gray-500">Sipariş No: #{order.id}</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xl font-mono font-bold text-green-400">{order.amount} ₺</p>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}