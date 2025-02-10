import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center hero-gradient">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 blur-3xl opacity-30 bg-[#00f3ff] rounded-full -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 blur-3xl opacity-30 bg-[#00ff9d] rounded-full -bottom-48 -right-48"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 sm:mt-2em">
          <span className="gradient-text">Transform Retail</span>
          <br />
          with AI-Powered Insights
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Harness the power of artificial intelligence to predict sales trends, 
          understand customer behavior, and optimize your retail strategy.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/auth">
          <button className="bg-gradient-to-r from-[#00f3ff] to-[#00ff9d] text-black font-bold px-8 py-4 rounded-lg text-lg hover:opacity-90 transition-opacity">
            Request Demo
          </button>

          </Link>
          <button className="glass-card px-8 py-4 rounded-lg text-lg border border-[#00f3ff] hover:bg-[#00f3ff]/10 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}