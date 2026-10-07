export default function Sidebar({ activeTool, setActiveTool }) {
  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200 flex flex-col z-0 shrink-0">

      {/* Верхняя часть — инструменты */}
      <nav className="p-4 space-y-2 flex-1">

        <button
          onClick={() => setActiveTool('toxicometry')}
          className={`w-full flex items-center text-left px-4 py-3 font-semibold rounded-lg transition-colors border shadow-sm ${
            activeTool === 'toxicometry'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-white text-slate-600 border-transparent hover:bg-slate-50'
          }`}
        >
          Токсикометрия
        </button>

        <button
          onClick={() => setActiveTool('toxicokinetics')}
          className={`w-full text-left px-4 py-3 font-semibold rounded-lg transition-colors border shadow-sm ${
            activeTool === 'toxicokinetics'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-white text-slate-600 border-transparent hover:bg-slate-50'
          }`}
        >
          Токсикокинетика
        </button>

        <button
          onClick={() => setActiveTool('future_tool')}
          className={`w-full text-left px-4 py-3 font-medium rounded-lg transition-colors border ${
            activeTool === 'future_tool'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm'
              : 'bg-white text-slate-400 border-transparent hover:bg-slate-50'
          }`}
        >
          + Добавить инструмент
        </button>

      </nav>

      {/* Нижняя часть — служебные разделы */}
      <div className="p-4 border-t border-slate-100 space-y-2">

        <button
          onClick={() => setActiveTool('experiments')}
          className={`w-full flex items-center px-4 py-3 font-semibold rounded-lg transition-colors border shadow-sm ${
            activeTool === 'experiments'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-white text-slate-600 border-transparent hover:bg-slate-50'
          }`}
        >
          <span className="mr-3 text-lg">📁</span>
          Мои исследования
        </button>

        <button
          onClick={() => setActiveTool('reference')}
          className={`w-full flex items-center px-4 py-3 font-semibold rounded-lg transition-colors border shadow-sm ${
            activeTool === 'reference'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-white text-slate-600 border-transparent hover:bg-slate-50'
          }`}
        >
          <span className="mr-3 text-lg">📚</span>
          Справочник
        </button>

      </div>

    </aside>
  );
}