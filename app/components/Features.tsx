export default function Features() {
  const features = [
    {
      title: "Sales Prediction",
      description: "AI-powered forecasting to optimize inventory and maximize revenue",
      icon: "📈"
    },
    {
      title: "Customer Behavior",
      description: "Deep insights into shopping patterns and preferences",
      icon: "🎯"
    },
    {
      title: "Smart Recommendations",
      description: "Data-driven suggestions for business growth",
      icon: "💡"
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
          Powerful Features
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-card p-8 rounded-xl hover:border-[#00f3ff] transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}