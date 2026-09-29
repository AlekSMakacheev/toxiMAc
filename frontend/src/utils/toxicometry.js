/**
 * Расчёт теоретической летальности по пробит-модели.
 * 
 * ВАЖНО: эта формула должна совпадать с probit-моделью в ToxicometryService.java
 * 
 * Бэкенд считает коэффициенты a и b через пробит-анализ.
 * Фронт использует их для построения плавной кривой на графике.
 * 
 * Если меняешь формулу здесь — проверь, что и в Java она такая же.
 */

export function calcTheoreticalMortality(dose, a, b) {
  const probit = a + b * Math.log10(dose);
  const z = probit - 5.0;
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1.0 / (1.0 + 0.3275911 * x);
  const erf = 1.0 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * erf) * 100;
}

/**
 * Массив точек регрессии для графика.
 */
export function buildRegressionPoints(minDose, maxDose, a, b, steps = 50) {
  const logMin = Math.log10(minDose / 1.5);
  const logMax = Math.log10(maxDose * 1.5);
  const stepSize = (logMax - logMin) / steps;

  const points = [];
  for (let i = 0; i <= steps; i++) {
    const currentDose = Math.pow(10, logMin + stepSize * i);
    points.push({
      dose: currentDose,
      theoretical: calcTheoreticalMortality(currentDose, a, b),
    });
  }
  return points;
}