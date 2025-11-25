let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  const isPublic = path.startsWith("/accounts/login/") || path.startsWith("/accounts/register/");
  if (authToken && !isPublic) headers.set("Authorization", `Bearer ${authToken}`);
  const res = await fetch(`/api${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    try {
      const data = JSON.parse(text);
      if (data?.code === "token_not_valid") {
        setAuthToken(null);
      }
    } catch {
      // ignore parse error
    }
    throw new Error(text || `Erro ${res.status}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return (await res.json()) as T;
  return undefined as unknown as T;
}