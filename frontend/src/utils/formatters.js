
// Форматирует число
export function formatNumber(value, digits = 2) {
  if (value == null || isNaN(value)) return '—';
  return value.toFixed(digits);
}

// Форматирует значение
export function formatWithUnit(value, unit, digits = 2) {
  if (value == null || isNaN(value)) return '—';
  return `${value.toFixed(digits)} ${unit}`;
}

// Форматирует дату из ISO-строки
export function formatDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year}, ${hours}:${minutes}`;
}