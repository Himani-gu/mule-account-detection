import { useState } from 'react'
import axios from 'axios'

const FEATURES = [
  'F3898','F3914','F3908','F2686','F2956',
  'F162','F321','F3836','F996','F531'
]

const DEMO = {
  F3898:3.1, F3914:1.8, F3908:2.2, F2686:0.9,
  F2956:1.4, F162:0.6,  F321:1.1,  F3836:0.8,
  F996:0.5,  F531:0.3
}

export default function ScoreAccount() {
  const [values, setValues]   = useState({})
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (feat, val) =>
    setValues(v => ({ ...v, [feat]: val }))

  const handleScore = async () => {
    setLoading(true)
    try {
      const features = {}
      FEATURES.forEach(f => {
        if (values[f] !== '' && values[f] !== undefined)
          features[f] = parseFloat(values[f])
      })
      const res = await axios.post('/api/score', { features })
      setResult(res.data)
    } catch {
      alert('Error — make sure FastAPI server is running.')
    }
    setLoading(false)
  }

  const resultStyle = {
    alert  : { bg: 'bg-red-50',   border: 'border-red-200',   text: 'text-red-700',   label: '🚨 Suspicious — Alert raised' },
    review : { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: '⚠️ Requires manual review'    },
    safe   : { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: '✅ Legitimate account'        },
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="font-semibold text-slate-800 mb-1">Score a single account</p>
        <p className="text-xs text-slate-400 mb-6">
          Enter feature values to get a real-time risk score from the model
        </p>

        <div className="grid grid-cols-5 gap-4 mb-6">
          {FEATURES.map(feat => (
            <div key={feat}>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                {feat}
              </label>
              <input
                type="number"
                step="any"
                placeholder="value"
                value={values[feat] ?? ''}
                onChange={e => handleChange(feat, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg
                  focus:outline-none focus:border-blue-400 bg-white text-slate-800"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleScore}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white
              px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Scoring...' : '🔍 Score account'}
          </button>
          <button
            onClick={() => setValues(DEMO)}
            className="px-5 py-2.5 rounded-lg text-sm border border-slate-200
              text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Fill demo values
          </button>
          <button
            onClick={() => { setValues({}); setResult(null) }}
            className="px-5 py-2.5 rounded-lg text-sm border border-slate-200
              text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {result && (() => {
        const s = resultStyle[result.status]
        return (
          <div className={`rounded-xl border p-8 text-center ${s.bg} ${s.border}`}>
            <p className={`text-6xl font-bold mb-3 ${s.text}`}>
              {(result.risk_score * 100).toFixed(1)}%
            </p>
            <p className={`text-lg font-semibold mb-1 ${s.text}`}>{s.label}</p>
            <p className="text-sm text-slate-500">
              Risk score {result.risk_score} · Threshold {result.threshold}
            </p>
          </div>
        )
      })()}
    </div>
  )
}