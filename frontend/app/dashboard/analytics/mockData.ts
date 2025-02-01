// Mock data for sales analytics
export const salesData = {
    daily: [
      { date: '2023-10-01', outlet1: 150, outlet2: 120, outlet3: 90 },
      { date: '2023-10-02', outlet1: 165, outlet2: 135, outlet3: 95 },
      { date: '2023-10-03', outlet1: 145, outlet2: 115, outlet3: 85 },
      { date: '2023-10-04', outlet1: 170, outlet2: 140, outlet3: 100 },
      { date: '2023-10-05', outlet1: 180, outlet2: 150, outlet3: 110 }
    ],
    weekly: [
      { week: 'Week 1', outlet1: 1050, outlet2: 840, outlet3: 630 },
      { week: 'Week 2', outlet1: 1155, outlet2: 945, outlet3: 665 },
      { week: 'Week 3', outlet1: 1015, outlet2: 805, outlet3: 595 },
      { week: 'Week 4', outlet1: 1190, outlet2: 980, outlet3: 700 }
    ],
    monthly: [
      { month: 'Jan', outlet1: 4000, outlet2: 3000, outlet3: 2000 },
      { month: 'Feb', outlet1: 3500, outlet2: 2800, outlet3: 2200 },
      { month: 'Mar', outlet1: 4200, outlet2: 3300, outlet3: 2400 },
      { month: 'Apr', outlet1: 3800, outlet2: 3100, outlet3: 2100 },
      { month: 'May', outlet1: 4100, outlet2: 3400, outlet3: 2300 },
      { month: 'Jun', outlet1: 3900, outlet2: 3200, outlet3: 2500 }
    ],
    yearly: [
      { year: '2020', outlet1: 45000, outlet2: 35000, outlet3: 25000 },
      { year: '2021', outlet1: 48000, outlet2: 37000, outlet3: 27000 },
      { year: '2022', outlet1: 52000, outlet2: 39000, outlet3: 29000 },
      { year: '2023', outlet1: 55000, outlet2: 41000, outlet3: 31000 }
    ]
  };
  
  export const categoryData = [
    { category: 'Burgers', sales: 2500, growth: 15 },
    { category: 'Pizza', sales: 2100, growth: 8 },
    { category: 'Drinks', sales: 1800, growth: 12 },
    { category: 'Sides', sales: 1200, growth: 5 },
    { category: 'Desserts', sales: 900, growth: 10 }
  ];
  
  export const mostSoldItems = [
    {
      outlet: 'Outlet 1',
      item: 'Chicken Burger',
      quantity: 1234,
      revenue: 12340,
      growth: 12,
      contribution: 25
    },
    {
      outlet: 'Outlet 2',
      item: 'Veggie Supreme',
      quantity: 987,
      revenue: 9870,
      growth: 8,
      contribution: 20
    },
    {
      outlet: 'Outlet 3',
      item: 'Classic Pizza',
      quantity: 876,
      revenue: 8760,
      growth: -3,
      contribution: 18
    }
  ];
  
  export const outletLocations = [
    {
      id: 1,
      name: 'Downtown Branch',
      lat: 40.7128,
      lng: -74.0060,
      performance: 95,
      sales: 1234567,
      status: 'active'
    },
    {
      id: 2,
      name: 'Midtown Branch',
      lat: 40.7549,
      lng: -73.9840,
      performance: 67,
      sales: 987654,
      status: 'low'
    },
    {
      id: 3,
      name: 'Uptown Branch',
      lat: 40.7829,
      lng: -73.9654,
      performance: 92,
      sales: 876543,
      status: 'active'
    }
  ];
  
  export const predictedLocations = [
    {
      id: 'p1',
      name: 'Brooklyn Heights',
      lat: 40.6935,
      lng: -73.9935,
      confidence: 85,
      predictedSales: 980000
    },
    {
      id: 'p2',
      name: 'Long Island City',
      lat: 40.7505,
      lng: -73.9965,
      confidence: 78,
      predictedSales: 850000
    }
  ];
  
  export const waitingTimes = [
    {
      outlet: 'Outlet 1',
      averageTime: 12,
      peak: 18,
      offPeak: 8,
      trend: 'decreasing'
    },
    {
      outlet: 'Outlet 2',
      averageTime: 15,
      peak: 22,
      offPeak: 10,
      trend: 'increasing'
    },
    {
      outlet: 'Outlet 3',
      averageTime: 10,
      peak: 16,
      offPeak: 7,
      trend: 'stable'
    }
  ];
  
  // Generate 30 days of forecast data
  export const salesForecast = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      outlet1: Math.floor(4000 + Math.random() * 1000),
      outlet2: Math.floor(3000 + Math.random() * 800),
      outlet3: Math.floor(2000 + Math.random() * 600),
      confidence: Math.floor(85 + Math.random() * 10)
    };
  });