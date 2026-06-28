import { useState } from 'react'
import { Upload } from 'lucide-react'
import axios from 'axios'
import StatusPill from '../components/StatusPill'

export default function BatchUpload() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState(null)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await axios.post('/api/batch', form)
      setResults(res.data.results)
      setSummary({
        total  : res.data.total,
        alert  : res.data.results.filter(r => r.status === 'alert').length,
        review : res.data.results.filter(r => r.status === 'review').length,
        safe   : res.data.results.filter(r => r.status === 'safe').length,
      })
    } catch {
      alert('Error — make sure FastAPI server is running.')
    }
    setLoading(false)
  }

  const download = () => {
    const csv = ['account,risk_score,status',
      ...results.map(r => `${r.account},${r.risk_score},${r.status}`)
    ].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'scored_accounts.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="font-semibold text-slate-800 mb-1">Batch account scoring</p>
        <p className="text-xs text-slate-400 mb-6">
          Upload a CSV file to score multiple accounts at once
        </p>

        <label className="flex flex-col items-center justify-center border-2 border-dashed
          border-slate-300 rounded-xl p-12 cursor-pointer hover:border-blue-400
          hover:bg-blue-50 transition-all group">
          <Upload size={36} className="text-slate-300 group-hover:text-blue-400 mb-3 transition-colors" />
          <p className="text-slate-500 font-medium mb-1">
            {loading ? 'Scoring accounts...' : 'Click to upload CSV'}
          </p>
          <p className="text-xs text-slate-400">Columns should include feature names</p>
          <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
        </label>
      </div>

      {summary && (
        <div className="flex gap-3">
          {[
            { label: `Total: ${summary.total}`,   color: 'bg-blue-50 text-blue-700 border-blue-200'    },
            { label: `Alerts: ${summary.alert}`,  color: 'bg-red-50 text-red-700 border-red-200'       },
            { label: `Review: ${summary.review}`, color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { label: `Safe: ${summary.safe}`,     color: 'bg-green-50 text-green-700 border-green-200' },
          ].map(c => (
            <span key={c.label}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${c.color}`}>
              {c.label}
            </span>
          ))}
        </div>
      )}

      {results && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Account</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Risk score</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Risk bar</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-800">{r.account}</td>
                  <td className="px-5 py-3 text-slate-600">{r.risk_score.toFixed(4)}</td>
                  <td className="px-5 py-3">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{
                          width: `${r.risk_score * 100}%`,
                          background: r.status === 'alert'  ? '#ef4444'
                                    : r.status === 'review' ? '#f59e0b' : '#22c55e'
                        }} />
                    </div>
                  </td>
                  <td className="px-5 py-3"><StatusPill status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-slate-100">
            <button onClick={download}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2
                rounded-lg text-sm font-medium transition-colors">
              Download results CSV
            </button>
          </div>
        </div>
      )}
    </div>
  )
}