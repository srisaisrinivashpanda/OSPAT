import {
  ExtractedPolicyDto,
  PolicyResponseDto,
  PolicyUpdateRequestDto,
  HospitalDto,
  HospitalMatchRequestDto,
  HospitalMatchResultDto,
  CareJourneyDto,
  JourneyContextDto,
  JourneyStageUpdateRequestDto,
  AIExplainRequestDto,
  AIExplainResponseDto,
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson && errorJson.message) {
        errorMsg = errorJson.message;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }
  return response.json() as Promise<T>;
}

export const api = {
  // Policies
  async getActivePolicy(patientId: number = 1): Promise<PolicyResponseDto | null> {
    try {
      const res = await fetch(`${API_BASE}/api/policies/patient/${patientId}/active`, {
        cache: 'no-store',
      });
      if (res.status === 404) return null;
      return handleResponse<PolicyResponseDto>(res);
    } catch (e) {
      console.warn('Failed to fetch active policy:', e);
      return null;
    }
  },

  async getPoliciesForPatient(patientId: number = 1): Promise<PolicyResponseDto[]> {
    try {
      const res = await fetch(`${API_BASE}/api/policies/patient/${patientId}`, {
        cache: 'no-store',
      });
      return handleResponse<PolicyResponseDto[]>(res);
    } catch (e) {
      console.warn('Failed to fetch patient policies:', e);
      return [];
    }
  },

  async getPolicyById(id: number): Promise<PolicyResponseDto> {
    const res = await fetch(`${API_BASE}/api/policies/${id}`, {
      cache: 'no-store',
    });
    return handleResponse<PolicyResponseDto>(res);
  },

  async uploadPolicyPdf(file: File, patientId: number = 1): Promise<ExtractedPolicyDto> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', patientId.toString());

    const res = await fetch(`${API_BASE}/api/policies/upload?patientId=${patientId}`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<ExtractedPolicyDto>(res);
  },

  async confirmPolicy(id: number, request: PolicyUpdateRequestDto): Promise<PolicyResponseDto> {
    const res = await fetch(`${API_BASE}/api/policies/${id}/confirm`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse<PolicyResponseDto>(res);
  },

  // Hospitals
  async getAllHospitals(): Promise<HospitalDto[]> {
    try {
      const res = await fetch(`${API_BASE}/api/hospitals`, {
        cache: 'no-store',
      });
      return handleResponse<HospitalDto[]>(res);
    } catch (e) {
      console.warn('Failed to fetch all hospitals:', e);
      return [];
    }
  },

  async getHospitalById(id: number): Promise<HospitalDto | null> {
    try {
      const res = await fetch(`${API_BASE}/api/hospitals/${id}`, {
        cache: 'no-store',
      });
      if (res.status === 404) return null;
      return handleResponse<HospitalDto>(res);
    } catch (e) {
      console.warn(`Failed to fetch hospital ${id}:`, e);
      return null;
    }
  },

  async matchHospitals(request: HospitalMatchRequestDto = { patientId: 1 }): Promise<HospitalMatchResultDto[]> {
    try {
      const res = await fetch(`${API_BASE}/api/hospitals/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        cache: 'no-store',
      });
      return handleResponse<HospitalMatchResultDto[]>(res);
    } catch (e) {
      console.warn('Failed to execute hospital matching:', e);
      return [];
    }
  },

  // Care Journey
  async getJourneyForPatient(patientId: number = 1): Promise<CareJourneyDto | null> {
    try {
      const res = await fetch(`${API_BASE}/api/journeys/${patientId}`, {
        cache: 'no-store',
      });
      if (res.status === 404) return null;
      return handleResponse<CareJourneyDto>(res);
    } catch (e) {
      console.warn('Failed to fetch patient journey:', e);
      return null;
    }
  },

  async getJourneyContext(journeyId: number): Promise<JourneyContextDto | null> {
    try {
      const res = await fetch(`${API_BASE}/api/journeys/${journeyId}/context`, {
        cache: 'no-store',
      });
      if (res.status === 404) return null;
      return handleResponse<JourneyContextDto>(res);
    } catch (e) {
      console.warn('Failed to fetch journey context:', e);
      return null;
    }
  },

  async createOrUpdateJourney(patientId: number = 1, hospitalId: number): Promise<CareJourneyDto> {
    const res = await fetch(`${API_BASE}/api/journeys?patientId=${patientId}&hospitalId=${hospitalId}`, {
      method: 'POST',
    });
    return handleResponse<CareJourneyDto>(res);
  },

  async updateJourneyStage(journeyId: number, request: JourneyStageUpdateRequestDto): Promise<CareJourneyDto> {
    const res = await fetch(`${API_BASE}/api/journeys/${journeyId}/stage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse<CareJourneyDto>(res);
  },

  // AI Insights
  async explainMatchOrStage(request: AIExplainRequestDto): Promise<AIExplainResponseDto | null> {
    try {
      const res = await fetch(`${API_BASE}/api/ai/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      return handleResponse<AIExplainResponseDto>(res);
    } catch (e) {
      console.warn('Failed to fetch AI explanation:', e);
      return null;
    }
  },

  // Sample Generator
  getSamplePdfUrl(type: 'star' | 'hdfc' | 'care' = 'star'): string {
    return `${API_BASE}/api/samples/pdf/${type}`;
  },

  async fetchSamplePdfBlob(type: 'star' | 'hdfc' | 'care' = 'star'): Promise<Blob> {
    const res = await fetch(`${API_BASE}/api/samples/pdf/${type}`);
    if (!res.ok) throw new Error('Failed to download sample PDF');
    return res.blob();
  },
};
