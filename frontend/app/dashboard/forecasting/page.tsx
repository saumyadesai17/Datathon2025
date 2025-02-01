import dynamic from 'next/dynamic';
import SalesForecast from './components/SalesForecast';

// Dynamic import for the map component to avoid SSR issues
const OutletMap = dynamic(
  () => import('../analytics/components/OutletMap'),
  { ssr: false }
);

export default function Forecasting() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold gradient-text">Sales Forecasting</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <SalesForecast />
        <OutletMap />
      </div>
    </div>
  );
}