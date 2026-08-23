import { apiClient } from './client';
import type {
  CareJourney,
  JourneyContext,
  JourneyStageUpdateRequest,
} from '@/lib/types';

export async function getJourney(patientId: number): Promise<CareJourney> {
  return apiClient.get<CareJourney>(`/api/journeys/${patientId}`);
}

export async function startJourney(
  patientId: number,
  hospitalId: number,
): Promise<CareJourney> {
  return apiClient.post<CareJourney>(
    `/api/journeys?patientId=${patientId}&hospitalId=${hospitalId}`,
  );
}

export async function updateJourneyStage(
  journeyId: number,
  request: JourneyStageUpdateRequest,
): Promise<CareJourney> {
  return apiClient.put<CareJourney>(`/api/journeys/${journeyId}/stage`, request);
}

export async function getJourneyContext(journeyId: number): Promise<JourneyContext> {
  return apiClient.get<JourneyContext>(`/api/journeys/${journeyId}/context`);
}
