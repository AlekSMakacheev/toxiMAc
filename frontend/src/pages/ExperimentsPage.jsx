import { useState, useEffect, useMemo } from 'react';
import {
  getToxicokineticExperiments,
  deleteToxicokineticExperiment
} from '../api/toxicokineticExperiments';
import {
  getToxicometryExperiments,
  deleteToxicometryExperiment
} from '../api/toxicometryExperiments';
import TabButton from '../components/experiments/TabButton';
import ExperimentCard from '../components/experiments/ExperimentCard';
import ExperimentDetailsModal from '../components/experiments/ExperimentDetailsModal';

const PER_PAGE = 12;

export default function ExperimentsPage() {
  const [activeTab, setActiveTab] = useState('toxicometry');

  const [kineticList, setKineticList] = useState([]);
  const [toxicometryList, setToxicometryList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  // Модалка деталей
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [kinetic, toxicometry] = await Promise.all([
          getToxicokineticExperiments(),
          getToxicometryExperiments(),
        ]);
        if (!cancelled) {
          setKineticList(kinetic);
          setToxicometryList(toxicometry);
        }
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

  const isKinetic = activeTab === 'kinetic';
  const currentList = isKinetic ? kineticList : toxicometryList;

  // Фильтрация
  const filteredList = useMemo(() => {
    if (!query.trim()) return currentList;
    const q = query.toLowerCase();
    return currentList.filter(e =>
      (e.name || '').toLowerCase().includes(q) ||
      (e.substance || '').toLowerCase().includes(q)
    );
  }, [currentList, query]);

  // Пагинация
  const totalPages = Math.ceil(filteredList.length / PER_PAGE) || 1;
  const pageList = filteredList.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const handleDeleteKinetic = async (id, name) => {
    if (!confirm(`Удалить исследование «${name}»?`)) return;
    try {
      await deleteToxicokineticExperiment(id);
      setKineticList((prev) => prev.filter((e) => e.id !== id));
      setSelectedExperiment(null);
    } catch (err) {
      console.error('Ошибка удаления:', err);
      alert('Не удалось удалить');
    }
  };

  const handleDeleteToxicometry = async (id, name) => {
    if (!confirm(`Удалить исследование «${name}»?`)) return;
    try {
      await deleteToxicometryExperiment(id);
      setToxicometryList((prev) => prev.filter((e) => e.id !== id));
      setSelectedExperiment(null);
    } catch (err) {
      console.error('Ошибка удаления:', err);
      alert('Не удалось удалить');
    }
  };

  const handleOpenCard = (exp) => {
    setSelectedExperiment(exp);
    setSelectedType(activeTab);
  };

  const handleCloseModal = () => {
    setSelectedExperiment(null);
    setSelectedType(null);
  };

  const handleOpenInCalculator = () => {
    alert('Открытие в расчёте будет в следующей версии');
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

      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Мои исследования</h1>
        <p className="text-sm text-slate-500 mt-1">
          Всего исследований выполнено: {kineticList.length + toxicometryList.length}
        </p>
      </div>

      {/* Табы */}
      <div className="flex gap-2 border-b border-slate-200">
        <TabButton
          active={!isKinetic}
          onClick={() => {
            setActiveTab('toxicometry');
            setPage(0);
          }}
          label="Токсикометрия"
          count={toxicometryList.length}
        />
        <TabButton
          active={isKinetic}
          onClick={() => {
            setActiveTab('kinetic');
            setPage(0);
          }}
          label="Токсикокинетика"
          count={kineticList.length}
        />
      </div>

      {/* Поиск */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Поиск по названию или веществу..."
            className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Очистить
          </button>
        )}
      </div>

      {/* Список */}
      {pageList.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-16 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📭</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            {query ? 'Ничего не найдено' : 'Нет сохранённых исследований'}
          </h3>
          <p className="text-slate-500 text-sm">
            {query
              ? `По запросу «${query}» ничего не найдено`
              : `Создайте исследование на странице «${isKinetic ? 'Токсикокинетика' : 'Токсикометрия'}» и нажмите «Сохранить»`}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pageList.map((exp) => (
              <ExperimentCard
                key={exp.id}
                experiment={exp}
                type={activeTab}
                onOpen={() => handleOpenCard(exp)}
                onDelete={() =>
                  isKinetic
                    ? handleDeleteKinetic(exp.id, exp.name)
                    : handleDeleteToxicometry(exp.id, exp.name)
                }
              />
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-500">
                Показано {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, filteredList.length)} из {filteredList.length}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Назад
                </button>

                <span className="text-sm text-slate-600">
                  Страница {page + 1} из {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Вперёд →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Модалка деталей */}
      <ExperimentDetailsModal
        isOpen={selectedExperiment !== null}
        onClose={handleCloseModal}
        experiment={selectedExperiment}
        type={selectedType}
        onDelete={() => {
          if (selectedType === 'kinetic') {
            handleDeleteKinetic(selectedExperiment.id, selectedExperiment.name);
          } else {
            handleDeleteToxicometry(selectedExperiment.id, selectedExperiment.name);
          }
        }}
        onOpenInCalculator={handleOpenInCalculator}
      />
    </div>
  );
}