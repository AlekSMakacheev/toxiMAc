export default function ReferenceManual() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 border-b border-slate-100 pb-4 flex items-center">
          <span className="text-3xl mr-3">📚</span>
          Справочник фармакокинетических параметров
        </h2>
        
        <p className="text-slate-600 mb-8 text-sm">
          В данном разделе представлена краткая интерпретация основных токсикокинетических и фармакокинетических показателей, рассчитываемых приложением toxiCMAC.
        </p>

        <div className="space-y-6">
          {/* Vd и Vss */}
          <div className="p-5 bg-indigo-50/50 rounded-lg border border-indigo-100">
            <h3 className="text-lg font-bold text-indigo-800 mb-2">Объем распределения (Vd и Vss)</h3>
            <p className="text-slate-700 text-sm mb-3">
              Теоретический объем жидкости, в котором нужно было бы растворить всю дозу вещества, чтобы получить концентрацию, равную концентрации в плазме крови.
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
              <li><strong>Низкий Vd (до 15 л):</strong> Вещество циркулирует преимущественно в крови. Эффективны методы экстракорпоральной детоксикации (гемодиализ).</li>
              <li><strong>Высокий Vd (сотни литров):</strong> Яд высоко липофилен и депонируется в тканях (жировая ткань, ЦНС). Гемодиализ малоэффективен.</li>
            </ul>
          </div>

          {/* AUC и AUMC */}
          <div className="p-5 bg-slate-50 rounded-lg border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Площади под кривыми (AUC и AUMC)</h3>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
              <li><strong>AUC (Area Under the Curve):</strong> Отражает общую экспозицию организма к токсину. Используется для оценки биодоступности и расчета клиренса.</li>
              <li><strong>AUMC (Area Under the First Moment Curve):</strong> Площадь под кривой первого момента (концентрация × время). Необходима для некомпартментного расчета MRT и Vss.</li>
            </ul>
          </div>

          {/* t1/2, MRT и Kel */}
          <div className="p-5 bg-slate-50 rounded-lg border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Временные параметры элиминации</h3>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
              <li><strong>t½ (Период полувыведения):</strong> Время, за которое концентрация падает ровно в 2 раза. Для полного выведения вещества (на 97%) требуется ~5 периодов полувыведения.</li>
              <li><strong>MRT (Среднее время удержания):</strong> Среднее время, которое одна молекула токсина проводит в организме до своей элиминации.</li>
              <li><strong>Kel (Константа элиминации):</strong> Доля вещества, выводимая из организма за единицу времени.</li>
            </ul>
          </div>

          {/* Клиренс */}
          <div className="p-5 bg-slate-50 rounded-lg border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Клиренс (Cl)</h3>
            <p className="text-slate-700 text-sm">
              Условный объем плазмы крови, который полностью очищается от токсина за единицу времени (обычно мл/мин). Отражает эффективность работы органов выделения (печени и почек). Формула: <em>Cl = Доза / AUC</em>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}