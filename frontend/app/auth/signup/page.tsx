'use client';

import { useState } from 'react';
import Link from 'next/link';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    //   const supabase = createClientComponentClient();

    //   const handleSignup = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     try {
    //       const { error } = await supabase.auth.signUp({
    //         email,
    //         password,
    //       });

    //       if (error) throw error;
    //       router.push('/dashboard');
    //       toast.success('Account created successfully!');
    //     } catch (error: any) {
    //       toast.error(error.message);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Dummy user data
        const dummyUser = {
            email: "test@example.com",
            password: "password123",
        };

        try {
            if (email === dummyUser.email && password === dummyUser.password) {
                router.push('/login'); // Simulate successful login
                toast.success('Welcome back!');
            } else {
                throw new Error('Invalid email or password');
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="glass-card w-full max-w-md p-8 rounded-xl">
                <h2 className="text-3xl font-bold mb-6 gradient-text text-center">Sign Up</h2>
                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg glass-card border border-gray-700 focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-colors bg-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg glass-card border border-gray-700 focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-colors bg-transparent"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#00f3ff] to-[#00ff9d] text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <Link href="/auth/login" className="text-[#00f3ff] hover:underline">
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    );
}