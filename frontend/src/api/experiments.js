const API_URL = import.meta.env.VITE_API_URL || '/api';

// Создать исследование
export async function createExperiment(data) {
  const response = await fetch(`${API_URL}/experiments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Ошибка создания: ${response.status}`);
  }
  return response.json();
}

// Получить все исследования
export async function getExperiments() {
  const response = await fetch(`${API_URL}/experiments`);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки: ${response.status}`);
  }
  return response.json();
}


// Получить одно исследование
export async function getExperiment(id) {
  const response = await fetch(`${API_URL}/experiments/${id}`);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки: ${response.status}`);
  }
  return response.json();
}

// Удалить исследование
export async function deleteExperiment(id) {
  const response = await fetch(`${API_URL}/experiments/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Ошибка удаления: ${response.status}`);
  }
  return null;
}