import logo from '../../assets/logo.png';

export default function Header({ setActiveTool }) {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">

      <div className="flex items-center">
        <img 
          src={logo} 
          alt="toxiMAC" 
          className="w-10 h-10 mr-4 object-contain"
        />
        <h1 className="text-2xl font-bold text-slate-700 tracking-tight">toxiMAс</h1>
      </div>
      
      <button 
        onClick={() => setActiveTool(null)}
        title="На главную"
        className="w-10 h-10 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-md flex items-center justify-center transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        🏠
      </button>

    </header>
  );
}