import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

const TOKEN_KEY = "vf_token";
const USER_KEY = "vf_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  const persist = (nextToken, nextUser) => {
    if (nextToken) localStorage.setItem(TOKEN_KEY, nextToken);
    else localStorage.removeItem(TOKEN_KEY);
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(USER_KEY);
    setToken(nextToken);
    setUser(nextUser);
  };

  // On mount, if we have a token, confirm it's still valid via /auth/me
  // and refresh the cached user object.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await api.get("/auth/me");
        if (!cancelled) setUser(me);
        if (!cancelled) localStorage.setItem(USER_KEY, JSON.stringify(me));
      } catch {
        if (!cancelled) persist(null, null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.post("/auth/login", { email, password }, { auth: false });
    persist(data.token, data.user);
    return data.user;
  }, []);

  const adminLogin = useCallback(async (email, password) => {
    const data = await api.post("/auth/admin/login", { email, password }, { auth: false });
    persist(data.token, data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await api.post("/auth/register", payload, { auth: false });
    // Contract leaves it open whether register returns a token — handle both.
    if (data && data.token) persist(data.token, data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    persist(null, null);
    // POST /auth/logout is optional per contract (stateless JWT) — fire and forget.
    api.post("/auth/logout", {}).catch(() => {});
  }, []);

  const value = {
    token,
    user,
    loading,
    isAuthenticated: !!token,
    isAdmin: user?.user?.role === "admin",
    login,
    adminLogin,
    register,
    logout,
  };



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
