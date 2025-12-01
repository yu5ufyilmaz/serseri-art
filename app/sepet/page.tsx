'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function SepetPage() {
    const { cart, removeFromCart, totalPrice } = useCart();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Form Verileri
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        address: ''
    });

    // Kullanıcı varsa bilgilerini çek
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setFormData(prev => ({ ...prev, email: user.email || '' }));

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
            }
        };
        checkUser();
    }, []);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            // API'ye bu sefer "cartItems" dizisini gönderiyoruz
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cartItems: cart, // TÜM SEPET
                    buyer: formData  // ADRES BİLGİLERİ
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

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <div className="text-6xl mb-4">🛒</div>
                <h1 className="text-2xl font-bold mb-2">Sepetin Boş</h1>
                <p className="text-gray-400 mb-6">Henüz sanat eserlerini keşfetmedin mi?</p>
                <Link href="/sanatcilar" className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition">
                    Eserleri Keşfet
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Sepetim ({cart.length} Eser)</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* SOL TARAF: ÜRÜN LİSTESİ */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex gap-4 items-center">
                                {/* Küçük Resim */}
                                <div className="w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                                    {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />}
                                </div>

                                {/* Bilgiler */}
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{item.title}</h3>
                                    <p className="text-sm text-gray-400">{item.artist_name}</p>
                                    <p className="text-green-400 font-mono font-bold mt-1">{item.price} ₺</p>
                                </div>

                                {/* Sil Butonu */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-gray-500 hover:text-red-500 transition p-2"
                                    title="Sepetten Çıkar"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* SAĞ TARAF: ÖDEME FORMU */}
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl h-fit sticky top-24">
                        <h2 className="text-xl font-bold mb-6 border-b border-zinc-800 pb-4">Ödeme Bilgileri</h2>

                        <form onSubmit={handlePayment} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Ad Soyad</label>
                                <input required name="name" type="text" value={formData.name} onChange={handleChange}
                                       className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-white outline-none" placeholder="Adın Soyadın" />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Telefon</label>
                                <input required name="phone" type="tel" value={formData.phone} onChange={handleChange}
                                       className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-white outline-none" placeholder="555..." />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">E-Posta</label>
                                <input required name="email" type="email" value={formData.email} onChange={handleChange}
                                       className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-white outline-none" placeholder="mail@ornek.com" />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Açık Adres ve Şehir</label>
                                <textarea required name="address" rows={3} value={formData.address} onChange={handleChange}
                                          className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-white outline-none resize-none" placeholder="Tam adresin..." />
                            </div>

                            {/* Toplam Tutar ve Buton */}
                            <div className="border-t border-zinc-800 pt-4 mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-400">Toplam Tutar</span>
                                    <span className="text-2xl font-bold text-white">{totalPrice} ₺</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition disabled:opacity-50 text-lg"
                                >
                                    {loading ? 'İşleniyor...' : `Ödemeyi Tamamla`}
                                </button>

                                <div className="mt-3 flex justify-center gap-2 opacity-50">
                                    {/* Güvenlik İkonları (Görsel Amaçlı) */}
                                    <div className="h-6 w-10 bg-gray-700 rounded"></div>
                                    <div className="h-6 w-10 bg-gray-700 rounded"></div>
                                    <div className="h-6 w-10 bg-gray-700 rounded"></div>
                                </div>
                                <p className="text-xs text-center text-gray-600 mt-2">Iyzico korumalı alışveriş</p>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}