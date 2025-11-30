'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function KayitPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter(); // Yönlendirme için

    const handleRegister = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        // Supabase'e kayıt isteği at
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert('Hata: ' + error.message);
        } else {
            alert('Kayıt Başarılı! Giriş yapabilirsin.');
            router.push('/giris'); // Giriş sayfasına yönlendir
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md border border-zinc-800">
                <h1 className="text-3xl font-bold mb-6 text-center">Aramıza Katıl</h1>

                <form onSubmit={handleRegister} className="space-y-4">
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
                        {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400">
                    Zaten hesabın var mı? <Link href="/giris" className="text-white underline">Giriş Yap</Link>
                </p>
            </div>
        </div>
    );
}