import { useState, useRef } from 'react';
import { calculateToxicometry } from '../api/toxicometry';
import { downloadChartAsPng } from '../utils/downloadChart';
import { buildRegressionPoints, calcTheoreticalMortality } from '../utils/toxicometry';
import ToxicometryInputTable from '../components/toxicometry/ToxicometryInputTable';
import ToxicometryChart from '../components/toxicometry/ToxicometryChart';
import ToxicometryResults from '../components/toxicometry/ToxicometryResults';

export default function ToxicometryPage() {
  const [groups, setGroups] = useState([
    { dose: '', total: '', dead: '' },
    { dose: '', total: '', dead: '' },
    { dose: '', total: '', dead: '' },
    { dose: '', total: '', dead: '' }
  ]);

  const [results, setResults] = useState(null);
  const chartContainerRef = useRef(null);

  const handleCalculate = async () => {
    try {
      const data = await calculateToxicometry(groups);
      setResults(data);
    } catch (error) {
      console.error("Ошибка сервера:", error);
      alert("Не удалось выполнить расчет. Проверьте данные.");
    }
  };

  const experimentalData = groups
    .filter(g => g.dose !== '' && g.total !== '' && g.dead !== '')
    .map(g => ({
      dose: parseFloat(g.dose),
      mortality: (parseFloat(g.dead) / parseFloat(g.total)) * 100
    }))
    .filter(g => !isNaN(g.dose) && !isNaN(g.mortality))
    .sort((a, b) => a.dose - b.dose);

  const customXTicks = experimentalData.map(d => d.dose);

  let chartData = [...experimentalData];

  if (results && results.a && results.b && experimentalData.length > 1) {
    const minDose = experimentalData[0].dose;
    const maxDose = experimentalData[experimentalData.length - 1].dose;

    // Точки регрессии — из utils
    const regressionPoints = buildRegressionPoints(minDose, maxDose, results.a, results.b, 50);

    // Теоретические значения для экспериментальных точек
    chartData = chartData.map(pt => ({
      ...pt,
      theoretical: calcTheoreticalMortality(pt.dose, results.a, results.b)
    }));

    chartData = [...chartData, ...regressionPoints].sort((a, b) => a.dose - b.dose);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div className="lg:col-span-1 bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4 text-center">Экспериментальные данные</h2>
          <div className="flex-1 overflow-hidden min-h-75 mb-4">
            <ToxicometryInputTable groups={groups} setGroups={setGroups} />
          </div>
          <button
            onClick={handleCalculate}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm transition-colors"
          >
            Рассчитать дозы
          </button>
        </div>

        <ToxicometryChart
          chartData={chartData}
          customXTicks={customXTicks}
          results={results}
          downloadChart={() => downloadChartAsPng(chartContainerRef, 'dose-effect-chart.png')}
          chartContainerRef={chartContainerRef}
          hasData={experimentalData.length > 0}
        />
      </div>

      <ToxicometryResults results={results} />
    </div>
  );
}