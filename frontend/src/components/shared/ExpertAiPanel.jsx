export default function ExpertAiPanel() {
  return (
    <div className="h-full bg-indigo-50 p-5 rounded-xl border border-indigo-100 flex flex-col">
      <div className="flex items-center mb-3">
        <span className="text-2xl mr-2">🤖</span>
        <h3 className="text-md font-bold text-indigo-900">Экспертное заключение</h3>
      </div>
      <div className="flex-1 bg-white p-4 rounded-lg border border-indigo-50 shadow-inner">
        <p className="text-sm text-slate-500 font-medium italic leading-relaxed">
          Здесь появится сгенерированный текст. Локальная модель проанализирует кривую, рассчитанные параметры и сформирует подробное описание профиля вещества...
        </p>
      </div>
    </div>
  );
}