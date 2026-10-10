import { useState } from 'react';

export default function SaveExperimentModal({ isOpen, onClose, onSave, defaultSubstance = '' }) {
  const [name, setName] = useState('');
  const [substance, setSubstance] = useState(defaultSubstance);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !substance.trim()) {
      alert('Заполните название и вещество');
      return;
    }

    setSaving(true);
    try {
      await onSave({ name: name.trim(), substance: substance.trim(), notes: notes.trim() });
      setName('');
      setSubstance('');
      setNotes('');
      onClose();
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      alert('Не удалось сохранить: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">

        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Сохранить исследование
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Название <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Например, Тест 1"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Вещество <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={substance}
              onChange={(e) => setSubstance(e.target.value)}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Например, Вещество X"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Заметки
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Опционально"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}