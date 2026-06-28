const INSIGHTS = [
  { feat:'F3898', shap:2.01, desc:'Strongest signal after leakage removal — unusual transaction volume pattern.'     },
  { feat:'F3914', shap:0.53, desc:'Captures cross-channel fund movement behaviour typical of mule accounts.'         },
  { feat:'F3908', shap:0.35, desc:'Rapid consecutive fund transfer pattern — classic mule account behaviour.'         },
  { feat:'F2686', shap:0.35, desc:'Deviation from normal transaction timing — unusual hour or frequency.'            },
  { feat:'F2956', shap:0.30, desc:'Bank-provided hint feature confirmed as relevant by SHAP analysis.'               },
  { feat:'F162',  shap:0.28, desc:'Account dormancy followed by sudden high-value activity spike.'                   },
  { feat:'F321',  shap:0.26, desc:'Bank-provided hint feature — counterparty diversity indicator.'                   },
  { feat:'F3836', shap:0.25, desc:'Bank-provided hint feature — round-amount transaction frequency signal.'          },
  { feat:'F996',  shap:0.23, desc:'Supplementary risk signal supporting overall fraud score.'                        },
]

const MAX_SHAP = 2.01

export default function Insights() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="font-semibold text-slate-800 mb-1">SHAP feature importance</p>
        <p className="text-xs text-slate-400 mb-6">
          Why the model flags accounts — F3912 removed (post-fraud system flag / target leakage)
        </p>
        <div className="space-y-3">
          {INSIGHTS.map((item, i) => (
            <div key={item.feat} className="flex items-center gap-4">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 text-xs
                font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span className="w-14 text-sm font-semibold text-slate-700 flex-shrink-0">
                {item.feat}
              </span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${(item.shap / MAX_SHAP) * 100}%` }} />
              </div>
              <span className="w-12 text-xs text-slate-400 text-right flex-shrink-0">
                {item.shap.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="font-semibold text-slate-800 mb-4">What each feature means</p>
        <div className="divide-y divide-slate-100">
          {INSIGHTS.map((item, i) => (
            <div key={item.feat} className="flex gap-4 py-4">
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 text-xs
                font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-0.5">{item.feat}</p>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}