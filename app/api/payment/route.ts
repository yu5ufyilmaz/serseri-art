import { NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Hem tekli alımı hem sepeti destekleyen yapı
        const { buyer, cartItems } = body;
        let { price, productName, id } = body;

        // EĞER SEPET VARSA: Fiyatı ve listeyi sepetten oluştur
        let basketItemsIyzico = [];

        if (cartItems && cartItems.length > 0) {
            // 1. Toplam fiyatı hesapla
            price = cartItems.reduce((sum: number, item: any) => sum + Number(item.price), 0);

            // 2. Ürün ismini özetle (Örn: "3 Eser: Tablo A, Heykel B...")
            productName = `${cartItems.length} Eser: ` + cartItems.map((i: any) => i.title).join(', ');
            if (productName.length > 200) productName = productName.substring(0, 197) + '...';

            // 3. ID olarak ilk ürünün ID'sini veya rastgele bir ID kullanabiliriz (Sepet ID'si)
            id = 'cart_' + Date.now();

            // 4. Iyzico Sepet Formatını Hazırla
            basketItemsIyzico = cartItems.map((item: any) => ({
                id: String(item.id),
                name: item.title,
                category1: 'Sanat',
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: item.price
            }));

        } else {
            // TEKLİ ALIM İSE (Eski sistem devam)
            basketItemsIyzico = [{
                id: String(id),
                name: productName,
                category1: 'Sanat',
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: price
            }];
        }

        // --- SİPARİŞİ VERİTABANINA KAYDET ---
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                product_name: productName,
                amount: price,
                status: 'PENDING',
                buyer_name: buyer?.name || 'Misafir',
                buyer_email: buyer?.email || 'email@yok.com',
                buyer_phone: buyer?.phone || '5555555555',
                city: buyer?.city || 'Bilinmiyor',
                shipping_address: buyer?.address || 'Adres Girilmedi',
                payment_id: 'temp_' + Date.now()
            })
            .select()
            .single();

        if (orderError) {
            console.error('Sipariş Kayıt Hatası:', orderError);
            return NextResponse.json({ status: 'failure', errorMessage: 'Sipariş oluşturulamadı' });
        }

        const orderId = orderData.id;
        console.log("📝 Sipariş Oluşturuldu. ID:", orderId, "Tutar:", price);

        // --- IYZICO BAŞLAT ---
        const iyzipay = new Iyzipay({
            apiKey: process.env.IYZICO_API_KEY!,
            secretKey: process.env.IYZICO_SECRET_KEY!,
            uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
        });

        const requestData = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: String(orderId),
            price: price,
            paidPrice: price,
            currency: Iyzipay.CURRENCY.TRY,
            basketId: String(orderId),
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/payment-success`,
            enabledInstallments: [1, 2, 3, 6, 9],
            buyer: {
                id: String(orderId),
                name: 'Ogrenci',
                surname: 'Alici',
                gsmNumber: buyer?.phone || '+905555555555',
                email: buyer?.email || 'email@email.com',
                identityNumber: '11111111111',
                lastLoginDate: '2024-01-01 12:00:00',
                registrationAddress: buyer?.address || 'Adres Yok',
                ip: '85.34.78.112',
                city: buyer?.city || 'Istanbul',
                country: 'Turkey',
                zipCode: '34732'
            },
            shippingAddress: {
                contactName: buyer?.name || 'Alici',
                city: buyer?.city || 'Istanbul',
                country: 'Turkey',
                address: buyer?.address || 'Adres Yok',
                zipCode: '34742'
            },
            billingAddress: {
                contactName: buyer?.name || 'Alici',
                city: buyer?.city || 'Istanbul',
                country: 'Turkey',
                address: buyer?.address || 'Adres Yok',
                zipCode: '34742'
            },
            basketItems: basketItemsIyzico // Hazırladığımız sepet listesini buraya koyduk
        };

        return new Promise<NextResponse>((resolve) => {
            iyzipay.checkoutFormInitialize.create(requestData as any, (err: any, result: any) => {
                if (err || result.status !== 'success') {
                    console.error("Iyzico Hatası:", result?.errorMessage);
                    resolve(NextResponse.json({ status: 'failure', errorMessage: result?.errorMessage || 'Iyzico Hatası' }));
                } else {
                    resolve(NextResponse.json(result));
                }
            });
        });

    } catch (error) {
        console.error("API Hatası:", error);
        return NextResponse.json({ status: 'failure', errorMessage: 'Sunucu hatası' }, { status: 500 });
    }
}