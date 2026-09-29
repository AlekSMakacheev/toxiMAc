
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