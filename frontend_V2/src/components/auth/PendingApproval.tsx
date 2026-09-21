import { Clock3, LogOut } from 'lucide-react'
import Brand from '../layout/Brand'
import { Button } from '../ui/Button'

export default function PendingApproval({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="grid min-h-[calc(100dvh-4rem)] place-items-center bg-background px-5 py-20 sm:min-h-[calc(100dvh-5rem)]">
      <div className="surface w-full max-w-md rounded-3xl p-8 text-center sm:p-9">
        <div className="flex justify-center">
          <Brand variant="inline" />
        </div>
        <div className="mx-auto mt-8 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Clock3 size={28} />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold">Aprovação pendente</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Sua conta ainda não foi aprovada por um profissional. Assim que for aprovada,
          você poderá acessar a área profissional.
        </p>
        <Button size="lg" variant="outline" onClick={onLogout} className="mt-8 w-full">
          <LogOut size={17} /> Sair
        </Button>
      </div>
    </div>
  )
}