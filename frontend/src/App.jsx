import { useState } from 'react';
import logo from './assets/logo.png';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import ToxicokineticsPage from './pages/ToxicokineticsPage';
import ToxicometryPage from './pages/ToxicometryPage';
import ReferencePage from './pages/ReferencePage';

function App() {
  const [activeTool, setActiveTool] = useState(null); 

  return (
    <div className="h-screen flex flex-col font-sans text-slate-800 overflow-hidden">
      <Header setActiveTool={setActiveTool} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />

        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">

          {/* Токсикометрия */}
          {activeTool === 'toxicometry' && <ToxicometryPage />}

          {/* Токсикокинетика */}
          {activeTool === 'toxicokinetics' && <ToxicokineticsPage />}

          {/* Справочник */}
          {activeTool === 'reference' && <ReferencePage />}

          {activeTool === 'future_tool' && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 animate-in fade-in duration-300">
              <span className="text-6xl mb-4">🛠️</span>
              <h2 className="text-2xl font-medium text-slate-500">Инструмент в разработке</h2>
              <p className="mt-2 text-slate-400">Скоро здесь появится модуль</p>
            </div>
          )}

          {!activeTool && (
            <div className="relative h-full flex flex-col items-center justify-center text-slate-400 animate-in fade-in duration-500 overflow-hidden">

              {/* Логотип  */}
              <img 
                src={logo} 
                alt="" 
                className="absolute inset-0 m-auto w-150 h-150 object-contain opacity-15 pointer-events-none select-none"
              />

              {/* Текст поверх */}
              <div className="relative z-10 text-center">
                <h2 className="text-3xl font-bold text-slate-600 mb-2">Добро пожаловать в toxiMAc</h2>
                <p className="text-slate-400 text-lg">Выберите инструмент в меню слева для начала работы</p>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;