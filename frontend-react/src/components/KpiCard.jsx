export default function KpiCard({ label, value, sub, icon: Icon, color }) {
  const colors = {
    blue  : 'bg-blue-50 text-blue-700',
    red   : 'bg-red-50 text-red-700',
    green : 'bg-green-50 text-green-700',
    amber : 'bg-amber-50 text-amber-700',
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}