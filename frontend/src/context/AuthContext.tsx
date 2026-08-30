import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  AuthUser,
  fetchMe,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  setPassword as setPasswordRequest,
  resetPassword as resetPasswordRequest,
} from '../api/client';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string) => Promise<string>;
  setPassword: (username: string, token: string, password: string) => Promise<void>;
  resetPassword: (username: string, token: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then((currentUser) => setUser(currentUser))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const loggedInUser = await loginRequest(email, password);
    setUser(loggedInUser);
  }, []);

  const register = useCallback(async (username: string, email: string) => {
    return registerRequest(username, email);
  }, []);

  const setPassword = useCallback(async (username: string, token: string, password: string) => {
    const loggedInUser = await setPasswordRequest(username, token, password);
    setUser(loggedInUser);
  }, []);

  const resetPassword = useCallback(async (username: string, token: string, password: string) => {
    const loggedInUser = await resetPasswordRequest(username, token, password);
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, setPassword, resetPassword, logout }),
    [user, loading, login, register, setPassword, resetPassword, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
