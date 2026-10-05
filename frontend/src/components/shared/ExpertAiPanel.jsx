export default function ExpertAiPanel() {
  return (
    <div className="h-full bg-emerald-50 p-5 rounded-xl border border-emerald-100 flex flex-col">
      <div className="flex items-center mb-3">
        <h3 className="text-md font-bold text-emerald-900">Экспертное заключение</h3>
      </div>
      <div className="flex-1 bg-white p-4 rounded-lg border border-emerald-50 shadow-inner">
        <p className="text-sm text-slate-500 font-medium italic leading-relaxed">
          Модуль в разработке!!! Скоро здесь появится подробное описание профиля вещества на основе рассчитанных параметров...
        </p>
      </div>
    </div>
  );
}