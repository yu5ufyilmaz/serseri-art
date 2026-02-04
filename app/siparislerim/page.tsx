'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type Order = {
    id: number;
    product_name: string;
    status: 'SUCCESS' | string;
    created_at: string;
    amount: number;
};

export default function SiparislerimPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/giris');
                return;
            }

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('buyer_email', user.email)
                .order('created_at', { ascending: false });

            if (error) console.error(error);
            else setOrders((data as Order[]) || []);

            setLoading(false);
        };

        fetchOrders();
    }, [router]);

    if (loading) {
        return <div className="mx-auto max-w-[980px] px-4 py-10">Yükleniyor...</div>;
    }

    return (
        <div className="mx-auto w-full max-w-[980px] px-4 py-10">
            <h1 className="mb-6 border-b border-[#cfcfcf] pb-3 text-3xl font-black tracking-tight">Siparişlerim</h1>

            {orders.length === 0 ? (
                <div className="border border-dashed border-[#bdbdbd] bg-[#efefef] p-10 text-center">
                    <p className="text-sm text-[#666]">Henüz siparişin yok.</p>
                    <Link href="/sanatcilar" className="mt-4 inline-block border border-[#bdbdbd] px-4 py-2 text-[12px] tracking-[0.12em] hover:border-[#999]">
                        alışverişe başla
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => (
                        <div key={order.id} className="flex flex-col justify-between gap-3 border border-[#cfcfcf] bg-[#efefef] p-4 md:flex-row md:items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold">{order.product_name}</h3>
                                    <span className={`px-2 py-0.5 text-[10px] tracking-[0.12em] ${
                                        order.status === 'SUCCESS'
                                            ? 'bg-[#d9eed6] text-[#2f7030]'
                                            : 'bg-[#f1e7c6] text-[#7a5e1a]'
                                    }`}>
                                        {order.status === 'SUCCESS' ? 'ÖDENDİ' : 'BEKLİYOR'}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-[#666]">
                                    {new Date(order.created_at).toLocaleDateString('tr-TR')} / #{order.id}
                                </p>
                            </div>

                            <p className="text-xl font-bold">{order.amount} ₺</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
