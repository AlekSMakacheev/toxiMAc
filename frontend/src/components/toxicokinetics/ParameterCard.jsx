// frontend/src/components/toxicokinetics/ParameterCard.jsx

const STATUS_STYLES = {
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  badge: 'bg-green-500',  text: 'text-green-800'  },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-500', text: 'text-yellow-800' },
  red:    { bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-500',    text: 'text-red-800'    },
  info:   { bg: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-blue-500',   text: 'text-blue-800'   },
};

export default function ParameterCard({
  title, value, unit, status = 'info',
  interpretation, recommendation, reference,
}) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.info;

  return (
    <div className={`rounded-xl border ${s.border} ${s.bg} p-5 shadow-sm`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <span className={`${s.badge} text-white text-xs px-2 py-1 rounded-full`}>
          {status.toUpperCase()}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toFixed(2) : value}
        </span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>

      {interpretation && (
        <p className="text-sm text-gray-700 mb-2">{interpretation}</p>
      )}
      {recommendation && (
        <p className="text-sm font-medium text-gray-800 mb-2">💡 {recommendation}</p>
      )}
      {reference && (
        <p className="text-xs text-gray-400 italic">{reference}</p>
      )}
    </div>
  );
}