'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { path: '/dashboard', label: 'Overview', icon: '📊' },
  { path: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
  { path: '/dashboard/upload', label: 'Upload Data', icon: '📤' },
  { path: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-card w-64 h-screen fixed left-0 top-0 p-6">
      <div className="mb-8">
        <Link href="/" className="text-2xl font-bold gradient-text">
          RetailAI
        </Link>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === item.path
                ? 'bg-gradient-to-r from-[#00f3ff]/10 to-[#00ff9d]/10 border border-[#00f3ff]/20'
                : 'hover:bg-white/5'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}