const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function createToxicokineticExperiment(data) {
  const response = await fetch(`${API_URL}/v1/toxicokinetic-experiments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Ошибка создания: ${response.status}`);
  return response.json();
}

export async function getToxicokineticExperiments() {
  const response = await fetch(`${API_URL}/v1/toxicokinetic-experiments`);
  if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
  return response.json();
}

export async function getToxicokineticExperiment(id) {
  const response = await fetch(`${API_URL}/v1/toxicokinetic-experiments/${id}`);
  if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
  return response.json();
}

export async function deleteToxicokineticExperiment(id) {
  const response = await fetch(`${API_URL}/v1/toxicokinetic-experiments/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Ошибка удаления: ${response.status}`);
  return null;
}