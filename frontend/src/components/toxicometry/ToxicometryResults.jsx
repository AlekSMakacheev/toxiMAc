export default function ToxicometryResults({ results }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Результаты токсикометрии</h2>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex flex-col justify-center">
          <p className="text-emerald-700 font-bold mb-1">LD<sub className="text-[0.6em]">16</sub></p>
          <p className="text-xl font-black text-emerald-900">
            {results ? results.ld16.toFixed(2) : '-'}
          </p>
        </div>

        <div className="p-4 bg-rose-50 rounded-lg border border-rose-100 shadow-sm relative flex flex-col justify-center">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            ДОЗА
          </div>
          <p className="text-rose-700 font-bold mb-1">LD<sub className="text-[0.6em]">50</sub></p>
          <p className="text-2xl font-black text-rose-900 flex items-baseline justify-center">
            {results ? (
              <>
                {results.ld50.toFixed(2)}
                {results.ld50Error > 0 && (
                  <span className="text-sm font-medium text-rose-700 ml-1">
                    ± {results.ld50Error.toFixed(2)}
                  </span>
                )}
              </>
            ) : '-'}
          </p>
        </div>

        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 flex flex-col justify-center">
          <p className="text-amber-700 font-bold mb-1">LD<sub className="text-[0.6em]">84</sub></p>
          <p className="text-xl font-black text-amber-900">
            {results ? results.ld84.toFixed(2) : '-'}
          </p>
        </div>
      </div>
    </div>
  );
}