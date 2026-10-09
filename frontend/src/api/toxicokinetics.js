import { post } from './client';
import { ENDPOINTS } from '../constants/api';

// Расчёт токсикокинетических параметров
export async function calculateToxicokinetics(dose, points) {
  const requestData = {
    dose: parseFloat(dose),
    points: points.map(p => ({
      time: parseFloat(p.time),
      concentration: parseFloat(p.concentration)
    }))
  };

  return post(ENDPOINTS.TOXICOKINETICS_CALCULATE, requestData);
}