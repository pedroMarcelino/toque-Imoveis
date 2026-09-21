# Frontend - Toque Imóveis

## Visão Geral
Frontend em React 19 + Vite 7 + Tailwind CSS 4 + TanStack Query 5 + wouter,
totalmente em pt-BR e BRL, conectado ao backend Express (porta 3000) via REST.
Qualquer usuário autenticado é tratado como administrador.

## Como rodar
1. Subir o backend: `cd backend && npm run start` (porta 3000).
2. Subir o frontend: `cd frontend && npm run dev` (porta 5173).
3. Opcional: definir `VITE_API_URL` (default `http://localhost:3000`) no
   frontend para apontar para outro backend (ex: produção). Em produção usa-se
   `frontend/.env.production` (`VITE_API_URL=https://toque-imoveis.onrender.com`),
   commitado e injetado no build de produção (`.env`/`.env.local` são ignorados pelo git).

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
  - `AdminDashboard.tsx` - gestão de imóveis (lista status=todos, editar, excluir com confirmação, novo)
  - `AdminForm.tsx` - criar/editar imóvel + upload de imagens (multi, Cloudinary)
  - `Users.tsx` - aprovação de usuários registrados (lista, badge Aprovado/Pendente, botão Aprovar)
  - `NotFound.tsx` - 404
- `components/layout/` - Brand, Header, Footer
- `components/property/` - PropertyCard, SearchBar, EmptyState
- `components/ui/` - kit shadcn/ui + `Select` e `Textarea` (não modificado)
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
| `/admin/novo` | AdminForm (criar imóvel) — requer login |
| `/admin/editar/:id` | AdminForm (editar imóvel) — requer login |
| `/admin/dashboard` | Admin |
| `/admin/usuarios` | Users (aprovação de cadastros) — requer login |
| qualquer outra | NotFound |

## Convenções
- Texto/UI em pt-BR; dinheiro via `formatBRL` (Intl.NumberFormat `pt-BR`, BRL).
- Campos do backend em inglês (label() traduz para exibição).
- Autenticação: qualquer usuário logado tem acesso à área profissional; registro não loga
  (aguarda aprovação); login bloqueia 403 até o usuário ser aprovado; entradas de escrita
  (imóveis) e a página de Usuários exigem `isApproved=true`.
- Upload de imagens: `PATCH /property/:id/images`, form-data com campo `images`,
  header `Authorization: Bearer <token>`.
- Valores numéricos (preço, área, quartos etc.) vindos do backend são tratados
  como número (R$ 1.000,00 por exemplo) — sem notação EUR (padrão antigo removed).
- **Forms (regra geral - gravar em todo form):**
  - Botão de submit fica `disabled` até todos os campos obrigatórios estarem
    preenchidos e válidos (evita requisições atoa; `disabled={!canSubmit || loading}`).
  - Validação ao vivo com zod: erros de formato (email, senha, etc.) aparecem em
    vermelho (`text-red-600`) embaixo do campo, mostrados quando o campo tem conteúdo.
  - Registrar (register) exige `confirmPassword` (confirmação de senha), validada
    no front (zod `superRefine`) e também no backend (service) — "As senhas não coincidem".

## Comandos
- `npm run dev` - dev server (Vite)
- `npm run check` - typecheck (tsc --noEmit)
- `npm run build` - typecheck + build de produção
- `npm run preview` - preview do build
- `npm run format` - prettier

## Pendências do frontend
- Telas de catálogo (`Catalog`), detalhe (`Detail`) e home (`Home`) ainda são "em construção"
  (backend já tem tudo; falta consumir no front).
- Verificar se `hero-grid` tem definição no CSS global (somente estética).
- Sem página de contato própria; contato direto do rodapé/WhatsApp/mailto.