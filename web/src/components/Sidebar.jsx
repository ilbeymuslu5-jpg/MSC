import {
  LayoutDashboard,
  Compass,
  Calendar,
  Handshake,
  Megaphone,
  Banknote,
  MessageSquare,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Genel Bakış', icon: LayoutDashboard, active: true },
  { label: 'Keşfet', icon: Compass },
  { label: 'Rezervasyonlar', icon: Calendar },
  { label: 'Anlaşmalar', icon: Handshake },
  { label: 'Kampanyalar', icon: Megaphone },
  { label: 'Gelir & Dağıtım', icon: Banknote },
  { label: 'Mesajlar', icon: MessageSquare },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white flex flex-col">
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="text-2xl font-bold text-gray-900 leading-none">[M]</span>
        <div>
          <p className="font-semibold text-gray-900 leading-tight">MSC Music</p>
          <p className="text-sm font-normal text-gray-500 leading-tight">Ecosystem</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              active
                ? 'bg-indigo-100 text-indigo-800'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-gray-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#EBE9FE]">
            <span className="text-sm font-semibold text-indigo-700">LB</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 leading-tight">Lil Bey</p>
            <p className="text-sm text-gray-500 leading-tight">Sanatçı</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
