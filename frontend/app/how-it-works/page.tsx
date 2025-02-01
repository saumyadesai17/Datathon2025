import { FaRegLightbulb, FaUserAlt, FaCogs } from 'react-icons/fa';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold gradient-text">How It Works</h1>
        <p className="text-lg text-gray-300 mt-4">A step-by-step guide to harnessing the power of AI for your business.</p>
      </div>

      <div className="mt-12 space-y-12 max-w-6xl mx-auto">
        {/* Step 1 */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="bg-[#00f3ff] p-8 rounded-full shadow-lg">
            <FaRegLightbulb className="text-4xl text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Step 1: Upload Your Data</h2>
            <p className="text-gray-300 mt-2">
              Securely upload your sales and customer data to get started.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="bg-[#00ff9d] p-8 rounded-full shadow-lg">
            <FaUserAlt className="text-4xl text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Step 2: AI-Powered Analysis</h2>
            <p className="text-gray-300 mt-2">
              Our AI engine analyzes your data to extract valuable insights.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="bg-[#00f3ff] p-8 rounded-full shadow-lg">
            <FaCogs className="text-4xl text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Step 3: Optimize & Grow</h2>
            <p className="text-gray-300 mt-2">
              Use our insights to optimize your pricing and grow your business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
