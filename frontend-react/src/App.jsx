import { useState } from 'react'
import Sidebar      from './components/Sidebar'
import Dashboard    from './pages/Dashboard'
import ScoreAccount from './pages/ScoreAccount'
import BatchUpload  from './pages/BatchUpload'
import Insights     from './pages/Insights'

const PAGES = {
  dashboard : { title: 'Dashboard',     sub: 'Real-time mule account monitoring',        component: Dashboard     },
  score     : { title: 'Score Account', sub: 'Get a live risk score for any account',     component: ScoreAccount  },
  batch     : { title: 'Batch Upload',  sub: 'Score multiple accounts from a CSV file',   component: BatchUpload   },
  insights  : { title: 'SHAP Insights', sub: 'Understand why accounts are flagged',       component: Insights      },
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const { title, sub, component: Page } = PAGES[page]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar page={page} setPage={setPage} />

      <main className="ml-56 flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex
          items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200
            rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span className="text-xs text-slate-500">Model online</span>
          </div>
        </header>

        <div className="flex-1 p-8">
          <Page />
        </div>
      </main>
    </div>
  )
}