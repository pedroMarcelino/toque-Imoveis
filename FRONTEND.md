# Frontend - Toque Imóveis

## Visão Geral
Frontend em React 19 + Vite 7 + Tailwind CSS 4 + TanStack Query 5 + wouter,
totalmente em pt-BR e BRL, conectado ao backend Express (porta 3000) via REST.
Qualquer usuário autenticado é tratado como administrador.

## Como rodar
1. Subir o backend: `cd backend && npm run start` (porta 3000).
2. Subir o frontend: `cd frontend && npm run dev` (porta 5173).
3. Opcional: definir `VITE_API_URL` (default `http://localhost:3000`) no
   frontend para apontar para outro backend (ex: produção).

## Estrutura (frontend/client/src)
- `lib/` - camada de integração com o backend
  - `api.ts` - fetch wrapper (injeta Bearer token, lança `ApiError`)
  - `types.ts` - tipos Property, PropertyFilters, PropertyListResponse, AuthUser
  - `properties.ts` - getProperties (filtros/paginação), getProperty, create,
    update, delete, uploadPropertyImages
  - `auth.ts` - login, register, getUser, logout (localStorage `toque.token` e
    `toque.user`)
  - `constants.ts` - CONTACT, formatBRL, label() e fallbackImages
- `hooks/useAuth.ts` - estado de autenticação (`user`, `isAuthenticated`, `logout`)
- `pages/`
  - `Home.tsx` - landing (hero + busca + destaques)
  - `Catalog.tsx` - lista com filtros e paginação
  - `Detail.tsx` - imóvel individual (galeria, specs, contato/WhatsApp)
  - `Admin.tsx` - gate de autenticação (login/registro) para a área profissional
  - `AdminDashboard.tsx` - visão geral (contadores, lista com status=todos, CRUD)
  - `AdminForm.tsx` - formulário criar/editar + upload de imagens
  - `NotFound.tsx` - 404
- `components/layout/` - Brand, Header, Footer
- `components/property/` - PropertyCard, SearchBar, EmptyState
- `components/ui/` - kit shadcn/ui (não modificado)
- `contexts/ThemeContext.tsx` - tema claro/escuro (custom, sem next-themes)
- `main.tsx` - QueryClientProvider
- `App.tsx` - rotas (wouter) + ErrorBoundary + ThemeProvider + Toaster

## Rotas
| Rota | Página |
| --- | --- |
| `/` | Home |
| `/imoveis` | Catalog (aceita `?search=`) |
| `/imoveis/:id` | Detail |
| `/admin` | Admin (login/registro → dashboard) |
| qualquer outra | NotFound |

## Convenções
- Texto/UI em pt-BR; dinheiro via `formatBRL` (Intl.NumberFormat `pt-BR`, BRL).
- Campos do backend em inglês (label() traduz para exibição).
- Autenticação: qualquer usuário logado tem acesso à área profissional.
- Upload de imagens: `PATCH /property/:id/images`, form-data com campo `images`,
  header `Authorization: Bearer <token>`.
- Valores numéricos (preço, área, quartos etc.) vindos do backend são tratados
  como número (R$ 1.000,00 por exemplo) — sem notação EUR (padrão antigo removed).

## Comandos
- `npm run dev` - dev server (Vite)
- `npm run check` - typecheck (tsc --noEmit)
- `npm run build` - typecheck + build de produção
- `npm run preview` - preview do build
- `npm run format` - prettier

## Pendências do frontend
- Verificar se `hero-grid` tem definição no CSS global (somente estética).
- Sem página de contato própria; contato direto do rodapé/WhatsApp/mailto.