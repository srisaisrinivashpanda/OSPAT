import { apiClient } from './client';
import type { DashboardSummary } from '@/lib/types';

export async function getDashboard(patientId: number): Promise<DashboardSummary> {
  return apiClient.get<DashboardSummary>(`/api/dashboard/${patientId}`);
}
