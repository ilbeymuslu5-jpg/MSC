import { Calendar, Handshake, Wallet, ChevronDown } from 'lucide-react';
import Sidebar from './components/Sidebar.jsx';
import KpiCard from './components/KpiCard.jsx';

const KPIS = [
  { label: 'Aktif Rezervasyon', value: '1', icon: Calendar },
  { label: 'Bekleyen Anlaşma', value: '0', icon: Handshake },
  { label: 'Bu Ay Royalti', value: '₺7.460', icon: Wallet },
];

export default function App() {
  return (
    <div className="min-h-screen flex bg-[#F7F9FC]">
      <Sidebar />

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Genel Bakış</h1>
          <p className="mt-2 max-w-2xl font-normal text-gray-600">
            Ekosistemdeki tüm paydaşların tek panelden iş akışlarını, performanslarını ve
            gelirlerini yönetmesini sağlayan merkezi bir yönetim paneli.
          </p>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-gray-700"
          >
            <span>Şu an kimsiniz:</span>
            <span className="inline-flex items-center gap-1 font-semibold text-indigo-700">
              Sanatçı
              <ChevronDown size={14} strokeWidth={2} />
            </span>
          </button>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {KPIS.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </section>
      </main>
    </div>
  );
}
