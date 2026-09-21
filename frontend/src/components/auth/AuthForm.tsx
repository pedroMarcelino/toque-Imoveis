import { useState } from 'react'
import { Link } from 'wouter'
import { Eye, EyeOff, LogIn, UserPlus, Clock3 } from 'lucide-react'
import { toast } from 'sonner'
import Brand from '../layout/Brand'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { login, register } from '../../services/authService'
import { loginSchema, registerSchema } from '../../types/auth'
import type { AuthUser, LoginInput, RegisterInput } from '../../types/auth'

type Mode = 'login' | 'register'

interface FieldErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

interface AuthFormProps {
  onSuccess: (user: AuthUser) => void
  defaultMode?: Mode
}

export default function AuthForm({ onSuccess, defaultMode = 'login' }: AuthFormProps) {
  const [mode, setMode] = useState<Mode>(defaultMode)
  const [registered, setRegistered] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const switchMode = (next: Mode) => {
    if (next === mode) return
    setMode(next)
    setRegistered(false)
    setPassword('')
    setConfirmPassword('')
  }

  const currentInput =
    mode === 'login'
      ? { email, password }
      : { name, email, password, confirmPassword }
  const currentSchema = mode === 'login' ? loginSchema : registerSchema

  const currentErrors: FieldErrors = {}
  const parsed = currentSchema.safeParse(currentInput)
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof FieldErrors
      if (field && !currentErrors[field]) currentErrors[field] = issue.message
    }
  }

  const hasErrors = Object.keys(currentErrors).length > 0
  const allFilled = Object.values(currentInput).every((value) =>
    typeof value === 'string' ? value.trim().length > 0 : true,
  )
  const canSubmit = allFilled && !hasErrors

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading || !canSubmit || !parsed.success) return

    setLoading(true)
    try {
      if (mode === 'login') {
        const user = await login(parsed.data as LoginInput)
        toast.success('Login realizado')
        onSuccess(user)
      } else {
        await register(parsed.data as RegisterInput)
        setRegistered(true)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro na autenticação')
    } finally {
      setLoading(false)
    }
  }

  if (registered) {
    return (
      <div className="surface w-full max-w-md rounded-3xl p-8 text-center sm:p-9">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Clock3 size={28} />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold">Conta criada!</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Sua conta foi cadastrada e está aguardando a aprovação de um profissional.
          Assim que for aprovada, você poderá acessar a área profissional.
        </p>
        <Button size="lg" onClick={() => switchMode('login')} className="mt-8 w-full">
          <LogIn size={17} /> Ir para o login
        </Button>
        <Link href="/" className="mt-5 block text-center text-sm font-semibold text-primary">
          Voltar ao site
        </Link>
      </div>
    )
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
            {name.trim() && currentErrors.name && (
              <p className="mt-1 text-xs font-medium text-red-600">{currentErrors.name}</p>
            )}
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
          {email.trim() && currentErrors.email && (
            <p className="mt-1 text-xs font-medium text-red-600">{currentErrors.email}</p>
          )}
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
              enterKeyHint={mode === 'register' ? 'next' : 'go'}
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
          {password.trim() && currentErrors.password ? (
            <p className="mt-1 text-xs font-medium text-red-600">{currentErrors.password}</p>
          ) : mode === 'register' ? (
            <p className="mt-1 text-xs text-slate-400">Mínimo de 6 caracteres.</p>
          ) : null}
        </div>

        {mode === 'register' && (
          <div>
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              enterKeyHint="go"
            />
            {confirmPassword.trim() && currentErrors.confirmPassword && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {currentErrors.confirmPassword}
              </p>
            )}
          </div>
        )}

        <Button type="submit" size="lg" disabled={!canSubmit || loading} className="w-full">
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