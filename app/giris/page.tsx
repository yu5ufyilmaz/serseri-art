'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GirisPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert('Giriş Başarısız: ' + error.message);
        } else {
            router.push('/');
            router.refresh();
        }
        setLoading(false);
    };

    // Google ile Giriş Fonksiyonu
    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`, // Giriş yapınca ana sayfaya dön
            },
        });
        if (error) alert("Google hatası: " + error.message);
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md border border-zinc-800">
                <h1 className="text-3xl font-bold mb-6 text-center">Tekrar Hoşgeldin</h1>

                {/* GOOGLE BUTONU */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white text-black font-bold py-3 rounded flex items-center justify-center gap-3 hover:bg-gray-200 transition mb-6"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google ile Giriş Yap
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-zinc-700 flex-1"></div>
                    <span className="text-sm text-gray-500">veya e-posta ile</span>
                    <div className="h-px bg-zinc-700 flex-1"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-2">E-Posta</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded p-3 text-white focus:outline-none focus:border-white"
                            placeholder="ornek@mail.com"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Şifre</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded p-3 text-white focus:outline-none focus:border-white"
                            placeholder="******"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-zinc-700 text-white font-bold py-3 rounded hover:bg-zinc-600 transition disabled:opacity-50"
                    >
                        {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400">
                    Hesabın yok mu? <Link href="/kayit" className="text-white underline">Kayıt Ol</Link>
                </p>
            </div>
        </div>
    );
}