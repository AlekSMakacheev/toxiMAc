import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function ToxicokineticsChart({
  data,
  hasData,
  downloadChart,
  chartContainerRef
}) {
  return (
    <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-700">График</h2>

        {hasData && (
          <button
            onClick={downloadChart}
            className="text-sm px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded-md transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Скачать PNG
          </button>
        )}
      </div>

      <div
        className="bg-slate-50 border border-slate-200 rounded-lg p-4 h-87.5"
        ref={chartContainerRef}
      >
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

              <XAxis
                dataKey="time"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{ value: 'Время (мин)', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 13 }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{ value: 'Концентрация (мкг/мл)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, fill: '#475569', fontSize: 13 }}
              />

              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
                labelStyle={{ fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}
                formatter={(value) => [`${value} мкг/мл`, 'Концентрация']}
                labelFormatter={(label) => `Время: ${label} мин`}
              />

              <Area
                type="monotone"
                dataKey="concentration"
                stroke="#4f46e5"
                strokeWidth={3}
                fill="#818cf8"
                fillOpacity={0.2}
                activeDot={{ r: 7, strokeWidth: 0, fill: '#4f46e5', style: { filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' } }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-400">
            Введите данные для построения графика
          </div>
        )}
      </div>
    </div>
  );
}