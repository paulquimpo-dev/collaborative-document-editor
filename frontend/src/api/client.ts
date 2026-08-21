const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function getApiBaseUrl(): string {
  if (!configuredApiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is required. Configure it in frontend/.env.");
  }
  return configuredApiBaseUrl.replace(/\/$/, "");
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (
    payload &&
    typeof payload === "object" &&
    "detail" in payload &&
    typeof payload.detail === "string"
  ) {
    return payload.detail;
  }
  return fallback;
}

interface ApiRequestOptions extends RequestInit {
  userId?: number;
}

export async function apiRequest<T>(
  path: string,
  { userId, headers, ...options }: ApiRequestOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (userId !== undefined) {
    requestHeaders.set("X-User-Id", String(userId));
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: requestHeaders,
  });

  if (!response.ok) {
    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
    throw new Error(
      getErrorMessage(payload, `Request failed with status ${response.status}.`),
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
