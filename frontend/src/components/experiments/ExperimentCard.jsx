import { formatDate } from '../../utils/formatters';

export default function ExperimentCard({ experiment, type, onOpen, onDelete }) {
  const isKinetic = type === 'kinetic';

  return (
    <div
      onClick={onOpen}
      className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-emerald-200 transition-all duration-200 overflow-hidden cursor-pointer"
    >
      <div className="h-1 bg-linear-to-r from-emerald-400 to-emerald-600"></div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg truncate" title={experiment.name}>
              {experiment.name}
            </h3>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
          >
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
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-start gap-2">
            <span className="text-sm text-slate-400 shrink-0 w-20">Вещество:</span>
            <span className="text-sm font-medium text-slate-700 truncate">
              {experiment.substance}
            </span>
          </div>

          {isKinetic ? (
            <>
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
            </>
          ) : (
            <>
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-400 shrink-0 w-20">Вид:</span>
                <span className="text-sm font-medium text-slate-700">
                  {experiment.species || '—'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sm text-slate-400 shrink-0 w-20">Групп:</span>
                <span className="text-sm font-medium text-slate-700">
                  {experiment.groups?.length || 0}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
          <span>📅</span>
          <span>{formatDate(experiment.createdAt)}</span>
        </div>

        {experiment.notes && (
          <div className="mt-3 bg-slate-50 rounded-lg p-2.5 text-xs text-slate-600 leading-relaxed">
            {experiment.notes}
          </div>
        )}
      </div>
    </div>
  );
}