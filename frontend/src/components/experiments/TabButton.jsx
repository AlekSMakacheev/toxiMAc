export default function TabButton({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 font-semibold transition-colors border-b-2 flex items-center gap-2 ${
        active
          ? 'border-emerald-600 text-emerald-700'
          : 'border-transparent text-slate-500 hover:text-slate-700'
      }`}
    >
      <span>{label}</span>
      <span
        className={`text-[11px] font-semibold rounded-full inline-flex items-center justify-center ml-1 ${
          active
            ? 'bg-rose-100 text-rose-600'
            : 'bg-rose-50 text-rose-400'
        }`}
        style={{
          minWidth: '20px',
          height: '20px',
          lineHeight: '20px',
          padding: '0 6px',
        }}
      >
        {count}
      </span>
    </button>
  );
}