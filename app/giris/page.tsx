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

        // Supabase'e giriş isteği at
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert('Giriş Başarısız: ' + error.message);
        } else {
            // Başarılı olursa ana sayfaya at
            router.push('/');
            router.refresh(); // Sayfayı yenile ki Navbar güncellensin
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md border border-zinc-800">
                <h1 className="text-3xl font-bold mb-6 text-center">Tekrar Hoşgeldin</h1>

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
                        className="w-full bg-white text-black font-bold py-3 rounded hover:bg-gray-200 transition disabled:opacity-50"
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