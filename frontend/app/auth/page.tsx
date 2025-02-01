'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login & Signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ----------------------------
  // Dummy Authentication Logic
  // ----------------------------
  const handleDummyAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Dummy credentials
    const dummyCredentials = {
      email: 'test@gmail.com',
      password: 'pass@123',
    };

    if (isLogin) {
      // Simulating login process
      if (email === dummyCredentials.email && password === dummyCredentials.password) {
        toast.success('Logged in successfully!');
        router.push('/dashboard'); // Redirect to dashboard after successful login
      } else {
        toast.error('Invalid email or password');
      }
    } else {
      // Simulating signup process
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
      } else {
        toast.success('Account created successfully!');
        router.push('/dashboard'); // Redirect to dashboard after successful signup
      }
    }
    setLoading(false);
  };

  // ----------------------------
  // Original Authentication Logic (Commented out for now)
  // ----------------------------
  /*
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let error;

      if (isLogin) {
        // Login logic using Supabase
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        error = loginError;
      } else {
        // Signup logic using Supabase
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const { error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }, // Save full name in user metadata
        });

        error = signupError;
      }

      if (error) throw error;

      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  */

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="glass-card w-full max-w-md p-8 rounded-xl"
      >
        {/* Toggle Buttons */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 font-bold transition-all ${isLogin ? 'text-[#00f3ff] border-b-2 border-[#00f3ff]' : 'text-gray-400'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 font-bold transition-all ${!isLogin ? 'text-[#00f3ff] border-b-2 border-[#00f3ff]' : 'text-gray-400'}`}
          >
            Signup
          </button>
        </div>

        {/* Animated Form */}
        <motion.div
          key={isLogin ? 'login' : 'signup'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-6 gradient-text text-center">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          <form onSubmit={handleDummyAuth} className="space-y-6">
            {/* Full Name (Signup Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg glass-card border border-gray-700 focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-colors bg-transparent"
                  required
                />
              </div>
            )}

            {/* Email Field */}
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

            {/* Password Field */}
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

            {/* Confirm Password (Signup Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg glass-card border border-gray-700 focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-colors bg-transparent"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00f3ff] to-[#00ff9d] text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          {/* Switch Between Login & Signup */}
          <div className="mt-6 text-center">
            {isLogin ? (
              <p className="text-gray-400">
                Don't have an account?{' '}
                <button onClick={() => setIsLogin(false)} className="text-[#00f3ff] hover:underline">
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-gray-400">
                Already have an account?{' '}
                <button onClick={() => setIsLogin(true)} className="text-[#00f3ff] hover:underline">
                  Login
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
