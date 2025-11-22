'use client'; // Bu satır çok önemli: Bu kod tarayıcıda çalışacak demektir.

import React, { useState } from 'react';

export default function BuyButton({ price, productName, id }: { price: number, productName: string, id: any }) {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        try {
            // 1. Backend'e (api/payment/route.ts) istek at
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ price, productName, id }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                // 2. Iyzico'dan gelen ödeme sayfasına (HTML içeriği) yönlendir veya içeriği bas
                // Basitlik için: Iyzico test sayfasının linkini açalım
                window.location.href = data.paymentPageUrl;
            } else {
                alert('Ödeme başlatılamadı: ' + data.errorMessage);
            }

        } catch (error) {
            console.error(error);
            alert('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="bg-white text-black px-4 py-2 rounded font-bold hover:bg-gray-200 transition disabled:opacity-50"
        >
            {loading ? 'İşleniyor...' : 'Satın Al'}
        </button>
    );
}