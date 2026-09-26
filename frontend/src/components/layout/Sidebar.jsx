export default function Sidebar({ activeTool, setActiveTool }) {
  return (
    // Добавил h-full, чтобы панель тянулась на всю высоту экрана
    <aside className="w-64 h-full bg-white border-r border-slate-200 flex flex-col z-0 shrink-0">
      
      {/* flex-1 заставляет этот блок занять всё свободное место, выталкивая Справочник вниз */}
      <nav className="p-4 space-y-2 flex-1">
        
        <button 
          onClick={() => setActiveTool('toxicokinetics')}
          className={`w-full text-left px-4 py-3 font-semibold rounded-lg transition-colors border shadow-sm ${
            activeTool === 'toxicokinetics' 
              ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
              : 'bg-white text-slate-600 border-transparent hover:bg-slate-50'
          }`}
        >
          Токсикокинетика
        </button>

        {/* Стили скопированы с Токсикокинетики, добавлено flex items-center для иконки */}
        <button 
          onClick={() => setActiveTool('toxicometry')}
          className={`w-full flex items-center text-left px-4 py-3 font-semibold rounded-lg transition-colors border shadow-sm ${
            activeTool === 'toxicometry' 
              ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
              : 'bg-white text-slate-600 border-transparent hover:bg-slate-50'
          }`}
        >
          Токсикометрия
        </button>
        
        <button 
          onClick={() => setActiveTool('future_tool')}
          className={`w-full text-left px-4 py-3 font-medium rounded-lg transition-colors border ${
            activeTool === 'future_tool'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm'
              : 'bg-white text-slate-400 border-transparent hover:bg-slate-50'
          }`}
        >
          + Добавить инструмент
        </button>

      </nav>

      {/* Справочник теперь жестко зафиксирован внизу с аккуратной линией отбивки (border-t) */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={() => setActiveTool('reference')}
          className={`w-full flex items-center px-4 py-3 font-semibold rounded-lg transition-colors border shadow-sm ${
            activeTool === 'reference' 
              ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
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