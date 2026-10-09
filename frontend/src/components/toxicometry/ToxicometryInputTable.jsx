export default function ToxicometryInputTable({ groups, setGroups }) {
  
  const handleGroupChange = (index, field, value) => {
    const newGroups = groups.map((group, i) => {
      if (i === index) {
        return { ...group, [field]: value };
      }
      return group;
    });
    setGroups(newGroups);
  };

  const addGroup = () => {
    setGroups([...groups, { dose: '', total: '', effect: '' }]);
  };

  const removeGroup = (index) => {
    // В пробит-анализе желательно иметь хотя бы 3-4 точки, но оставим минимум 2
    if (groups.length > 2) {
      const newGroups = groups.filter((_, i) => i !== index);
      setGroups(newGroups);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto mb-4 border border-slate-200 rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="px-3 py-3 text-center">Доза<br />
                (мг/кг)
              </th>
              <th className="px-3 py-3 text-center">Всего (n)</th>
              <th className="px-3 py-3 text-center">Эффект</th>
              <th className="px-2 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, index) => (
              <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={group.dose}
                    onChange={(e) => handleGroupChange(index, 'dose', e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 focus:ring-1 focus:ring-emerald-500"
                    placeholder="0"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={group.total}
                    onChange={(e) => handleGroupChange(index, 'total', e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 focus:ring-1 focus:ring-emerald-500"
                    placeholder="0"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={group.effect}
                    onChange={(e) => handleGroupChange(index, 'effect', e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 focus:ring-1 focus:ring-rose-500"
                    placeholder="0"
                  />
                </td>
                <td className="px-2 py-2 text-center">
                  {groups.length > 2 && (
                    <button
                      onClick={() => removeGroup(index)}
                      className="text-slate-400 hover:text-rose-500 font-bold text-lg leading-none"
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
        onClick={addGroup} 
        className="mt-auto w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200"
      >
        + Добавить группу
      </button>
    </div>
  );
}