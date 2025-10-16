'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface OutletSales {
  filename: string;
  total_sales: number;
  total_orders: number;
  average_order_value: number;
}

export default function Dashboard() {
  const [salesData, setSalesData] = useState<OutletSales[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    axios.get<OutletSales[]>(`${backendUrl}/get_total_sales/`)
      .then(response => {
        setSalesData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching sales data:', error);
        setLoading(false);
      });
  }, []);

  const totalSales = salesData?.reduce((sum, outlet) => sum + outlet.total_sales, 0) || 0;
  const totalOrders = salesData?.reduce((sum, outlet) => sum + outlet.total_orders, 0) || 0;
  const avgOrderValue = totalOrders ? (totalSales / totalOrders).toFixed(2) : '0.00';

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold gradient-text">Sales Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-medium mb-2">Total Sales</h3>
          {loading ? (
            <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <p className="text-3xl font-bold text-[#007acc]">₹{totalSales.toLocaleString()}</p>
          )}
        </div>

        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-medium mb-2">Total Orders</h3>
          {loading ? (
            <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <p className="text-3xl font-bold text-[#00b894]">{totalOrders.toLocaleString()}</p>
          )}
        </div>

        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-medium mb-2">Avg Order Value</h3>
          {loading ? (
            <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <p className="text-3xl font-bold text-[#e67e22]">₹{parseFloat(avgOrderValue).toLocaleString()}</p>
          )}
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Sales Performance by Outlet</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading
            ? Array(4).fill(0).map((_, index) => (
              <div key={index} className="h-24 bg-gray-700 rounded animate-pulse"></div>
            ))
            : (salesData?.map(outlet => (
              <div key={outlet.filename} className="glass-card p-6 rounded-lg border border-gray-600">
                <h3 className="text-xl font-semibold text-white">{outlet.filename.replace('.csv', '')}</h3>
                <p className="text-lg text-gray-300 mt-2">
                  Total Sales: <span className="text-[#007acc] font-bold text-xl">
                    ₹{new Intl.NumberFormat('en-IN').format(outlet.total_sales)}
                  </span>
                </p>
                <p className="text-lg text-gray-300">
                  Total Orders: <span className="text-[#00b894] font-bold text-xl">
                    {new Intl.NumberFormat('en-IN').format(outlet.total_orders)}
                  </span>
                </p>
                <p className="text-lg text-gray-300">
                  Avg Order Value: <span className="text-[#e67e22] font-bold text-xl">
                    ₹{new Intl.NumberFormat('en-IN').format(outlet.average_order_value)}
                  </span>
                </p>
              </div>

            ))
            )}
        </div>
      </div>
    </div>
  );
}
