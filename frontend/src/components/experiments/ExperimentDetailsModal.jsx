import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { formatDate } from '../../utils/formatters';

export default function ExperimentDetailsModal({
  isOpen,
  onClose,
  experiment,
  type,
  onDelete,
  onOpenInCalculator,
}) {
  if (!isOpen || !experiment) return null;

  const isKinetic = type === 'kinetic';

  // Данные для мини-графика
  const chartData = isKinetic
    ? [...(experiment.points || [])]
        .sort((a, b) => a.time - b.time)
        .map(p => ({
          x: p.time,
          y: p.concentration,
        }))
    : [...(experiment.groups || [])]
        .sort((a, b) => a.dose - b.dose)
        .map(g => ({
          x: g.dose,
          y: (g.effect / g.total) * 100,
        }));

  return (
    <div
      className="fixed inset-0 bg-slate-700 bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex justify-between items-start p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {experiment.name}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isKinetic ? 'Токсикокинетика' : 'Токсикометрия'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Основное */}
        <div className="p-6 space-y-5">

          {/* Мета */}
          <div className="grid grid-cols-2 gap-4">
            <InfoBlock label="Вещество" value={experiment.substance || '—'} />

            {isKinetic && (
              <>
                <InfoBlock label="Доза" value={`${experiment.dose} мг`} />
                <InfoBlock label="Путь введения" value={experiment.route || '—'} />
                <InfoBlock label="Точек" value={experiment.points?.length || 0} />
              </>
            )}

            {!isKinetic && (
              <>
                <InfoBlock label="Вид животного" value={experiment.species || '—'} />
                <InfoBlock label="Групп" value={experiment.groups?.length || 0} />
              </>
            )}

            <InfoBlock label="Дата" value={formatDate(experiment.createdAt)} />
          </div>

          {/* Заметки */}
          {experiment.notes && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Заметки
              </p>
              <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 leading-relaxed">
                {experiment.notes}
              </div>
            </div>
          )}

          {/* Мини-график */}
          {chartData.length > 1 && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {isKinetic ? 'Кривая концентрация–время' : 'Кривая доза–эффект'}
              </p>
              <div className="bg-slate-50 rounded-lg p-3 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  {isKinetic ? (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="x" fontSize={11} stroke="#94a3b8" />
                      <YAxis fontSize={11} stroke="#94a3b8" />
                      <Tooltip
                        formatter={(value) => [`${value} мкг/мл`, 'Концентрация']}
                        labelFormatter={(label) => `Время: ${label} мин`}
                      />
                      <Line
                        type="monotone"
                        dataKey="y"
                        stroke="#4f46e5"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#e11d48' }}
                      />
                    </LineChart>
                  ) : (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="x"
                        fontSize={11}
                        stroke="#94a3b8"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                      />
                      <YAxis
                        fontSize={11}
                        stroke="#94a3b8"
                        type="number"
                        domain={[0, 100]}
                      />
                      <Tooltip
                        formatter={(value) => [`${value.toFixed(1)}%`, 'Летальность']}
                        labelFormatter={(label) => `Доза: ${label} мг/кг`}
                      />
                      <Line
                        type="monotone"
                        dataKey="y"
                        stroke="#4f46e5"
                        strokeWidth={2}
                        dot={{ r: 5, fill: '#e11d48', strokeWidth: 0 }}
                        activeDot={{ r: 7, fill: '#e11d48' }}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Таблица точек/групп */}
          {isKinetic && experiment.points?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Точки измерения
              </p>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Время (мин)</th>
                      <th className="px-3 py-2 text-left font-medium">Концентрация (мкг/мл)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...experiment.points]
                      .sort((a, b) => a.time - b.time)
                      .map((p, i) => (
                        <tr key={i} className="border-t border-slate-100">
                          <td className="px-3 py-1.5">{p.time}</td>
                          <td className="px-3 py-1.5">{p.concentration}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!isKinetic && experiment.groups?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Группы
              </p>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Доза (мг/кг)</th>
                      <th className="px-3 py-2 text-left font-medium">Всего</th>
                      <th className="px-3 py-2 text-left font-medium">Эффект</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...experiment.groups]
                      .sort((a, b) => a.dose - b.dose)
                      .map((g, i) => (
                        <tr key={i} className="border-t border-slate-100">
                          <td className="px-3 py-1.5">{g.dose}</td>
                          <td className="px-3 py-1.5">{g.total}</td>
                          <td className="px-3 py-1.5">{g.effect}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onDelete}
            className="px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
          >
            Удалить
          </button>

          <button
            onClick={onOpenInCalculator}
            className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Открыть в расчёте
          </button>
        </div>
      </div>
    </div>
  );
}

// Плашка с полем
function InfoBlock({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}