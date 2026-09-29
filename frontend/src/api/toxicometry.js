import { post } from './client';
import { ENDPOINTS } from '../constants/api';

// Расчёт летальных доз (LD16, LD50, LD84).

export async function calculateToxicometry(groups) {
  return post(ENDPOINTS.TOXICOMETRY_CALCULATE, { groups });
}