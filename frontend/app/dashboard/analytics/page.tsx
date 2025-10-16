import dynamic from 'next/dynamic';
import MostSoldItemsContent from './components/MostSoldItems';
import WaitingTimes from './components/WaitingTimes';
import SalesGraphWithQuery from './components/SalesGraphWithQuery';
import ReactQueryProvider from '@/app/providers/ReactQueryProvider';

// Dynamic import for the map component to avoid SSR issues
const OutletMap = dynamic(
  () => import('./components/OutletMap'),
  { ssr: false }
);

export default function Analytics() {
  return (
    <ReactQueryProvider>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold gradient-text">Analytics & Insights</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesGraphWithQuery />
          <MostSoldItemsContent />
          <OutletMap />
          <WaitingTimes />
        </div>
      </div>
    </ReactQueryProvider>
  );
}