import { apiClient } from './client';
import type { Hospital, HospitalMatchRequest, HospitalMatchResult } from '@/lib/types';

export async function getHospitals(): Promise<Hospital[]> {
  return apiClient.get<Hospital[]>('/api/hospitals');
}

export async function getHospital(id: number): Promise<Hospital> {
  return apiClient.get<Hospital>(`/api/hospitals/${id}`);
}

export async function matchHospitals(
  request: HospitalMatchRequest,
): Promise<HospitalMatchResult[]> {
  return apiClient.post<HospitalMatchResult[]>('/api/hospitals/match', request);
}
