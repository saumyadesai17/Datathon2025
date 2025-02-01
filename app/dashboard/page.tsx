export default function Dashboard() {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold gradient-text">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-2">Total Sales</h3>
            <p className="text-3xl font-bold text-[#00f3ff]">$24,589</p>
            <p className="text-sm text-green-400 mt-2">↑ 12% from last month</p>
          </div>
          
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-2">Customer Traffic</h3>
            <p className="text-3xl font-bold text-[#00ff9d]">1,234</p>
            <p className="text-sm text-green-400 mt-2">↑ 8% from last month</p>
          </div>
          
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-2">Conversion Rate</h3>
            <p className="text-3xl font-bold text-[#ff0055]">3.2%</p>
            <p className="text-sm text-red-400 mt-2">↓ 1% from last month</p>
          </div>
        </div>
  
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Recent Insights</h2>
          <ul className="space-y-4">
            <li className="flex items-start space-x-4">
              <span className="text-[#00f3ff]">📈</span>
              <div>
                <p className="font-medium">Peak Shopping Hours Detected</p>
                <p className="text-gray-400">Customer traffic peaks between 2 PM and 5 PM on weekends</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <span className="text-[#00ff9d]">🎯</span>
              <div>
                <p className="font-medium">Product Recommendation</p>
                <p className="text-gray-400">Consider restocking "Product X" as it's trending in similar stores</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }