import { useState, useRef } from 'react';
import ToxicometryInputTable from './ToxicometryInputTable';
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

export default function ToxicometryDashboard() {
  const [groups, setGroups] = useState([
    { dose: '', total: '', dead: '' },
    { dose: '', total: '', dead: '' },
    { dose: '', total: '', dead: '' },
    { dose: '', total: '', dead: '' }
  ]);

  const [results, setResults] = useState(null);
  const chartContainerRef = useRef(null); // Реф для захвата графика при скачивании

  const handleCalculate = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/toxicometry/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groups: groups })
      });

      if (!response.ok) throw new Error('Ошибка при расчете на сервере');
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Ошибка сервера:", error);
      alert("Не удалось выполнить расчет. Проверьте данные.");
    }
  };

  // Нативная функция скачивания графика в PNG
  const downloadChart = () => {
    const chartNode = chartContainerRef.current;
    if (!chartNode) return;
    const svg = chartNode.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = svg.clientWidth || 800;
      canvas.height = svg.clientHeight || 400;
      
      // Заливаем белый фон, иначе PNG будет прозрачным
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const a = document.createElement('a');
      a.download = 'dose-effect-chart.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const experimentalData = groups
    .filter(g => g.dose !== '' && g.total !== '' && g.dead !== '')
    .map(g => ({
      dose: parseFloat(g.dose),
      mortality: (parseFloat(g.dead) / parseFloat(g.total)) * 100
    }))
    .filter(g => !isNaN(g.dose) && !isNaN(g.mortality))
    .sort((a, b) => a.dose - b.dose);

  // Массив реальных доз для оси X (чтобы убрать лишние автоматические засечки)
  const customXTicks = experimentalData.map(d => d.dose);

  let chartData = [...experimentalData];

  if (results && results.a && results.b && experimentalData.length > 1) {
    const minDose = experimentalData[0].dose;
    const maxDose = experimentalData[experimentalData.length - 1].dose;

    const calcTheoretical = (d) => {
      const probit = results.a + results.b * Math.log10(d);
      const z = probit - 5.0;
      const sign = z < 0 ? -1 : 1;
      const x = Math.abs(z) / Math.SQRT2;
      const t = 1.0 / (1.0 + 0.3275911 * x);
      const erf = 1.0 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
      return 0.5 * (1.0 + sign * erf) * 100;
    };

    const steps = 50;
    const logMin = Math.log10(minDose / 1.5);
    const logMax = Math.log10(maxDose * 1.5);
    const stepSize = (logMax - logMin) / steps;

    const regressionPoints = [];
    for (let i = 0; i <= steps; i++) {
      const currentDose = Math.pow(10, logMin + stepSize * i);
      regressionPoints.push({
        dose: currentDose,
        theoretical: calcTheoretical(currentDose)
      });
    }

    chartData = chartData.map(pt => ({
      ...pt,
      theoretical: calcTheoretical(pt.dose)
    }));

    chartData = [...chartData, ...regressionPoints].sort((a, b) => a.dose - b.dose);
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-md">
          <p className="font-bold text-slate-700">Доза: {data.dose.toFixed(2)} мг/кг</p>
          {data.mortality !== undefined && (
            <p className="text-rose-600">Факт. гибель: {data.mortality.toFixed(1)}%</p>
          )}
          {data.theoretical !== undefined && (
            <p className="text-indigo-600">Модель (Пробит): {data.theoretical.toFixed(1)}%</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-1 bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Данные групп (In vivo)</h2>
          <div className="flex-1 overflow-hidden min-h-[300px] mb-4">
            <ToxicometryInputTable groups={groups} setGroups={setGroups} />
          </div>
          <button 
            onClick={handleCalculate}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm transition-colors"
          >
            Рассчитать летальные дозы
          </button>
        </div>

        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Кривая «Доза-Эффект»</h2>
            
            {/* Кнопка скачивания появляется только если есть данные */}
            {experimentalData.length > 0 && (
              <button 
                onClick={downloadChart}
                className="text-sm px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded-md transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/ নিরাপদ" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Скачать PNG
              </button>
            )}
          </div>
          
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-4 h-full w-full" ref={chartContainerRef}>
            {experimentalData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 25, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  
                  {/* Строго заданные ticks и ненавязчивые подписи */}
                  <XAxis 
                    type="number" 
                    dataKey="dose" 
                    scale="log"
                    domain={['auto', 'auto']}
                    ticks={customXTicks}
                    tickFormatter={(tick) => tick}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    label={{ 
                      value: 'Доза (мг/кг), логарифмическая шкала', 
                      position: 'insideBottom', 
                      offset: -20, 
                      fill: '#94a3b8', 
                      fontSize: 12 
                    }}
                  />
                  
                  <YAxis 
                    type="number" 
                    dataKey="mortality" 
                    domain={[0, 100]}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    label={{ 
                      value: 'Летальность (%)', 
                      angle: -90, 
                      position: 'insideLeft', 
                      fill: '#94a3b8', 
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
                      stroke="#4f46e5" 
                      strokeWidth={1.5} 
                      strokeDasharray="5 5"
                      dot={false} 
                      activeDot={false}
                      connectNulls={true}
                    />
                  )}
                  
                  <Scatter name="Эксперимент" data={chartData} fill="#e11d48" />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-400">
                Введите данные для построения графика
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Результаты токсикометрии</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex flex-col justify-center">
            <p className="text-emerald-700 font-bold mb-1">LD16</p>
            <p className="text-xl font-black text-emerald-900">{results ? results.ld16.toFixed(2) : '-'}</p>
          </div>
          <div className="p-4 bg-rose-50 rounded-lg border border-rose-100 shadow-sm relative flex flex-col justify-center">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">MAIN</div>
            <p className="text-rose-700 font-bold mb-1">LD50</p>
            <p className="text-2xl font-black text-rose-900 flex items-baseline justify-center">
              {results ? (
                <>
                  {results.ld50.toFixed(2)}
                  {results.ld50Error > 0 && (
                    <span className="text-sm font-medium text-rose-700 ml-1">± {results.ld50Error.toFixed(2)}</span>
                  )}
                </>
              ) : '-'}
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 flex flex-col justify-center">
            <p className="text-amber-700 font-bold mb-1">LD84</p>
            <p className="text-xl font-black text-amber-900">{results ? results.ld84.toFixed(2) : '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}