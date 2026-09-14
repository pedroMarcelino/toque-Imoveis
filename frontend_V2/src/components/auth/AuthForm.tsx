import { useState } from 'react'
import { Link } from 'wouter'
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import Brand from '../layout/Brand'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { login, register } from '../../services/authService'
import { loginSchema, registerSchema } from '../../types/auth'
import type { AuthUser } from '../../types/auth'

type Mode = 'login' | 'register'

interface FieldErrors {
  name?: string
  email?: string
  password?: string
}

interface AuthFormProps {
  onSuccess: (user: AuthUser) => void
  defaultMode?: Mode
}

export default function AuthForm({ onSuccess, defaultMode = 'login' }: AuthFormProps) {
  const [mode, setMode] = useState<Mode>(defaultMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)

  const switchMode = (next: Mode) => {
    if (next === mode) return
    setMode(next)
    setErrors({})
    setPassword('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    const input = mode === 'login' ? { email, password } : { name, email, password }
    const parsed = (mode === 'login' ? loginSchema : registerSchema).safeParse(input)

    if (!parsed.success) {
      const next: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FieldErrors
        if (field && !next[field]) next[field] = issue.message
      }
      setErrors(next)
      return
    }

    setErrors({})
    setLoading(true)
    try {
      const user = mode === 'login' ? await login(parsed.data) : await register(parsed.data)
      toast.success(mode === 'login' ? 'Login realizado' : 'Conta criada')
      onSuccess(user)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro na autenticação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="surface w-full max-w-md rounded-3xl p-8 sm:p-9">
      <div className="flex justify-center">
        <Brand variant="inline" />
      </div>

      <h1 className="mt-10 font-display text-3xl font-semibold">Área profissional</h1>
      <p className="mt-3 text-slate-500">
        {mode === 'login'
          ? 'Entre com a sua conta para gerir o catálogo.'
          : 'Crie uma conta para começar.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
        {mode === 'register' && (
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              enterKeyHint="next"
            />
            {errors.name && <p className="mt-1 text-xs font-medium text-red-600">{errors.name}</p>}
          </div>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
            enterKeyHint="next"
          />
          {errors.email && <p className="mt-1 text-xs font-medium text-red-600">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              enterKeyHint="go"
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-1 flex size-11 items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password ? (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.password}</p>
          ) : mode === 'register' ? (
            <p className="mt-1 text-xs text-slate-400">Mínimo de 6 caracteres.</p>
          ) : null}
        </div>

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {mode === 'login' ? (
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
        onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
        className="mt-5 block w-full text-center text-sm font-semibold text-primary"
        type="button"
      >
        {mode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
      </button>

      <Link href="/" className="mt-5 block text-center text-sm font-semibold text-primary">
        Voltar ao site
      </Link>
    </div>
  )
}