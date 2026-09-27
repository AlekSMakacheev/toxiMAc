import ParameterCard from '../shared/ParameterCard';

export default function AnalysisResults({ results }) {
  // Если данных нет — показываем заглушку
  if (!results) {
    return (
      <div className="h-full">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 h-full shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
            Результаты анализа
          </h3>
          <p className="text-slate-400 italic text-sm">
            Введите данные и нажмите «Рассчитать»
          </p>
        </div>
      </div>
    );
  }

  // Проверяем, есть ли карточки от бэкенда
  const hasCards = results.cards && results.cards.length > 0;

  return (
    <div className="h-full space-y-4">

      {/* ============================================================
          1. КАРТОЧКИ ПАРАМЕТРОВ (главный блок)
          ============================================================ */}
      {hasCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.cards.map((card) => (
            <ParameterCard key={card.id} {...card} />
          ))}
        </div>
      )}

      {/* ============================================================
          2. ЭКСПЕРТНОЕ ЗАКЛЮЧЕНИЕ (summary)
          ============================================================ */}
      {results.summary && (
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-5 shadow-sm">
          <h3 className="font-semibold text-purple-900 mb-2">
            🧠 {results.summary.headline}
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {results.summary.text}
          </p>
          {results.summary.warnings && results.summary.warnings.length > 0 && (
            <ul className="mt-3 text-sm text-red-700 list-disc list-inside space-y-1">
              {results.summary.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ============================================================
          3. СЫРЫЕ ЗНАЧЕНИЯ (сворачиваемая таблица для справки)
          ============================================================ */}
      <details className="bg-slate-50 rounded-lg border border-slate-100 shadow-sm">
        <summary className="cursor-pointer p-4 font-bold text-xs text-slate-500 uppercase tracking-wider hover:bg-slate-100 transition-colors rounded-lg">
          📊 Показать все параметры (сырые значения)
        </summary>

        <div className="p-4 pt-0 space-y-2 text-sm text-slate-700">
          <Row label="Cmax" tooltip="Максимальная концентрация"
               value={results.cmax} unit={results.units?.cmax} />
          <Row label="Tmax" tooltip="Время достижения максимума"
               value={results.tmax} unit={results.units?.tmax} />
          <Row label="AUC" tooltip="Площадь под кривой"
               value={results.auc} unit={results.units?.auc} />
          <Row label="AUMC" tooltip="Площадь под кривой первого момента"
               value={results.aumc} unit={results.units?.aumc} />
          <Row label="Kel" tooltip="Константа элиминации"
               value={results.kel} unit={results.units?.kel} />
          <Row label="t½" tooltip="Период полувыведения"
               value={results.halfLife} unit={results.units?.halfLife} />
          <Row label="MRT" tooltip="Среднее время удержания"
               value={results.mrt} unit={results.units?.mrt} />
          <Row label="CL" tooltip="Общий клиренс"
               value={results.clearance} unit={results.units?.clearance} />
          <Row label="Vd" tooltip="Объём распределения (терминальный)"
               value={results.volumeOfDistribution} unit={results.units?.volumeOfDistribution} />
          <Row label="Vss" tooltip="Стационарный объём распределения"
               value={results.vss} unit={results.units?.vss} />
        </div>
      </details>

    </div>
  );
}

// ============================================================
// Вспомогательный компонент для строки таблицы
// ============================================================
function Row({ label, tooltip, value, unit }) {
  return (
    <p className="flex justify-between border-b border-slate-200 pb-1 hover:bg-slate-100 px-1 rounded transition-colors">
      <span className="font-medium" title={tooltip}>
        {label}
        {unit && <span className="text-slate-400 text-xs ml-1">({unit})</span>}:
      </span>
      {value != null ? (
        <span className="font-bold text-indigo-600">{value.toFixed(4)}</span>
      ) : (
        <span className="text-slate-400 italic">—</span>
      )}
    </p>
  );
}