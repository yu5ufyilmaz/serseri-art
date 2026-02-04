'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabaseClient';

type CartItem = {
    id: string | number;
    title: string;
    price: number;
    image_url?: string;
    artist_name?: string;
};

type CheckoutForm = {
    name: string;
    email: string;
    phone: string;
    city: string;
    address: string;
};

export default function SepetPage() {
    const { cart, removeFromCart, totalPrice } = useCart();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CheckoutForm>({
        name: '',
        email: '',
        phone: '',
        city: '',
        address: ''
    });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setFormData((prev) => ({ ...prev, email: user.email || '' }));

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profile) {
                setFormData({
                    name: profile.full_name || '',
                    email: user.email || '',
                    phone: profile.phone || '',
                    city: profile.city || '',
                    address: profile.address || ''
                });
            }
        };
        checkUser();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cartItems: cart,
                    buyer: formData
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                window.location.href = data.paymentPageUrl;
            } else {
                alert('Hata: ' + data.errorMessage);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert('Bir hata oluştu');
            setLoading(false);
        }
    };

    const safeCart = cart as CartItem[];

    if (safeCart.length === 0) {
        return (
            <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-[980px] flex-col items-center justify-center px-4 py-12 text-center">
                <p className="text-[12px] tracking-[0.14em] text-[#666]">SEPET</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight">Sepetin boş</h1>
                <Link href="/sanatcilar" className="mt-5 border border-[#bdbdbd] px-4 py-2 text-[12px] tracking-[0.12em] hover:border-[#999]">
                    eserleri keşfet
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-[980px] px-4 py-10">
            <h1 className="mb-6 border-b border-[#cfcfcf] pb-3 text-3xl font-black tracking-tight">
                Sepet ({safeCart.length})
            </h1>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-3">
                    {safeCart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 border border-[#cfcfcf] bg-[#efefef] p-3">
                            <div className="h-20 w-20 overflow-hidden border border-[#d8d8d8] bg-[#d2d2d2]">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-[10px] text-[#666]">GÖRSEL YOK</div>
                                )}
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold">{item.title}</h3>
                                <p className="text-sm text-[#666]">{item.artist_name}</p>
                                <p className="mt-1 text-lg font-bold">{item.price} ₺</p>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="border border-[#c7c7c7] px-2 py-1 text-xs tracking-[0.12em] hover:border-[#9d9d9d]"
                            >
                                çıkar
                            </button>
                        </div>
                    ))}
                </div>

                <div className="h-fit border border-[#cfcfcf] bg-[#efefef] p-4 lg:sticky lg:top-20">
                    <h2 className="mb-4 text-lg font-black tracking-tight">Ödeme</h2>

                    <form onSubmit={handlePayment} className="space-y-3">
                        <input
                            required
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-[#cbcbcb] bg-white p-2.5 text-sm outline-none focus:border-[#9e9e9e]"
                            placeholder="ad soyad"
                        />
                        <input
                            required
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border border-[#cbcbcb] bg-white p-2.5 text-sm outline-none focus:border-[#9e9e9e]"
                            placeholder="telefon"
                        />
                        <input
                            required
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-[#cbcbcb] bg-white p-2.5 text-sm outline-none focus:border-[#9e9e9e]"
                            placeholder="e-posta"
                        />
                        <textarea
                            required
                            name="address"
                            rows={3}
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full resize-none border border-[#cbcbcb] bg-white p-2.5 text-sm outline-none focus:border-[#9e9e9e]"
                            placeholder="adres"
                        />

                        <div className="mt-4 border-t border-[#d3d3d3] pt-3">
                            <div className="mb-3 flex items-center justify-between text-sm">
                                <span className="text-[#666]">Toplam</span>
                                <span className="text-2xl font-bold">{totalPrice} ₺</span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#ef3218] py-2.5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-50"
                            >
                                {loading ? 'işleniyor...' : 'ödemeyi tamamla'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
