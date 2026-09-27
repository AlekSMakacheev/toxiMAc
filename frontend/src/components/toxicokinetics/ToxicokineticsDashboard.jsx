import { useState } from 'react';
import PharmacokineticsChart from './PharmacokineticsChart';
import DataInputTable from './DataInputTable';
import AnalysisResults from './AnalysisResults';
import ExpertAiPanel from '../shared/ExpertAiPanel';

export default function ToxicokineticsDashboard() {
  const [dose, setDose] = useState('');
  const [points, setPoints] = useState([
    { time: '', concentration: '' },
    { time: '', concentration: '' }
  ]);
  
  // Состояние для хранения результатов от Java и индикатора загрузки
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Функция связи с нашим Spring Boot сервером
  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const requestData = {
        dose: parseFloat(dose),
        points: points.map(p => ({
          time: parseFloat(p.time),
          concentration: parseFloat(p.concentration)
        }))
      };

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

      const response = await fetch(`${API_URL}/calculate/toxicokinetics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error('Ошибка сервера');
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Ввод данных */}
        <div className="xl:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <h2 className="text-lg font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2">
            Экспериментальные данные
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-600 mb-1">Доза (мг):</label>
            <input 
              type="number" 
              value={dose} 
              onChange={(e) => setDose(e.target.value)} 
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Например, 1000"
            />
          </div>
          <div className="flex-1 overflow-auto">
            <DataInputTable points={points} setPoints={setPoints} />
          </div>
          <button 
            onClick={handleCalculate}
            disabled={isCalculating}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {isCalculating ? 'Считаем...' : 'Рассчитать'}
          </button>
        </div>

        {/* График */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h2 className="text-lg font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2">График</h2>
          <div className="[&>div]:border-none [&>div]:shadow-none [&>div]:p-0 [&>div]:mb-0">
            <PharmacokineticsChart data={points} />
          </div>
        </div>
      </div>

      {/* Результаты */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-lg font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2">
          Результаты анализа и Заключение
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnalysisResults results={results} />
          <ExpertAiPanel />
        </div>
      </div>
    </div>
  );
}