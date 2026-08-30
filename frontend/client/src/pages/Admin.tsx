import { useState } from "react";
import { Link } from "wouter";
import { Building2, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login, register, type AuthUser } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import AdminDashboard from "./AdminDashboard";

function AuthScreen({ setUser }: { setUser: (u: AuthUser) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const user =
        mode === "login"
          ? await login(email, password)
          : await register(name, email, password);
      toast.success(mode === "login" ? "Login realizado" : "Conta criada");
      setUser(user);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro na autenticação"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eaf4f7] p-5">
      <div className="surface w-full max-w-md rounded-3xl p-9">
        <Link href="/">
          <a className="flex items-center justify-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-blue-900/20">
              <Building2 size={19} />
            </span>
            <span>
              <span className="block font-display text-xl font-semibold leading-none text-slate-900">
                Toque
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[.25em] text-primary">
                Imóveis
              </span>
            </span>
          </a>
        </Link>
        <h1 className="mt-10 font-display text-3xl font-semibold">
          Área profissional
        </h1>
        <p className="mt-3 text-slate-500">
          {mode === "login"
            ? "Entre com a sua conta para gerir o catálogo."
            : "Crie uma conta para começar."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          {mode === "register" && (
            <Input
              placeholder="Nome"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-primary"
          >
            {mode === "login" ? (
              <>
                <LogIn size={17} /> Entrar
              </>
            ) : (
              <>
                <UserPlus size={17} /> Criar conta
              </>
            )}
          </Button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-5 block w-full text-center text-sm font-semibold text-primary"
        >
          {mode === "login"
            ? "Não tem conta? Cadastre-se"
            : "Já tem conta? Entrar"}
        </button>

        <Link href="/">
          <a className="mt-5 block text-center text-sm font-semibold text-primary">
            Voltar ao site
          </a>
        </Link>
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, isAuthenticated, setUser, logout } = useAuth();

  if (!isAuthenticated) {
    return <AuthScreen setUser={setUser} />;
  }

  return <AdminDashboard user={user} logout={logout} />;
}
