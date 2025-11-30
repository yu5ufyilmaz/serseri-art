import { NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const token = formData.get('token');

        if (!token) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/?error=no_token`, 303);

        // 1. Service Key Kontrolü (Log)
        const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
        console.log("🔐 Service Key Yüklü mü?:", hasServiceKey ? "EVET" : "HAYIR ❌ (Sorun burada olabilir)");

        const iyzipay = new Iyzipay({
            apiKey: process.env.IYZICO_API_KEY!,
            secretKey: process.env.IYZICO_SECRET_KEY!,
            uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
        });

        const result: any = await new Promise((resolve) => {
            iyzipay.checkoutForm.retrieve({
                locale: Iyzipay.LOCALE.TR,
                token: String(token)
            }, (err: any, result: any) => resolve(result));
        });

        if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {

            // ID'yi alıyoruz (conversationId veya basketId)
            const rawId = result.conversationId || result.basketId;

            // DÜZELTME: ID'yi sayıya (Integer) çeviriyoruz
            const orderId = parseInt(rawId);

            console.log(`🔍 Aranan Sipariş ID: ${orderId} (Orjinal: ${rawId})`);

            // Admin yetkisiyle bağlan
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );

            // Güncelle
            const { data, error } = await supabaseAdmin
                .from('orders')
                .update({
                    status: 'SUCCESS',
                    payment_id: result.paymentId
                })
                .eq('id', orderId) // Artık sayı olarak arıyoruz
                .select();

            if (data && data.length > 0) {
                console.log("✅ GÜNCELLENDİ! Sipariş No:", data[0].id);
            } else {
                console.error("⚠️ HATA: Bu ID'ye sahip sipariş veritabanında bulunamadı!");
                console.error("İPUCU: Supabase 'orders' tablosunu kontrol et, ID'si", orderId, "olan bir satır var mı?");
            }

            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/odeme-basarili`, 303);

        } else {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/?error=payment_failed`, 303);
        }

    } catch (error) {
        console.error("Sunucu Hatası:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/?error=server_error`, 303);
    }
}