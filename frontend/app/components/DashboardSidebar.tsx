'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const menuItems = [
  { path: '/dashboard', label: 'Sales Overview', icon: '📊' },
  { path: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
  { path: '/dashboard/forecasting', label: 'Forecasting', icon: '🎯' },
  { path: '/dashboard/expansion', label: 'Insights', icon: '📤' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const MenuItem = ({ item }: { item: typeof menuItems[0] }) => {
    const isExternal = item.path.startsWith('http');
    const commonClasses = "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full";
    const activeClasses = "bg-gradient-to-r from-[#00f3ff]/10 to-[#00ff9d]/10 border border-[#00f3ff]/20";
    const inactiveClasses = "hover:bg-white/5";

    return isExternal ? (
      <a
        href={item.path}
        target="_blank"
        rel="noopener noreferrer"
        className={`${commonClasses} ${inactiveClasses}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <span>{item.icon}</span>
        <span>{item.label}</span>
      </a>
    ) : (
      <Link
        href={item.path}
        className={`${commonClasses} ${pathname === item.path ? activeClasses : inactiveClasses}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <span>{item.icon}</span>
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg glass-card hover:bg-white/5 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          glass-card fixed z-40 h-screen transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0 w-full' : '-translate-x-full'}
          lg:translate-x-0 lg:w-64 lg:static
        `}
      >
        <div className="h-full p-6 flex flex-col">
          <div className="mb-8">
            <Link
              href="/"
              className="text-2xl font-bold gradient-text"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              RetailAI
            </Link>
          </div>
          
          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => (
              <MenuItem key={item.path} item={item} />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}