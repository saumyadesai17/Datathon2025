import dynamic from 'next/dynamic';
import CompetitorList from './components/CompetitorList';
import RentableShops from './components/RentableShops';
import InsightsBox from './components/InsightsBox';

// Dynamic import for the map component to avoid SSR issues
const ExpansionMap = dynamic(
  () => import('./components/ExpansionMap'),
  { ssr: false }
);

export default function Expansion() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold gradient-text">Competitor & Rentable Shops Insights</h1>
        <p className="text-gray-400 mt-2">
          Analyze nearby competition and available shop spaces to optimize store location strategy.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CompetitorList />
        <RentableShops />
        <ExpansionMap />
        <InsightsBox />
      </div>
    </div>
  );
}