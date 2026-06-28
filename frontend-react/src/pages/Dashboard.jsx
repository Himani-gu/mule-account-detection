import { useEffect, useState } from 'react'
import { Users, AlertTriangle, Award, SlidersHorizontal } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import KpiCard from '../components/KpiCard'
import axios from 'axios'

const METRICS = [
  { label: 'True Positives',  value: 11,   sub: 'Fraud correctly caught',   color: 'green' },
  { label: 'False Positives', value: 285,  sub: 'Legit flagged for review',  color: 'amber' },
  { label: 'False Negatives', value: 5,    sub: 'Fraud missed',              color: 'red'   },
  { label: 'True Negatives',  value: 1516, sub: 'Legit correctly cleared',   color: 'blue'  },
]

export default function Dashboard() {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    axios.get('/api/summary').then(r => setSummary(r.data))
  }, [])

  if (!summary) return (
    <div className="flex items-center justify-center h-64 text-slate-400">
      Loading...
    </div>
  )

  const pieData = [
    { name: 'Legitimate', value: 9001 },
    { name: 'Suspicious', value: 81   },
  ]

  return (
    <div className="space-y-6">

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Total accounts"  value={summary.total_accounts.toLocaleString()} sub="Full dataset"       icon={Users}             color="blue"  />
        <KpiCard label="Fraud flagged"   value={summary.fraud_flagged}                   sub="0.89% of accounts"  icon={AlertTriangle}      color="red"   />
        <KpiCard label="AUC-PR score"    value={summary.auc_pr}                          sub="Primary metric"     icon={Award}              color="green" />
        <KpiCard label="Alert threshold" value={summary.threshold}                       sub="Tuned via PR curve" icon={SlidersHorizontal}  color="amber" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">

        {/* SHAP bar chart */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <p className="font-semibold text-slate-800 mb-1">Top fraud signal features</p>
          <p className="text-xs text-slate-400 mb-4">by mean SHAP value — F3912 removed (target leakage)</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={summary.top_features} layout="vertical"
              margin={{ left: 10, right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="feature" type="category" tick={{ fontSize: 12 }} width={55} />
              <Tooltip formatter={(v) => v.toFixed(4)} />
              <Bar dataKey="shap" fill="#2563eb" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="font-semibold text-slate-800 mb-1">Class distribution</p>
          <p className="text-xs text-slate-400 mb-4">legitimate vs suspicious</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%"
                innerRadius={50} outerRadius={80}
                dataKey="value">
                <Cell fill="#3b82f6" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>Legitimate
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>Suspicious
            </span>
          </div>
        </div>
      </div>

      {/* Confusion matrix metrics */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <p className="font-semibold text-slate-800 mb-4">Model performance breakdown</p>
        <div className="grid grid-cols-4 gap-3">
          {METRICS.map(m => (
            <div key={m.label} className="bg-slate-50 rounded-lg p-4 text-center border border-slate-100">
              <p className={`text-2xl font-bold mb-1
                ${m.color === 'green' ? 'text-green-600' :
                  m.color === 'red'   ? 'text-red-600'   :
                  m.color === 'amber' ? 'text-amber-600' : 'text-blue-600'}`}>
                {m.value}
              </p>
              <p className="text-xs font-medium text-slate-700">{m.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{m.sub}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}