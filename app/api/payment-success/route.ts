import { NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';

export async function POST(request: Request) {
    try {
        // 1. Gelen form verisini al
        const formData = await request.formData();
        const token = formData.get('token');

        console.log("🎫 Iyzico Token Yakalandı:", token);

        // Eğer token yoksa direkt hata ver
        if (!token) {
            console.error("❌ Token bulunamadı!");
            return NextResponse.redirect('http://localhost:3000/?error=no_token', 303);
        }

        // 2. Iyzico Ayarlarını Yap (Sorgulama için)
        const iyzipay = new Iyzipay({
            apiKey: process.env.IYZICO_API_KEY!,
            secretKey: process.env.IYZICO_SECRET_KEY!,
            uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
        });

        // 3. Token ile Iyzico'ya "Bu ödemenin durumu ne?" diye sor
        const result: any = await new Promise((resolve) => {
            iyzipay.checkoutForm.retrieve({
                locale: Iyzipay.LOCALE.TR,
                conversationId: '123456789', // Rastgele olabilir, Iyzico eşleştirir
                token: String(token)
            }, (err: any, result: any) => {
                if (err) {
                    resolve({ status: 'failure', errorMessage: err });
                } else {
                    resolve(result);
                }
            });
        });

        // 4. Iyzico'dan gelen GERÇEK sonucu kontrol et
        console.log("🕵️ Iyzico Sorgu Sonucu:", result.status, "| Ödeme Durumu:", result.paymentStatus);

        if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
            console.log("✅ Ödeme TEYİTLENDİ! Sayfaya yönlendiriliyor...");
            return NextResponse.redirect('http://localhost:3000/odeme-basarili', 303);
        } else {
            console.error("❌ Ödeme Onaylanmadı:", result.errorMessage);
            return NextResponse.redirect('http://localhost:3000/?error=payment_validation_failed', 303);
        }

    } catch (error) {
        console.error("💥 Callback Hatası:", error);
        return NextResponse.redirect('http://localhost:3000/?error=server_error', 303);
    }
}