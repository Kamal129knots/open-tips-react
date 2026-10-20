import './App.css';
import { TIPS } from './tips/tips.js';
import { useFeatureTips } from './tips/useFeatureTips.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import RfqList from './components/RfqList.jsx';

// In the real app these come from the session
const USER = { id: 'u-1042', name: 'Kamal CK', company: 'Ocean Shipping Pte ltd' };

// Sample data
const COINS = { available: 9700, utilised: 2300 };
const RFQS = [
  { id: 10197, port: 'Singapore', at: '15 Oct 2026 05:32 PM', products: ['HSFO RMG 180 MAX 3.5% SULPHUR', 'HSFO MAX 3.5% SULPHUR'], volumes: ['0.000 - 400.000 MT', '0.000 - 500.000 MT'], vessel: 'DAISEN | 9675652', bids: 2, status: 'closed' },
  { id: 10196, port: 'Aach', at: '15 Oct 2026 05:31 PM', products: ['VLSFO RMG 180 MAX 0.5% SULPHUR'], volumes: ['0.000 - 1000.000 MT'], vessel: 'ORIZABA | 9567087', bids: 1, status: 'expired' },
  { id: 10193, port: 'Singapore', at: '14 Oct 2026 11:08 AM', products: ['VLSFO MAX 0.5% SULPHUR'], volumes: ['800.000 - 1000.000 MT'], vessel: 'RINJANI | 9579884', bids: 2, status: 'expired' },
  { id: 10190, port: 'Fujairah', at: '13 Oct 2026 09:44 AM', products: ['MGO DMA 0.1% SULPHUR'], volumes: ['50.000 - 150.000 MT'], vessel: 'KESTREL | 9711230', bids: 3, status: 'open' },
];

export default function App() {
  // Opens unseen tips automatically after the page loads
  const { replay } = useFeatureTips({ tips: TIPS, userId: USER.id });

  return (
    <main className="app">
      <Header user={USER} onReplayTips={replay} />
      <Hero user={USER} coins={COINS} />
      <RfqList rfqs={RFQS} />
    </main>
  );
}
