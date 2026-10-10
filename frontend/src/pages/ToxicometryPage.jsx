import { useState, useRef } from 'react';
import { calculateToxicometry } from '../api/toxicometry';
import { createToxicometryExperiment } from '../api/toxicometryExperiments';
import { downloadChartAsPng } from '../utils/downloadChart';
import { buildRegressionPoints, calcTheoreticalMortality } from '../utils/toxicometry';
import ToxicometryInputTable from '../components/toxicometry/ToxicometryInputTable';
import ToxicometryChart from '../components/toxicometry/ToxicometryChart';
import ToxicometryResults from '../components/toxicometry/ToxicometryResults';
import SaveExperimentModal from '../components/shared/SaveExperimentModal';

export default function ToxicometryPage() {
  const [groups, setGroups] = useState([
    { dose: '', total: '', effect: '' },
    { dose: '', total: '', effect: '' },
    { dose: '', total: '', effect: '' },
    { dose: '', total: '', effect: '' }
  ]);

  const [results, setResults] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const chartContainerRef = useRef(null);

  const handleCalculate = async () => {
    try {
      const validGroups = groups.filter(g =>
      g.dose !== '' && g.total !== '' && g.effect !== ''
      );
      if (validGroups.length < 2) {
        alert('Заполните минимум 2 группы с разными дозами');
        return;
      }
      const uniqueDoses = new Set(validGroups.map(g => parseFloat(g.dose)));
      if (uniqueDoses.size < 2) {
         alert('Дозы должны быть разными для построения регрессии');
         return;
      }

      const data = await calculateToxicometry(validGroups);
      if (!data || data.ld16 == null) {
        alert('Не удалось рассчитать LD. Проверьте, что все дозы разные и заполнены.');
        setResults(null);
        return;
      }
      setResults(data);
    } catch (error) {
      console.error("Ошибка сервера:", error);
      alert("Не удалось выполнить расчет. Проверьте данные.");
      setResults(null);
    }
  };

  const handleSave = async ({ name, substance, notes }) => {
    setIsSaving(true);
    try {
      const validGroups = groups
        .filter(g => g.dose !== '' && g.total !== '' && g.effect !== '')
        .map(g => ({
          dose: parseFloat(g.dose),
          total: parseInt(g.total),
          effect: parseInt(g.effect),
        }));

      const payload = {
        name,
        substance,
        species: 'rat', 
        notes,
        groups: validGroups,
      };

      await createToxicometryExperiment(payload);
      alert('Исследование успешно сохранено!');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const experimentalData = groups
    .filter(g => g.dose !== '' && g.total !== '' && g.effect !== '')
    .map(g => ({
      dose: parseFloat(g.dose),
      mortality: (parseFloat(g.effect) / parseFloat(g.total)) * 100
    }))
    .filter(g => !isNaN(g.dose) && !isNaN(g.mortality))
    .sort((a, b) => a.dose - b.dose);

  const customXTicks = experimentalData.map(d => d.dose);

  let chartData = [...experimentalData];

  if (results && results.a && results.b && experimentalData.length > 1) {
    const minDose = experimentalData[0].dose;
    const maxDose = experimentalData[experimentalData.length - 1].dose;

    const regressionPoints = buildRegressionPoints(minDose, maxDose, results.a, results.b, 50);

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

          {results && (
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isSaving}
              className="mt-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Сохранение...' : '💾 Сохранить исследование'}
            </button>
          )}
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

      <SaveExperimentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}