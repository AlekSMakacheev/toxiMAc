import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis
} from 'recharts';
import { CHART_COLORS } from '../../constants/colors';

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-md">
        <p className="font-bold text-slate-700">Доза: {data.dose.toFixed(2)} мг/кг</p>
        {data.mortality !== undefined && (
          <p className="text-rose-600">Факт. гибель: {data.mortality.toFixed(1)}%</p>
        )}
        {data.theoretical !== undefined && (
          <p className="text-emerald-600">Модель (Пробит): {data.theoretical.toFixed(1)}%</p>
        )}
      </div>
    );
  }
  return null;
}

export default function ToxicometryChart({
  chartData,
  customXTicks,
  results,
  downloadChart,
  chartContainerRef,
  hasData
}) {
  return (
    <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-slate-800">График зависимости «доза-эффект»</h2>

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

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 h-87.5" ref={chartContainerRef}>
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 25, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID} />

              <XAxis
                type="number"
                dataKey="dose"
                scale="log"
                domain={['auto', 'auto']}
                ticks={customXTicks}
                tickFormatter={(tick) => tick}
                tick={{ fill: '#1e293b', fontSize: 12 }}
                label={{
                  value: 'Доза (мг/кг), логарифмическая шкала',
                  position: 'insideBottom',
                  offset: -20,
                  fill: '#1e293b',
                  fontSize: 12
                }}
              />

              <YAxis
                type="number"
                dataKey="mortality"
                domain={[0, 100]}
                tick={{ fill: '#1e293b', fontSize: 12 }}
                label={{
                  value: 'Эффект (%)',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#1e293b',
                  fontSize: 12,
                  offset: 0
                }}
              />

              <ZAxis type="number" range={[100, 100]} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

              {results && (
                <Line
                  type="monotone"
                  dataKey="theoretical"
                  name="Регрессия"
                  stroke={CHART_COLORS.TOXICOMETRY_REGRESSION}
                  strokeWidth={1.5}
                  strokeDasharray={CHART_COLORS.TOXICOMETRY_REGRESSION_DASH}
                  dot={false}
                  activeDot={false}
                  connectNulls={true}
                />
              )}

              <Scatter name="Эксперимент" data={chartData} fill={CHART_COLORS.TOXICOMETRY_EXPERIMENT} />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center italic text-slate-400">
            Введите данные для построения графика
          </div>
        )}
      </div>
    </div>
  );
}