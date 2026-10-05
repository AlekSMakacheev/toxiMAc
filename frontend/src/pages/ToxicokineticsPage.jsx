import { useState, useRef } from 'react';
import { calculateToxicokinetics } from '../api/toxicokinetics';
import { downloadChartAsPng } from '../utils/downloadChart';
import ToxicokineticsChart from '../components/toxicokinetics/ToxicokineticsChart';
import ToxicokineticsInputTable from '../components/toxicokinetics/ToxicokineticsInputTable';
import ToxicokineticsResults from '../components/toxicokinetics/ToxicokineticsResults';
import ExpertAiPanel from '../components/shared/ExpertAiPanel';

export default function ToxicokineticsPage() {
  const [dose, setDose] = useState('');
  const [points, setPoints] = useState([
    { time: '', concentration: '' },
    { time: '', concentration: '' }
  ]);
  
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const chartContainerRef = useRef(null);

  // Проверяем, есть ли достаточно данных для графика
  const validPoints = points.filter(p => 
    p.time !== '' && p.concentration !== '' && 
    p.time != null && p.concentration != null
  );
  const hasData = validPoints.length >= 2;

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const data = await calculateToxicokinetics(dose, points);
      setResults(data);
    } catch (error) {
      console.error('Ошибка расчета:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Ввод данных */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <h2 className="text-lg font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2 text-center">
            Экспериментальные данные
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-600 mb-1">Доза (мг):</label>
            <input 
              type="number" 
              value={dose} 
              onChange={(e) => setDose(e.target.value)} 
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              placeholder="Например, 1000"
            />
          </div>
          <div className="flex-1 overflow-auto">
            <ToxicokineticsInputTable points={points} setPoints={setPoints} />
          </div>
          <button 
            onClick={handleCalculate}
            disabled={isCalculating}
            className="mt-4 w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {isCalculating ? 'Считаем...' : 'Рассчитать'}
          </button>
        </div>

        <ToxicokineticsChart 
          data={validPoints}
          hasData={hasData}
          downloadChart={() => downloadChartAsPng(chartContainerRef, 'toxicokinetics-chart.png')}
          chartContainerRef={chartContainerRef}
        />
      </div>

      {/* Результаты */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-lg font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2">
          Результаты анализа и заключение
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ToxicokineticsResults results={results} />
          <ExpertAiPanel />
        </div>
      </div>
    </div>
  );
}