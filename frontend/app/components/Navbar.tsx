"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="fixed w-full z-50 glass-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold gradient-text">
            RetailAI
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                Services
              </Link>
              <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
                How It Works
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link
                href="/auth"
                className="bg-gradient-to-r from-[#00f3ff] to-[#00ff9d] text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/services" className="block text-gray-300 hover:text-white transition-colors py-2">
              Services
            </Link>
            <Link href="/how-it-works" className="block text-gray-300 hover:text-white transition-colors py-2">
              How It Works
            </Link>
            <Link href="/pricing" className="block text-gray-300 hover:text-white transition-colors py-2">
              Pricing
            </Link>
            <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors py-2">
              Contact Us
            </Link>
            <Link
              href="/auth"
              className="block bg-gradient-to-r from-[#00f3ff] to-[#00ff9d] text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity mt-4"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

