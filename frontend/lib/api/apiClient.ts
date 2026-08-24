import {
  DashboardSummaryDto,
  PolicyResponseDto,
  ExtractedPolicyDto,
  PolicyUpdateRequestDto,
  HospitalDto,
  HospitalMatchResultDto,
  HospitalMatchRequestDto,
  CareJourneyDto,
  JourneyContextDto,
  JourneyStage,
  AIExplainRequestDto,
  AIExplainResponseDto,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errData = await response.json();
      if (errData && errData.message) {
        errorMsg = errData.message;
      }
    } catch {
      // JSON parse failed, use default errorMsg
    }
    throw new Error(errorMsg);
  }
  return response.json() as Promise<T>;
}

// 1. Dashboard
export async function getDashboardSummary(patientId: number = 1): Promise<DashboardSummaryDto> {
  const res = await fetch(`${API_BASE_URL}/api/dashboard/${patientId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  return handleResponse<DashboardSummaryDto>(res);
}

// 2. Policy
export async function uploadPolicyPdf(file: File, patientId: number = 1): Promise<ExtractedPolicyDto> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('patientId', patientId.toString());

  const res = await fetch(`${API_BASE_URL}/api/policies/upload?patientId=${patientId}`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse<ExtractedPolicyDto>(res);
}

export async function confirmPolicy(
  policyId: number,
  data: PolicyUpdateRequestDto
): Promise<PolicyResponseDto> {
  const res = await fetch(`${API_BASE_URL}/api/policies/${policyId}/confirm`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<PolicyResponseDto>(res);
}

export async function getPolicyById(policyId: number): Promise<PolicyResponseDto> {
  const res = await fetch(`${API_BASE_URL}/api/policies/${policyId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  return handleResponse<PolicyResponseDto>(res);
}

export async function getActivePolicyForPatient(patientId: number = 1): Promise<PolicyResponseDto> {
  const res = await fetch(`${API_BASE_URL}/api/policies/patient/${patientId}/active`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  return handleResponse<PolicyResponseDto>(res);
}

export async function getPoliciesForPatient(patientId: number = 1): Promise<PolicyResponseDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/policies/patient/${patientId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  return handleResponse<PolicyResponseDto[]>(res);
}

// 3. Hospitals & Matching
export async function getAllHospitals(): Promise<HospitalDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/hospitals`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  return handleResponse<HospitalDto[]>(res);
}

export async function getHospitalById(id: number): Promise<HospitalDto> {
  const res = await fetch(`${API_BASE_URL}/api/hospitals/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  return handleResponse<HospitalDto>(res);
}

export async function matchHospitals(
  request: HospitalMatchRequestDto = { patientId: 1 }
): Promise<HospitalMatchResultDto[]> {
  const res = await fetch(`${API_BASE_URL}/api/hospitals/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    cache: 'no-store',
  });
  return handleResponse<HospitalMatchResultDto[]>(res);
}

// 4. Care Journey
export async function getJourneyForPatient(patientId: number = 1): Promise<CareJourneyDto> {
  const res = await fetch(`${API_BASE_URL}/api/journeys/${patientId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  return handleResponse<CareJourneyDto>(res);
}

export async function createOrUpdateJourney(
  patientId: number = 1,
  hospitalId: number
): Promise<CareJourneyDto> {
  const res = await fetch(
    `${API_BASE_URL}/api/journeys?patientId=${patientId}&hospitalId=${hospitalId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  return handleResponse<CareJourneyDto>(res);
}

export async function updateJourneyStage(
  journeyId: number,
  stage: JourneyStage,
  note?: string
): Promise<CareJourneyDto> {
  const res = await fetch(`${API_BASE_URL}/api/journeys/${journeyId}/stage`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage, note }),
  });
  return handleResponse<CareJourneyDto>(res);
}

export async function getJourneyContext(journeyId: number): Promise<JourneyContextDto> {
  const res = await fetch(`${API_BASE_URL}/api/journeys/${journeyId}/context`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  return handleResponse<JourneyContextDto>(res);
}

// 5. AI Explanation
export async function getAIExplanation(
  request: AIExplainRequestDto
): Promise<AIExplainResponseDto> {
  const res = await fetch(`${API_BASE_URL}/api/ai/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    cache: 'no-store',
  });
  return handleResponse<AIExplainResponseDto>(res);
}

// 6. Sample PDFs
export function getSamplePdfDownloadUrl(type: 'star' | 'hdfc' | 'care'): string {
  return `${API_BASE_URL}/api/samples/pdf/${type}`;
}

export async function fetchSamplePdfBlob(type: 'star' | 'hdfc' | 'care'): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}/api/samples/pdf/${type}`, {
    method: 'GET',
  });
  if (!res.ok) {
    throw new Error(`Failed to download sample PDF (${res.statusText})`);
  }
  return res.blob();
}
