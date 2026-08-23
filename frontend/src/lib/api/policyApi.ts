import { apiClient } from './client';
import type {
  ExtractedPolicy,
  PolicyResponse,
  PolicyUpdateRequest,
} from '@/lib/types';

export async function uploadPolicy(
  file: File,
  patientId: number,
): Promise<ExtractedPolicy> {
  const form = new FormData();
  form.append('file', file);
  form.append('patientId', String(patientId));
  return apiClient.postFormData<ExtractedPolicy>('/api/policies/upload', form);
}

export async function confirmPolicy(
  policyId: number,
  data: PolicyUpdateRequest,
): Promise<PolicyResponse> {
  return apiClient.put<PolicyResponse>(`/api/policies/${policyId}/confirm`, data);
}

export async function getPolicy(policyId: number): Promise<PolicyResponse> {
  return apiClient.get<PolicyResponse>(`/api/policies/${policyId}`);
}

export async function getPatientPolicies(patientId: number): Promise<PolicyResponse[]> {
  return apiClient.get<PolicyResponse[]>(`/api/policies/patient/${patientId}`);
}

export async function getActivePolicy(patientId: number): Promise<PolicyResponse> {
  return apiClient.get<PolicyResponse>(`/api/policies/patient/${patientId}/active`);
}

export async function getSamplePdf(type: 'star' | 'hdfc' | 'care'): Promise<Blob> {
  return apiClient.getBlob(`/api/samples/pdf/${type}`);
}
