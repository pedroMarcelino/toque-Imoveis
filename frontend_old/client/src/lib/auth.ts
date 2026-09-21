import { api } from "./api";
import { clearToken, setToken } from "./api";

export interface AuthUser {
  _id?: string;
  name?: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  user: AuthUser & { password?: string };
  token: string;
}

const USER_KEY = "toque.user";

function persistUser(user: AuthUser & { password?: string }): AuthUser {
  const { password: _pw, ...safe } = user;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(safe));
  } catch {
    /* storage indisponível */
  }
  return safe;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const data = await api.post<LoginResponse>("/user/login", { email, password });
  setToken(data.token);
  return persistUser(data.user ?? { email });
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthUser> {
  const data = await api.post<LoginResponse>("/user", { name, email, password });
  setToken(data.token);
  return persistUser(data.user ?? { email });
}

export function getUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function logout(): void {
  clearToken();
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    /* storage indisponível */
  }
}