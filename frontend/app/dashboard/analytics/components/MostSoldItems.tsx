'use client';

import { useState } from 'react';
import { mostSoldItems } from '../mockData';

export default function MostSoldItems() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-2xl font-bold gradient-text mb-6">Most Sold Items</h2>
      
      <div className="flex space-x-4 mb-6">
        {mostSoldItems.map((item, index) => (
          <button
            key={item.outlet}
            onClick={() => setActiveIndex(index)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeIndex === index
                ? 'bg-gradient-to-r from-[#00f3ff]/20 to-[#00ff9d]/20 border border-[#00f3ff]/40'
                : 'hover:bg-white/5'
            }`}
          >
            {item.outlet}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card p-4 rounded-lg border border-[#00f3ff]/20">
          <p className="text-sm text-gray-400">Item Name</p>
          <p className="text-2xl font-bold text-white mt-1">
            {mostSoldItems[activeIndex].item}
          </p>
        </div>

        <div className="glass-card p-4 rounded-lg border border-[#00ff9d]/20">
          <p className="text-sm text-gray-400">Quantity Sold</p>
          <p className="text-2xl font-bold text-white mt-1">
            {mostSoldItems[activeIndex].quantity.toLocaleString()}
          </p>
        </div>

        <div className="glass-card p-4 rounded-lg border border-[#00f3ff]/20">
          <p className="text-sm text-gray-400">Revenue</p>
          <p className="text-2xl font-bold text-white mt-1">
            ${mostSoldItems[activeIndex].revenue.toLocaleString()}
          </p>
        </div>

        <div className="glass-card p-4 rounded-lg border border-[#00ff9d]/20">
          <p className="text-sm text-gray-400">Growth</p>
          <p className={`text-2xl font-bold mt-1 ${
            mostSoldItems[activeIndex].growth > 0 ? 'text-[#00ff9d]' : 'text-[#ff0055]'
          }`}>
            {mostSoldItems[activeIndex].growth > 0 ? '+' : ''}
            {mostSoldItems[activeIndex].growth}%
          </p>
        </div>
      </div>
    </div>
  );
}