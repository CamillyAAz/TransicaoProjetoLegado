import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setAuthToken, apiFetch } from "@/lib/api";

type User = {
  id: number;
  nome: string;
  email: string;
  cargo?: string | null;
  nivel_acesso?: string | null;
  ui_permissoes?: string | null;
  is_staff?: boolean;
  is_superuser?: boolean;
};

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed.user || null);
      setAccessToken(parsed.access || null);
    }
  }, []);

  useEffect(() => {
    setAuthToken(accessToken);
  }, [accessToken]);

  const login = async ({ email, password }: { email: string; password: string }) => {
    // Validação simples: apenas verifica se o email contém @
    if (!email.includes("@")) {
      throw new Error("Email inválido");
    }
    
    try {
      const data = await apiFetch<{ refresh: string; access: string; user: User }>(
        "/accounts/login/",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );
      setUser(data.user);
      setAccessToken(data.access);
      setAuthToken(data.access);
      localStorage.setItem("auth", JSON.stringify({ user: data.user, access: data.access, refresh: data.refresh }));
    } catch (err: unknown) {
      const rawMessage = typeof (err as Error)?.message === "string" ? (err as Error).message : "";
      try {
        const parsed = JSON.parse(rawMessage);
        const detail = parsed?.detail || "Erro ao fazer login";
        throw new Error(detail);
      } catch {
        throw new Error(rawMessage || "Erro ao fazer login");
      }
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("auth");
  };

  const value = useMemo(() => ({ user, accessToken, login, logout }), [user, accessToken]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}