import { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import ToxicokineticsDashboard from './components/toxicokinetics/ToxicokineticsDashboard';
import ReferenceManual from './components/ReferenceManual';
import ToxicometryDashboard from './components/toxicometry/ToxicometryDashboard';

function App() {
  const [activeTool, setActiveTool] = useState(null); 

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Header setActiveTool={setActiveTool} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />

        <main className="flex-1 p-6 overflow-y-auto">
          
          {/* Если выбран калькулятор - рисуем наш новый изолированный модуль */}
          {activeTool === 'toxicokinetics' && (
            <ToxicokineticsDashboard />
          )}


          {/* Если выбран Справочник */}
          {activeTool === 'reference' && (
            <ReferenceManual />
          )}

          {activeTool === 'toxicometry' && <ToxicometryDashboard/>}


          {activeTool === 'future_tool' && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 animate-in fade-in duration-300">
              <span className="text-6xl mb-4">🛠️</span>
              <h2 className="text-2xl font-medium text-slate-500">Инструмент в разработке</h2>
              <p className="mt-2 text-slate-400">Скоро здесь появится модуль токсикометрии</p>
            </div>
          )}

          {!activeTool && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 animate-in fade-in duration-500">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-300 mb-4 shadow-inner">
                <span className="text-5xl">🧪</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-600 mb-2">Добро пожаловать в toxiCMAC</h2>
              <p className="text-slate-400 text-lg">Выберите инструмент в меню слева для начала работы</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;