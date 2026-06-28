import { Shield, LayoutDashboard, Search, Upload, BarChart2 } from 'lucide-react'

const nav = [
  { id: 'dashboard', label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'score',     label: 'Score Account', icon: Search          },
  { id: 'batch',     label: 'Batch Upload',  icon: Upload          },
  { id: 'insights',  label: 'SHAP Insights', icon: BarChart2       },
]

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-slate-900 flex flex-col py-6 px-4 z-10">
      <div className="flex items-center gap-3 px-2 mb-8">
        <Shield className="text-blue-400" size={24} />
        <span className="text-white font-semibold text-lg">MuleGuard</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {nav.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
              ${page === id
                ? 'bg-blue-700 text-white font-medium'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="px-2">
        <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          <span className="text-slate-400 text-xs">Model online · AUC 0.85</span>
        </div>
      </div>
    </aside>
  )
}