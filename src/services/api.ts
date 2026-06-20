import API_BASE_URL from '@/src/config/api';

interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data: T;
  message: string;
  timestamp: number;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    return response.json();
  }

  async get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string) {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async health() {
    return this.get<{ status: string }>('/health');
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
