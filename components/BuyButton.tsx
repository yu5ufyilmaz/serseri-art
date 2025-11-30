'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabaseClient'; // Supabase eklendi

export default function BuyButton({ price, productName, id }: { price: number, productName: string, id: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Kullanıcı bilgileri
    const [user, setUser] = useState<any>(null);
    const [saveInfo, setSaveInfo] = useState(false); // "Bilgileri Kaydet" kutucuğu

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        address: ''
    });

    useEffect(() => {
        setMounted(true);

        // Form açıldığında kullanıcı giriş yapmış mı bak, yapmışsa bilgilerini çek
        const checkUserAndFetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUser(user);
                // Email'i otomatik doldur
                setFormData(prev => ({ ...prev, email: user.email || '' }));

                // Profil tablosundan kayıtlı adresi çek
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

        checkUserAndFetchProfile();
    }, []);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Eğer "Bilgilerimi Kaydet" seçiliyse Profili Güncelle
            if (user && saveInfo) {
                const { error } = await supabase
                    .from('profiles')
                    .upsert({ // Upsert: Varsa güncelle, yoksa ekle demektir
                        id: user.id,
                        full_name: formData.name,
                        phone: formData.phone,
                        city: formData.city,
                        address: formData.address,
                        updated_at: new Date()
                    });

                if (error) console.error("Profil kaydedilemedi:", error);
            }

            // 2. Ödeme İşlemini Başlat
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    price,
                    productName,
                    id,
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

    const modalContent = isOpen ? (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
            <div className="bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-700 relative flex flex-col max-h-[90vh]">

                <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-xl md:text-2xl font-bold text-white">Teslimat Bilgileri</h2>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-2">✕</button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handlePayment} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Ad Soyad</label>
                            <input required name="name" type="text" value={formData.name} onChange={handleChange}
                                   className="w-full bg-zinc-800 border border-zinc-700 rounded p-3 text-white focus:border-white outline-none transition" placeholder="Örn: Taha Çavani" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Telefon</label>
                                <input required name="phone" type="tel" value={formData.phone} onChange={handleChange}
                                       className="w-full bg-zinc-800 border border-zinc-700 rounded p-3 text-white focus:border-white outline-none transition" placeholder="555..." />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Şehir</label>
                                <input required name="city" type="text" value={formData.city} onChange={handleChange}
                                       className="w-full bg-zinc-800 border border-zinc-700 rounded p-3 text-white focus:border-white outline-none transition" placeholder="İstanbul" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">E-Posta</label>
                            <input required name="email" type="email" value={formData.email} onChange={handleChange}
                                   className="w-full bg-zinc-800 border border-zinc-700 rounded p-3 text-white focus:border-white outline-none transition" placeholder="ornek@mail.com" />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Açık Adres</label>
                            <textarea required name="address" rows={3} value={formData.address} onChange={handleChange}
                                      className="w-full bg-zinc-800 border border-zinc-700 rounded p-3 text-white focus:border-white outline-none transition resize-none" placeholder="Mahalle, Sokak, No..." />
                        </div>

                        {/* SADECE ÜYELERE GÖRÜNEN KAYDETME KUTUCUĞU */}
                        {user && (
                            <div className="flex items-center gap-3 bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                                <input
                                    type="checkbox"
                                    id="saveInfo"
                                    checked={saveInfo}
                                    onChange={(e) => setSaveInfo(e.target.checked)}
                                    className="w-5 h-5 accent-green-500 cursor-pointer"
                                />
                                <label htmlFor="saveInfo" className="text-sm text-gray-300 cursor-pointer select-none">
                                    Bu bilgileri sonraki siparişlerim için kaydet
                                </label>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-500 transition disabled:opacity-50 mt-2 text-lg"
                        >
                            {loading ? 'Yükleniyor...' : `Ödemeye Geç (${price} ₺)`}
                        </button>

                        <p className="text-xs text-center text-gray-500 mt-2">
                            🔒 Ödeme Iyzico güvenli altyapısıyla alınacaktır.
                        </p>

                    </form>
                </div>
            </div>
        </div>
    ) : null;

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 transition w-full md:w-auto">
                Satın Al
            </button>
            {mounted && isOpen ? createPortal(modalContent, document.body) : null}
        </>
    );
}