import { useState, useRef } from 'react';
import { calculateToxicokinetics } from '../api/toxicokinetics';
import { createToxicokineticExperiment } from '../api/toxicokineticExperiments';
import { downloadChartAsPng } from '../utils/downloadChart';
import ToxicokineticsChart from '../components/toxicokinetics/ToxicokineticsChart';
import ToxicokineticsInputTable from '../components/toxicokinetics/ToxicokineticsInputTable';
import ToxicokineticsResults from '../components/toxicokinetics/ToxicokineticsResults';
import ExpertAiPanel from '../components/shared/ExpertAiPanel';
import SaveExperimentModal from '../components/shared/SaveExperimentModal';

export default function ToxicokineticsPage() {
  const [dose, setDose] = useState('');
  const [points, setPoints] = useState([
    { time: '', concentration: '' },
    { time: '', concentration: '' }
  ]);
  
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const chartContainerRef = useRef(null);

  // Отсортированные точки для графика
  const validPoints = points
    .filter(p => 
      p.time !== '' && p.concentration !== '' && 
      p.time != null && p.concentration != null
    )
    .sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
  
  const hasData = validPoints.length >= 2;

  const handleCalculate = async () => {
    const filledPoints = points.filter(p =>
      p.time !== '' && p.concentration !== '' &&
      p.time != null && p.concentration != null
    );

    if (filledPoints.length < 2) {
      alert('Заполните минимум 2 точки (время + концентрация)');
      return;
    }

    // Проверка: время по возрастанию
    const timesRaw = filledPoints.map(p => parseFloat(p.time));
    const isSorted = timesRaw.every((t, i) => i === 0 || t >= timesRaw[i - 1]);

    if (!isSorted) {
      alert('Порядок точек будет автоматически отсортирован по времени');
    }

    // Сортировка по времени
    const sortedPoints = [...filledPoints].sort(
      (a, b) => parseFloat(a.time) - parseFloat(b.time)
    );

    // Проверка уникальности времени
    const times = sortedPoints.map(p => p.time);
    if (new Set(times).size < times.length) {
      alert('Значения времени не должны повторяться');
      return;
    }

    // Проверка роста концентрации
    const first = parseFloat(sortedPoints[0].concentration);
    const last = parseFloat(sortedPoints[sortedPoints.length - 1].concentration);

    if (last > first) {
      const proceed = window.confirm(
        'Концентрация растёт со временем — это может быть фаза всасывания, а не элиминации. ' +
        'Расчёт NCA может дать некорректные результаты. Продолжить?'
      );
      if (!proceed) return;
    }

    setIsCalculating(true);
    try {
      const data = await calculateToxicokinetics(dose, sortedPoints);
      setResults(data);
    } catch (error) {
      console.error('Ошибка расчета:', error);
      alert('Ошибка расчёта. Проверьте данные.');
      setResults(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSave = async ({ name, substance, notes }) => {
    setIsSaving(true);
    try {
      const payload = {
        name,
        substance,
        dose: parseFloat(dose) || 0,
        route: 'IV',
        notes,
        points: validPoints.map(p => ({
          time: parseFloat(p.time),
          concentration: parseFloat(p.concentration),
        })),
      };

      await createToxicokineticExperiment(payload);
      alert('Исследование успешно сохранено!');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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

          {results && (
            <button 
              onClick={() => setIsModalOpen(true)}
              disabled={isSaving}
              className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {isSaving ? 'Сохранение...' : '💾 Сохранить исследование'}
            </button>
          )}
        </div>

        <ToxicokineticsChart 
          data={validPoints}
          hasData={hasData}
          downloadChart={() => downloadChartAsPng(chartContainerRef, 'toxicokinetics-chart.png')}
          chartContainerRef={chartContainerRef}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-lg font-bold text-slate-700 mb-4 border-b border-slate-100 pb-2">
          Результаты анализа и заключение
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ToxicokineticsResults results={results} />
          <ExpertAiPanel />
        </div>
      </div>

      <SaveExperimentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}