export default function DataInputTable({ points, setPoints }) {
  
  const handlePointChange = (index, field, value) => {
    
    const newPoints = points.map((point, i) => {
      if (i === index) {
        return { ...point, [field]: value };
      }
      return point;
    });
    
    setPoints(newPoints);
  };

  const addPoint = () => {
    setPoints([...points, { time: '', concentration: '' }]);
  };

  const removePoint = (index) => {
    if (points.length > 2) {
      const newPoints = points.filter((_, i) => i !== index);
      setPoints(newPoints);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto mb-4 border border-slate-200 rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-center">Время (мин)</th>
              <th className="px-4 py-3 text-center">Концентрация</th>
              <th className="px-2 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {points.map((point, index) => (
              <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={point.time}
                    onChange={(e) => handlePointChange(index, 'time', e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={point.concentration}
                    onChange={(e) => handlePointChange(index, 'concentration', e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0"
                  />
                </td>
                <td className="px-2 py-2 text-center">
                  {points.length > 2 && (
                    <button
                      onClick={() => removePoint(index)}
                      className="text-slate-400 hover:text-rose-500 font-bold text-lg leading-none"
                      title="Удалить точку"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button 
        onClick={addPoint} 
        className="mt-auto w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200"
      >
        + Добавить точку
      </button>
    </div>
  );
}