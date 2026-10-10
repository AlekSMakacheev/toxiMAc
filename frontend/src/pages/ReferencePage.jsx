import { useState } from 'react';

export default function ReferencePage() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 border-b border-slate-100 pb-4 flex items-center">
          <span className="text-3xl mr-3">📚</span>
          Справочник
        </h2>

        <p className="text-slate-600 mb-8 text-sm">
          Краткая интерпретация основных токсикометрических и токсикокинетических показателей, рассчитываемых в toxiMAс
        </p>

        <div className="space-y-4">

          <AccordionSection
            id="toxicometry"
            icon="" // для иконки
            title="Токсикометрия"
            subtitle="Количественная оценка токсичности"
            isOpen={openSection === 'toxicometry'}
            onToggle={() => toggleSection('toxicometry')}
          >
            <div className="space-y-4">

              <InfoBlock title="Токсикометрия">
                <p>
                  Раздел токсикологии, изучающий <strong>количественную связь</strong> между дозой вещества и выраженностью токсического эффекта.
                </p>
              </InfoBlock>

              <InfoBlock title="LD₁₆, LD₅₀, LD₈₄">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>LD<sub className="text-[0.7em]">16</sub></strong> — доза, вызывающая гибель <strong>16%</strong> подопытных животных.
                  </li>
                  <li>
                    <strong>LD<sub className="text-[0.7em]">50</sub></strong> — доза, вызывающая гибель <strong>50%</strong>. <em>Основной показатель токсичности.</em>
                  </li>
                  <li>
                    <strong>LD<sub className="text-[0.7em]">84</sub></strong> — доза, вызывающая гибель <strong>84%</strong>.
                  </li>
                </ul>
                <p className="mt-2 text-slate-500 italic text-xs">
                  Единицы: мг/кг массы тела.
                </p>
              </InfoBlock>

              <InfoBlock title="Пробит-анализ">
                <p>
                  Метод <strong>нелинейной регрессии</strong>, преобразующий процент летальности в «пробиты» (probability units) — и позволяющий строить <strong>линейную зависимость</strong> от логарифма дозы.
                </p>
                <p className="mt-2">
                  Формула: <code className="bg-slate-100 px-1 rounded">Probit = a + b × log₁₀(Dose)</code>
                </p>
                <p className="mt-2 text-slate-500 italic text-xs">
                  Затем через обратное преобразование находим LD₁₆, LD₅₀, LD₈₄.
                </p>
              </InfoBlock>

            </div>
          </AccordionSection>

          <AccordionSection
            id="toxicokinetics"
            icon="" // для иконки
            title="Токсикокинетика"
            subtitle="Количественные характеристики биотрансформации веществ"
            isOpen={openSection === 'toxicokinetics'}
            onToggle={() => toggleSection('toxicokinetics')}
          >
            <div className="space-y-4">

              <InfoBlock title="Токсикокинетика">
                <p>
                  Раздел токсикологии, изучающий закономерности, а также качественные и количественные характеристики <strong>резорбции</strong>, <strong>распределения</strong>, <strong>метаболизма</strong> веществ в организме и их <strong>элиминации</strong>.
                </p>
              </InfoBlock>

              <InfoBlock title="Cmax и Tmax">
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Cmax</strong> — максимальная концентрация в плазме.</li>
                  <li><strong>Tmax</strong> — время достижения Cmax.</li>
                </ul>
                <p className="mt-2 text-slate-500 italic text-xs">
                  Единицы: Cmax — мкг/мл; Tmax — мин.
                </p>
              </InfoBlock>

              <InfoBlock title="AUC и AUMC">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>AUC</strong> (Area Under the Curve) — площадь под кривой «концентрация-время». <em>Общая экспозиция организма к веществу.</em>
                  </li>
                  <li>
                    <strong>AUMC</strong> — площадь под кривой первого момента (концентрация × время). Используется для расчёта MRT.
                  </li>
                </ul>
              </InfoBlock>

              <InfoBlock title="t½, Kel, MRT">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>t½</strong> — период полувыведения. Время, за которое концентрация <strong>падает вдвое</strong>. Для полного выведения (~97%) нужно <strong>~5 × t½</strong>.
                  </li>
                  <li>
                    <strong>Kel</strong> — константа элиминации. Доля вещества, выводимая за единицу времени.
                  </li>
                  <li>
                    <strong>MRT</strong> — среднее время удержания. Сколько в среднем молекула проводит в организме.
                  </li>
                </ul>
              </InfoBlock>

              <InfoBlock title="Vd и Vss">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Vd</strong> — объём распределения. Теоретический объём, в котором нужно растворить дозу, чтобы получить наблюдаемую концентрацию.
                  </li>
                  <li>
                    <strong>Vss</strong> — стационарный объём распределения (NCA).
                  </li>
                </ul>
                <p className="mt-2 text-slate-500 italic text-xs">
                  Низкий Vd (&lt;15 л) — вещество в крови; высокий (&gt;40 л) — в тканях.
                </p>
              </InfoBlock>

              <InfoBlock title="Клиренс (CL)">
                <p>
                  Условный объём плазмы, <strong>полностью очищаемый</strong> от вещества за единицу времени.
                </p>
                <p className="mt-2">
                  Формула: <code className="bg-slate-100 px-1 rounded">CL = Доза / AUC</code>
                </p>
                <p className="mt-2 text-slate-500 italic text-xs">
                  Единицы: л/мин (или мл/мин). Отражает работу печени и почек.
                </p>
              </InfoBlock>

            </div>
          </AccordionSection>

        </div>
      </div>
    </div>
  );
}

function AccordionSection({ icon, title, subtitle, isOpen, onToggle, children }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-5 py-4 transition-colors ${
          isOpen ? 'bg-emerald-50' : 'bg-slate-50 hover:bg-slate-100'
        }`}
      >
        <div className="flex items-center gap-3 text-left">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className={`font-bold ${isOpen ? 'text-emerald-800' : 'text-slate-800'}`}>
              {title}
            </h3>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${isOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="px-5 py-5 bg-white border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
}

function InfoBlock({ title, children }) {
  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
      <h4 className="font-semibold text-slate-700 mb-2 text-sm">{title}</h4>
      <div className="text-sm text-slate-600 leading-relaxed">{children}</div>
    </div>
  );
}