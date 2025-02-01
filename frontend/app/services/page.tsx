'use client';

import { useState } from 'react';
import { FaChartLine, FaBoxOpen, FaRegSmile } from 'react-icons/fa';

export default function Services() {
  const [activeService, setActiveService] = useState('Sales Forecasting');

  const services = [
    {
      name: 'Sales Forecasting',
      icon: <FaChartLine className="text-4xl text-[#00f3ff]" />,
      description: 'Predict future sales trends using AI-powered algorithms to make data-driven decisions.',
    },
    {
      name: 'Customer Insights',
      icon: <FaBoxOpen className="text-4xl text-[#00ff9d]" />,
      description: 'Analyze customer behavior and tailor your retail strategy to increase engagement and sales.',
    },
    {
      name: 'Dynamic Pricing',
      icon: <FaRegSmile className="text-4xl text-[#00f3ff]" />,
      description: 'Optimize pricing dynamically based on real-time market conditions and competitor analysis.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold gradient-text">Our Services</h1>
        <p className="text-lg text-gray-300 mt-4">Transform your retail strategy with AI-driven services.</p>
      </div>

      <div className="mt-12 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.name}
            className={`p-8 rounded-lg shadow-lg bg-gray-800 hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer`}
            onClick={() => setActiveService(service.name)}
          >
            <div className="text-center mb-4">{service.icon}</div>
            <h3 className="text-2xl font-bold">{service.name}</h3>
            <p className="text-gray-300 mt-2">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
