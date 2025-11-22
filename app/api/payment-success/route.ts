import { NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';
import { supabase } from '@/lib/supabaseClient'; // Supabase kütüphanesini çağırdık

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const token = formData.get('token');

        if (!token) {
            return NextResponse.redirect('http://localhost:3000/?error=no_token', 303);
        }

        // 1. Iyzico'ya Sorgu At
        const iyzipay = new Iyzipay({
            apiKey: process.env.IYZICO_API_KEY!,
            secretKey: process.env.IYZICO_SECRET_KEY!,
            uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
        });

        const result: any = await new Promise((resolve) => {
            iyzipay.checkoutForm.retrieve({
                locale: Iyzipay.LOCALE.TR,
                conversationId: '123456789',
                token: String(token)
            }, (err: any, result: any) => {
                if (err) resolve({ status: 'failure', errorMessage: err });
                else resolve(result);
            });
        });

        // 2. Sonucu Kontrol Et ve KAYDET
        if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {

            console.log("✅ Ödeme Başarılı! Veritabanına kaydediliyor...");

            // --- SUPABASE KAYIT KISMI ---
            const { error: dbError } = await supabase
                .from('orders') // 'orders' tablosuna git
                .insert({       // Şunları ekle:
                    payment_id: result.paymentId,
                    amount: result.price,
                    status: 'SUCCESS',
                    buyer_ip: '85.34.78.112' // Iyzico'dan gelen IP veya statik
                });

            if (dbError) {
                console.error("⚠️ Ödeme alındı ama veritabanına yazılamadı:", dbError);
                // Para alındığı için yine de başarılı sayfasına gönderiyoruz, ama loglara bakmalısın.
            } else {
                console.log("💾 Sipariş başarıyla kaydedildi.");
            }
            // -----------------------------

            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/odeme-basarili`, 303);

        } else {
            console.error("❌ Ödeme Başarısız:", result.errorMessage);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/?error=payment_failed`, 303);
        }

    } catch (error) {
        console.error("💥 Sunucu Hatası:", error);
        return NextResponse.redirect('http://localhost:3000/?error=server_crash', 303);
    }
}