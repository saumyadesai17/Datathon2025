'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulating a contact form submission (Replace with API call)
    setTimeout(() => {
      toast.success('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center hero-gradient">
      {/* Background Gradient Blur */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 blur-3xl opacity-30 bg-[#00f3ff] rounded-full -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 blur-3xl opacity-30 bg-[#00ff9d] rounded-full -bottom-48 -right-48"></div>
      </div>

      {/* Contact Form Section */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-8">
          <span className="gradient-text">Get in Touch</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Have questions? Want to collaborate? Drop us a message, and we’ll get back to you!
        </p>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="glass-card p-8 rounded-xl space-y-6 max-w-lg mx-auto">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg glass-card border border-gray-700 focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-colors bg-transparent"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg glass-card border border-gray-700 focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-colors bg-transparent"
              required
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg glass-card border border-gray-700 focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-colors bg-transparent"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00f3ff] to-[#00ff9d] text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
