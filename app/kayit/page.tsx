'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { validateAuthEmail } from '@/lib/authEmailPolicy';

export default function KayitPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const emailCheck = validateAuthEmail(email);
        if (!emailCheck.ok) {
            alert(emailCheck.message);
            return;
        }

        if (password.length < 8) {
            alert('Şifre en az 8 karakter olmalı.');
            return;
        }

        setLoading(true);
        const normalizedEmail = emailCheck.normalizedEmail;
        const emailRedirectTo = `${window.location.origin}/giris`;

        const resendConfirmationEmail = async () => {
            await supabase.auth.resend({
                type: 'signup',
                email: normalizedEmail,
                options: {
                    emailRedirectTo,
                },
            });
        };

        const { data, error } = await supabase.auth.signUp({
            email: normalizedEmail,
            password,
            options: {
                data: {
                    full_name: name.trim(),
                },
                emailRedirectTo,
            },
        });

        if (error) {
            alert('Hata: ' + error.message);
            setLoading(false);
            return;
        }

        // Supabase, var olan kullanıcıda güvenlik sebebiyle sessiz dönebilir.
        // identities boşsa kullanıcı zaten var kabul edip doğrulama maili tekrar gönderiyoruz.
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            await resendConfirmationEmail();
            alert('Bu e-posta ile daha önce kayıt var. Doğrulama mailini tekrar gönderdik.');
        } else {
            await supabase.auth.signOut();
            alert('Kayıt başarılı. Lütfen e-postana gelen doğrulama linkine tıkla.');
        }

        router.push('/giris');
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`,
            },
        });
        if (error) alert('Google hatası: ' + error.message);
    };

    return (
        <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-10">
            <div className="w-full max-w-md border border-[#cfcfcf] bg-[#efefef] p-6">
                <p className="text-[12px] tracking-[0.14em] text-[#5d5d5d]">HESAP</p>
                <h1 className="mt-1 text-3xl font-black tracking-tight">Hesap Oluştur</h1>

                <button
                    onClick={handleGoogleLogin}
                    className="mt-5 flex w-full items-center justify-center gap-3 border border-[#bfbfbf] bg-white py-2.5 text-sm font-semibold transition hover:bg-[#f5f5f5]"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google ile kayıt
                </button>

                <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#cccccc]"></div>
                    <span className="text-[11px] tracking-[0.12em] text-[#666]">VEYA</span>
                    <div className="h-px flex-1 bg-[#cccccc]"></div>
                </div>

                <form onSubmit={handleRegister} className="space-y-3">
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-[#cbcbcb] bg-white p-2.5 text-sm outline-none focus:border-[#9e9e9e]"
                        placeholder="ad soyad"
                    />
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-[#cbcbcb] bg-white p-2.5 text-sm outline-none focus:border-[#9e9e9e]"
                        placeholder="e-posta"
                    />
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-[#cbcbcb] bg-white p-2.5 text-sm outline-none focus:border-[#9e9e9e]"
                        placeholder="şifre"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#ef3218] py-2.5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-50"
                    >
                        {loading ? 'kaydediliyor...' : 'hesap oluştur'}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-[#666]">
                    Zaten hesabın var mı? <Link href="/giris" className="underline">Giriş yap</Link>
                </p>
            </div>
        </div>
    );
}
