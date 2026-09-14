import { Link } from 'wouter'
import { cn } from '../../lib/cn'

interface BrandProps {
  dark?: boolean
  size?: 'header' | 'auth'
  variant?: 'mark' | 'lockup' | 'inline'
}

export default function Brand({
  dark = false,
  size = 'header',
  variant = 'mark',
}: BrandProps) {
  if (dark) {
    return (
      <Link href="/" className="inline-flex w-fit">
        <span className="flex items-center justify-center rounded-2xl bg-white p-3 shadow-sm">
          <img
            src="/logo-img-nome.png"
            alt="Toque Imóveis"
            className="h-auto w-[150px]"
            loading="lazy"
          />
        </span>
      </Link>
    )
  }

  if (variant === 'lockup') {
    return (
      <Link href="/" className="flex items-center">
        <img
          src="/logo-img-nome.png"
          alt="Toque Imóveis"
          className="h-auto w-[150px]"
          loading="lazy"
        />
      </Link>
    )
  }

  if (variant === 'inline') {
    return (
      <Link href="/" className="flex items-center gap-3">
        <img
          src="/logo-img.png"
          alt="Toque Imóveis"
          className="h-20 w-auto md:h-24"
          loading="lazy"
        />
        <img
          src="/logo-nome.png"
          alt="Toque Imóveis"
          className="h-8 w-auto md:h-9"
          loading="lazy"
        />
      </Link>
    )
  }

  return (
    <Link href="/" className="flex items-center">
      <img
        src="/logo-img.png"
        alt="Toque Imóveis"
        className={cn('w-auto', size === 'auth' ? 'h-16 md:h-20' : 'h-11 md:h-12')}
        loading="lazy"
      />
    </Link>
  )
}