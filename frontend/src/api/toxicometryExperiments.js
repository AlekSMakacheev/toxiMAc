const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function createToxicometryExperiment(data) {
  const response = await fetch(`${API_URL}/v1/toxicometry-experiments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Ошибка создания: ${response.status}`);
  return response.json();
}

export async function getToxicometryExperiments() {
  const response = await fetch(`${API_URL}/v1/toxicometry-experiments`);
  if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
  return response.json();
}

export async function getToxicometryExperiment(id) {
  const response = await fetch(`${API_URL}/v1/toxicometry-experiments/${id}`);
  if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
  return response.json();
}

export async function deleteToxicometryExperiment(id) {
  const response = await fetch(`${API_URL}/v1/toxicometry-experiments/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Ошибка удаления: ${response.status}`);
  return null;
}