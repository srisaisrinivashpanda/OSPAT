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

function sanitizeApiBase(rawUrl?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return 'http://localhost:8080';
  let cleaned = rawUrl.trim();
  // Extract the first valid http(s) origin if duplicated or accidentally concatenated
  const match = cleaned.match(/^(https?:\/\/[a-zA-Z0-9.\-_]+(?::\d+)?)/);
  if (match) {
    cleaned = match[1];
  }
  return cleaned.replace(/\/+$/, '');
}

const API_BASE = sanitizeApiBase(process.env.NEXT_PUBLIC_API_URL);

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

// In-memory client cache for fast navigation and reducing duplicate network requests
const clientCache = {
  activePolicy: new Map<number, { data: PolicyResponseDto | null; timestamp: number }>(),
  matches: new Map<string, { data: HospitalMatchResultDto[]; timestamp: number }>(),
  hospitals: new Map<number, { data: HospitalDto | null; timestamp: number }>(),
};

const CACHE_TTL_MS = 60_000; // 60 seconds

export const api = {
  // Clear cache if policy changes
  invalidateCache() {
    clientCache.activePolicy.clear();
    clientCache.matches.clear();
    clientCache.hospitals.clear();
  },

  // Policies
  async getActivePolicy(patientId: number = 1, forceRefresh = false): Promise<PolicyResponseDto | null> {
    const cached = clientCache.activePolicy.get(patientId);
    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const res = await fetch(`${API_BASE}/api/policies/patient/${patientId}/active`, {
        cache: 'no-store',
      });
      if (res.status === 404) {
        clientCache.activePolicy.set(patientId, { data: null, timestamp: Date.now() });
        return null;
      }
      const data = await handleResponse<PolicyResponseDto>(res);
      clientCache.activePolicy.set(patientId, { data, timestamp: Date.now() });
      return data;
    } catch (e) {
      console.warn('Failed to fetch active policy:', e);
      return cached ? cached.data : null;
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
    api.invalidateCache();
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
    api.invalidateCache();
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

  async getHospitalById(id: number, forceRefresh = false): Promise<HospitalDto | null> {
    const cached = clientCache.hospitals.get(id);
    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const res = await fetch(`${API_BASE}/api/hospitals/${id}`, {
        cache: 'no-store',
      });
      if (res.status === 404) {
        clientCache.hospitals.set(id, { data: null, timestamp: Date.now() });
        return null;
      }
      const data = await handleResponse<HospitalDto>(res);
      clientCache.hospitals.set(id, { data, timestamp: Date.now() });
      return data;
    } catch (e) {
      console.warn(`Failed to fetch hospital ${id}:`, e);
      return cached ? cached.data : null;
    }
  },

  async matchHospitals(request: HospitalMatchRequestDto = { patientId: 1 }, forceRefresh = false): Promise<HospitalMatchResultDto[]> {
    const cacheKey = JSON.stringify(request);
    const cached = clientCache.matches.get(cacheKey);
    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const res = await fetch(`${API_BASE}/api/hospitals/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        cache: 'no-store',
      });
      const data = await handleResponse<HospitalMatchResultDto[]>(res);
      clientCache.matches.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (e) {
      console.warn('Failed to execute hospital matching:', e);
      return cached ? cached.data : [];
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
