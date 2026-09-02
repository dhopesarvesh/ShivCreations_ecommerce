export const api = {
  baseURL: (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000/api/v1',
};

export async function fetchFromApi<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const response = await fetch(`${api.baseURL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let detail = `API request failed: ${response.status}`;
    try {
      const body = await response.json() as { detail?: string };
      if (body.detail) detail = body.detail;
    } catch {
      // Keep the HTTP status when the server does not return JSON.
    }
    throw new Error(detail);
  }

  return response.json() as Promise<T>;
}

export async function uploadImage(file: File, token: string | null): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`${api.baseURL}/admin/uploads/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!response.ok) throw new Error(`Image upload failed: ${response.status}`);
  const result = await response.json() as { url: string };
  return result.url.startsWith('http') ? result.url : `${new URL(api.baseURL).origin}${result.url}`;
}
