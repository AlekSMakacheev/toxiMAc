import { useState, useEffect } from 'react';
import { getExperiments, deleteExperiment } from '../api/experiments';

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await getExperiments();
        if (!cancelled) setExperiments(data);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        if (!cancelled) setError('Не удалось загрузить исследования');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Удалить исследование «${name}»?`)) return;
    try {
      await deleteExperiment(id);
      setExperiments((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Ошибка удаления:', err);
      alert('Не удалось удалить');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center text-slate-400">
        Загрузка...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center text-rose-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">

      {/* Заголовок страницы */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Мои исследования</h1>
          <p className="text-sm text-slate-500 mt-1">
            Сохранённые эксперименты: {experiments.length}
          </p>
        </div>
      </div>

      {/* Пустое состояние */}
      {experiments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-16 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📭</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            Нет сохранённых исследований
          </h3>
          <p className="text-slate-500 text-sm">
            Создайте исследование на странице «Токсикокинетика» и нажмите «Сохранить»
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {experiments.map((exp) => (
            <ExperimentCard
              key={exp.id}
              experiment={exp}
              onDelete={() => handleDelete(exp.id, exp.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Карточка исследования
// ============================================================
function ExperimentCard({ experiment, onDelete }) {
  return (
    <div className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-emerald-200 transition-all duration-200 overflow-hidden">

      {/* Цветная полоска сверху */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>

      <div className="p-5">

        {/* Заголовок + кнопка удаления */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-xl">🧪</span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg truncate" title={experiment.name}>
              {experiment.name}
            </h3>
          </div>

          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
            title="Удалить исследование"
          >
            ×
          </button>
        </div>

        {/* Данные */}
        <div className="space-y-2.5">

          <div className="flex items-start gap-2">
            <span className="text-sm text-slate-400 shrink-0 w-20">Вещество:</span>
            <span className="text-sm font-medium text-slate-700 truncate">
              {experiment.substance}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-sm text-slate-400 shrink-0 w-20">Доза:</span>
            <span className="text-sm font-medium text-slate-700">
              {experiment.dose} мг
              {experiment.route && (
                <span className="ml-1.5 text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  {experiment.route}
                </span>
              )}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-sm text-slate-400 shrink-0 w-20">Точек:</span>
            <span className="text-sm font-medium text-slate-700">
              {experiment.points?.length || 0}
            </span>
          </div>

        </div>

        {/* Дата */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
          <span>📅</span>
          <span>{formatDate(experiment.createdAt)}</span>
        </div>

        {/* Заметки */}
        {experiment.notes && (
          <div className="mt-3 bg-slate-50 rounded-lg p-2.5 text-xs text-slate-600 leading-relaxed">
            {experiment.notes}
          </div>
        )}

      </div>
    </div>
  );
}

// ============================================================
// Форматирование даты
// ============================================================
function formatDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year}, ${hours}:${minutes}`;
}