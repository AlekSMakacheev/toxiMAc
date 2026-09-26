import { useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PharmacokineticsChart({ data }) {
  const chartRef = useRef(null);

  const downloadChart = () => {
    alert("Здесь мы подключим html2canvas для сохранения PNG!");
  };

  return (
    <div className="relative w-full h-[350px]">
      <button 
        onClick={downloadChart}
        className="absolute -top-12 right-0 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-1.5 px-3 rounded-md transition-colors border border-slate-200 z-10"
      >
        💾 Скачать график
      </button>
      
      <div ref={chartRef} className="w-full h-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
            {/* Делаем сетку бледной и пунктирной */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            
            {/* Оси с подписями единиц измерения */}
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
            
            {/* Улучшенная подсказка при наведении */}
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
              labelStyle={{ fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}
              formatter={(value) => [`${value} мкг/мл`, 'Концентрация']}
              labelFormatter={(label) => `Время: ${label} мин`}
            />
            
            {/* Area заменяет Line для заливки площади (AUC) полупрозрачным цветом */}
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