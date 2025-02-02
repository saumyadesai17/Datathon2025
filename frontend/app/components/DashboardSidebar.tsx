'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { path: '/dashboard', label: 'Sales Overview', icon: '📊' },
  { path: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
  { path: '/dashboard/forecasting', label: 'Forecasting', icon: '🎯' },
  { path: 'http://localhost:3001/', label: 'Insights', icon: '📤' },
  // { path: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
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
        {menuItems.map((item) => {
          const isExternal = item.path.startsWith('http');
          const commonClasses = "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors";
          const activeClasses = "bg-gradient-to-r from-[#00f3ff]/10 to-[#00ff9d]/10 border border-[#00f3ff]/20";
          const inactiveClasses = "hover:bg-white/5";
          
          return isExternal ? (
            <a
              key={item.path}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              className={`${commonClasses} ${inactiveClasses}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ) : (
            <Link
              key={item.path}
              href={item.path}
              className={`${commonClasses} ${
                pathname === item.path ? activeClasses : inactiveClasses
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
