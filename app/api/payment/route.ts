import { NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { price, productName, id } = body;

        // Konsola bilgi verelim (Debug)
        console.log("Ödeme isteği geldi:", { price, productName, id });

        // API Anahtarlarını kontrol et
        if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
            console.error("HATA: API Key'ler okunmuyor!");
            return NextResponse.json({
                status: 'failure',
                errorMessage: 'Sunucu API anahtarlarını okuyamadı.'
            });
        }

        const iyzipay = new Iyzipay({
            apiKey: process.env.IYZICO_API_KEY,
            secretKey: process.env.IYZICO_SECRET_KEY,
            uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
        });

        const requestData = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: String(id),
            price: price,
            paidPrice: price,
            currency: Iyzipay.CURRENCY.TRY,
            basketId: String(id),
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: 'http://localhost:3000/api/payment-success',
            enabledInstallments: [1, 2, 3, 6, 9],
            buyer: {
                id: '123',
                name: 'Ogrenci', // Türkçe karakter kullanma (Öğrenci -> Ogrenci)
                surname: 'Alici',
                gsmNumber: '+905350000000',
                email: 'email@email.com',
                identityNumber: '74300864791',
                lastLoginDate: '2015-10-05 12:43:35',
                registrationAddress: 'Nidakule Goztepe, Merdivenkoy Mah. Bora Sok. No:1',
                ip: '85.34.78.112',
                city: 'Istanbul',
                country: 'Turkey',
                zipCode: '34732'
            },
            shippingAddress: {
                contactName: 'Jane Doe',
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Nidakule Goztepe, Merdivenkoy Mah. Bora Sok. No:1',
                zipCode: '34742'
            },
            billingAddress: {
                contactName: 'Jane Doe',
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Nidakule Goztepe, Merdivenkoy Mah. Bora Sok. No:1',
                zipCode: '34742'
            },
            basketItems: [
                {
                    id: String(id),
                    name: productName,
                    category1: 'Sanat',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                    price: price
                }
            ]
        };

        return new Promise((resolve) => {
            iyzipay.checkoutFormInitialize.create(requestData as any, (err: any, result: any) => {
                if (err) {
                    console.error("IYZICO HATASI (Internal):", err);
                    resolve(NextResponse.json({ status: 'failure', errorMessage: 'Iyzico bağlantı hatası' }));
                } else if (result.status !== 'success') {
                    // Iyzico'dan cevap geldi ama hata var (Örn: API Key yanlış)
                    console.error("IYZICO HATASI (Response):", result.errorMessage);
                    resolve(NextResponse.json({ status: 'failure', errorMessage: result.errorMessage }));
                } else {
                    // Başarılı
                    console.log("Iyzico Formu Oluştu:", result.paymentPageUrl);
                    resolve(NextResponse.json(result));
                }
            });
        });

    } catch (error) {
        console.error("GENEL SUNUCU HATASI:", error);
        return NextResponse.json({ status: 'failure', errorMessage: 'Sunucu hatası oluştu' }, { status: 500 });
    }
}