export default function KpiCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className="w-11 h-11 shrink-0 rounded-md bg-indigo-50 flex items-center justify-center">
        <Icon size={20} strokeWidth={1.8} className="text-indigo-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}
