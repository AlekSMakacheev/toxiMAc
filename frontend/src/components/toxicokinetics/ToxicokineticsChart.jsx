import { useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PharmacokineticsChart({ data }) {
  const chartRef = useRef(null);

  // Проверяем, есть ли достаточно данных для построения графика
  const validPoints = data ? data.filter(p => 
    p.time !== '' && p.concentration !== '' && 
    p.time != null && p.concentration != null
  ) : [];
  
  const hasValidData = validPoints.length >= 2;

  const downloadChart = () => {
    alert("Здесь мы подключим html2canvas для сохранения PNG!");
  };

  // Если данных недостаточно — показываем заглушку
  if (!hasValidData) {
    return (
      <div className="relative w-full h-87.5 flex items-center justify-center">
        <p className="text-slate-400 italic text-sm">
          Введите данные для построения графика
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-87.5">
      <button 
        onClick={downloadChart}
        className="absolute -top-12 right-0 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-1.5 px-3 rounded-md transition-colors border border-slate-200 z-10"
      >
        💾 Скачать PNG
      </button>
      
      <div ref={chartRef} className="w-full h-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={validPoints} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
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
      </div>
    </div>
  );
}