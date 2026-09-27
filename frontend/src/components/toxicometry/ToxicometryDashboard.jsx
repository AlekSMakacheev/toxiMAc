import { useState, useRef } from 'react';
import ToxicometryInputTable from './ToxicometryInputTable';
import ToxicometryChart from './ToxicometryChart';
import ToxicometryResults from './ToxicometryResults';

export default function ToxicometryDashboard() {
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
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

      const response = await fetch(`${API_URL}/toxicometry/calculate`, {
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

        <ToxicometryChart
          chartData={chartData}
          customXTicks={customXTicks}
          results={results}
          downloadChart={downloadChart}
          chartContainerRef={chartContainerRef}
          hasData={experimentalData.length > 0}
        />
      </div>

      <ToxicometryResults results={results} />
    </div>
  );
}