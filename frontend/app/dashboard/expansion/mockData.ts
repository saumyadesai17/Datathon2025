// Mock data for competitors and rentable shops
export const competitors = [
    {
      id: 1,
      name: "FoodCo Express",
      location: "Downtown Manhattan",
      lat: 40.7127,
      lng: -74.0059,
      type: "Fast Food",
      rating: 4.2,
      avgFootfall: 500,
      distance: 0.3
    },
    {
      id: 2,
      name: "Quick Bites",
      location: "Financial District",
      lat: 40.7075,
      lng: -74.0021,
      type: "Quick Service",
      rating: 3.8,
      avgFootfall: 350,
      distance: 0.5
    },
    {
      id: 3,
      name: "Urban Eats",
      location: "Tribeca",
      lat: 40.7195,
      lng: -74.0089,
      type: "Restaurant",
      rating: 4.5,
      avgFootfall: 600,
      distance: 0.7
    }
  ];
  
  export const rentableShops = [
    {
      id: 1,
      name: "Prime Corner Space",
      location: "Lower Manhattan",
      lat: 40.7112,
      lng: -74.0055,
      price: 8500,
      size: 1200,
      priceCategory: "expensive",
      availability: "Immediate",
      features: ["Corner Location", "High Foot Traffic", "Recently Renovated"]
    },
    {
      id: 2,
      name: "Mid-Block Retail",
      location: "Financial District",
      lat: 40.7082,
      lng: -74.0032,
      price: 5500,
      size: 900,
      priceCategory: "moderate",
      availability: "30 days",
      features: ["Modern Interior", "Storage Space", "Loading Dock"]
    },
    {
      id: 3,
      name: "Street Level Shop",
      location: "Tribeca",
      lat: 40.7185,
      lng: -74.0079,
      price: 4200,
      size: 800,
      priceCategory: "affordable",
      availability: "60 days",
      features: ["Street Exposure", "New HVAC", "Basement Storage"]
    }
  ];
  
  export const insights = {
    bestLocation: {
      name: "Mid-Block Retail",
      score: 85,
      reasons: [
        "Balanced rent-to-size ratio",
        "Moderate competition density",
        "High foot traffic area"
      ]
    },
    competitorDensity: {
      level: "Moderate",
      count: 3,
      radius: "0.5 mile"
    },
    marketPotential: {
      score: 78,
      factors: [
        "Growing residential area",
        "Limited direct competition",
        "Good transport links"
      ]
    }
  };