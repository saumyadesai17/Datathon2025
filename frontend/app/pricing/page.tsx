export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold gradient-text">Pricing Plans</h1>
        <p className="text-lg text-gray-300 mt-4">Find the perfect plan for your retail business. We offer flexible pricing based on your needs.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-12 mt-12 max-w-6xl mx-auto">
        {/* Basic Plan */}
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-[#00f3ff] hover:scale-105 transition-transform duration-300 ease-in-out">
          <h2 className="text-2xl font-bold">Basic</h2>
          <p className="text-lg text-gray-400 mt-2">$19/month</p>
          <ul className="text-gray-300 mt-4 space-y-2">
            <li>✔ Sales Predictions</li>
            <li>✔ Basic Analytics</li>
            <li>✔ 24/7 Support</li>
          </ul>
          <button className="mt-6 w-full bg-gradient-to-r from-[#00f3ff] to-[#00ff9d] text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
            Get Started
          </button>
        </div>

        {/* Pro Plan - Highlighted */}
        <div className="bg-[#00f3ff] p-8 rounded-xl shadow-lg text-black scale-105 border border-white hover:scale-110 transition-transform duration-300 ease-in-out">
          <h2 className="text-2xl font-bold">Pro</h2>
          <p className="text-lg mt-2">$49/month</p>
          <ul className="mt-4 space-y-2">
            <li>✔ AI-powered Insights</li>
            <li>✔ Advanced Analytics</li>
            <li>✔ Priority Support</li>
          </ul>
          <button className="mt-6 w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition">
            Get Started
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-[#00f3ff] hover:scale-105 transition-transform duration-300 ease-in-out">
          <h2 className="text-2xl font-bold">Enterprise</h2>
          <p className="text-lg text-gray-400 mt-2">Custom Pricing</p>
          <ul className="text-gray-300 mt-4 space-y-2">
            <li>✔ Tailored AI Models</li>
            <li>✔ Custom Integrations</li>
            <li>✔ Dedicated AI Consultant</li>
          </ul>
          <button className="mt-6 w-full bg-gradient-to-r from-[#00f3ff] to-[#00ff9d] text-black font-bold py-3 rounded-lg hover:opacity-90 transition">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}
