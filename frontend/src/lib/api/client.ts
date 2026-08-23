const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly errorBody: unknown,
    message: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = { message: res.statusText };
    }
    const msg =
      typeof body === 'object' && body !== null && 'message' in body
        ? String((body as Record<string, unknown>).message)
        : `HTTP ${res.status}`;
    throw new ApiClientError(res.status, body, msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const apiClient = {
  get<T>(path: string): Promise<T> {
    return fetch(`${API_BASE}${path}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    }).then(handleResponse<T>);
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then(handleResponse<T>);
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return fetch(`${API_BASE}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then(handleResponse<T>);
  },

  postFormData<T>(path: string, formData: FormData): Promise<T> {
    return fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    }).then(handleResponse<T>);
  },

  getBlob(path: string): Promise<Blob> {
    return fetch(`${API_BASE}${path}`, {
      method: 'GET',
    }).then((res) => {
      if (!res.ok) throw new ApiClientError(res.status, null, `HTTP ${res.status}`);
      return res.blob();
    });
  },
};

export { API_BASE };
