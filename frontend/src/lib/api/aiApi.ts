import { apiClient } from './client';
import type { AIExplainRequest, AIExplainResponse } from '@/lib/types';

export async function explainMatch(request: AIExplainRequest): Promise<AIExplainResponse> {
  return apiClient.post<AIExplainResponse>('/api/ai/explain', request);
}
