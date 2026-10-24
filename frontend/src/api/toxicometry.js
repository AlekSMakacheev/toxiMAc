import { post } from './client';
import { ENDPOINTS } from '../constants/api';

// Расчёт доз (D16, D50, D84)
export async function calculateToxicometry(groups) {
  return post(ENDPOINTS.TOXICOMETRY_CALCULATE, { groups });
}