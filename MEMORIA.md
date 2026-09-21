# Memoria do Projeto - Toque Imoveis

## Regras desta memoria
- Sempre ler SPEC.md e este arquivo no inicio de cada sessao.
- A cada correcao feita pelo usuario ou mudanca relevante, atualizar
  este arquivo ou os .md do projeto (sempre com permissao previa do usuario).
- O usuario me chama de "funcy". Sempre me apresentar como "funcy".
- Sugerir commits em momentos oportunos (ex: apos um conjunto de
  correcoes concluido ou uma funcionalidade completa), aguardando
  o usuario aprovar antes de commitar.

## Visao Geral
Backend de imobiliaria com Node.js + Express 5 + MongoDB (Mongoose 9).
Padrao em camadas: routes -> controller -> service -> model.
Autenticacao: JWT (7 dias) + bcrypt (10 rounds).
Upload de imagens: Cloudinary via multer (memory storage) + streamifier.

Frontend em React 19 + Vite 7 + Tailwind 4 + TanStack Query 5 + wouter (pt-BR/BRL),
conectado ao backend via REST. Mais detalhes em FRONTEND.md.

## Estrutura (backend/src)
- server.js / app.js - boot e config do Express
- config/ - database.js, cloudinary.js, multer.js
- controller/ - propertyController.js, userController.js
- service/ - propertyService.js, userService.js
- model/ - Property.js, User.js
- routes/ - index.js (agrega), property.routes.js, user.route.js
- middleware/ - auth.js (JWT Bearer)
- util/ - appError.js, isValidId.js, token.js

## Status Atual
- MVP funcional: CRUD imoveis + imagens Cloudinary + auth usuarios
- Auth so aplicada na rota de upload de imagens
- isValidId escrito mas nao usado
- .env.example incompleto (falta Cloudinary)
- isActive definido no model mas nao utilizado
- getProperty/getProperties ja corrigidos (await) - feito pelo usuario
- Multer aceita imagem por extensao ou mimetype (corrige uploads com mimetype octet-stream)
- Middleware global de erros + 404 no app.js retornam JSON
- Fluxo completo testado OK em 2026-08-30: registro, login, criar imovel, upload .jpg,
  rejeicao .txt (400), sem token (401), token invalido (401), rota inexistente (404),
  senha errada (401)
- GET /property estendido com filtros/paginacao (search, tipo, finalidade, cidade,
  quartos, minPreco, maxPreco, status=disponivel por padrao, page, pageSize<=50) - feito nesta sessao
- Frontend reconstruido (26-08 a 30-08): template full-stack removido (server/shared/drizzle/trpc),
  nova altura em lib/ + pages/ + components/, App.tsx dividido em rotas wouter
- Frontend compila: npm run check e npm run build OK em 2026-08-30
- Smoke test 2026-08-30: backend 3000 respondendo, vite 5173 servindo rotas, CORS ok
- Pagina admin de gestao e criacao de imoveis pronta (15-09): AdminDashboard (lista status=todos,
  editar/excluir com confirmacao) + AdminForm (criar/editar + upload imagens Cloudinary), mobile-first;
  rotas /admin/novo e /admin/editar/:id protegidas por login (Redirect p/ /admin)
- Backend: CRUD de imoveis agora exige token (authMiddleware em criar/editar/deletar + upload);
  status HTTP corrigidos (criar=201, deletar=204) e source do controller corrigido (fim do copy-paste)
- Auth: sessao via localStorage (toque.token e toque.user); expiração do JWT checada no boot
  (authService.getUser) e 401 limpa a sessao + evento 'toque:session-expired' (useAuth escuta)
- Cadastro exige confirmacao de senha (front zod superRefine + backend userService)
- Aprovacao de usuarios (21-09): registro cria conta (isApproved=false) SEM sessao (painel
  "aguardando aprovacao"); login de nao-aprovado retorna 403; CRUD/upload/deletar imagem de
  /property so para logado + aprovado (authMiddleware + requireApproved); GET /user e
  PATCH /user/:id/approve so para aprovados; AdminDashboard ganhou secao "Usuarios"
  (lista todos, badge Aprovado/Pendente + botao Aprovar com confirmacao em toast);
  hash de senha removido das respostas de create/login; 1o usuario aprovado via banco de dados
- Secao "Usuarios" movida para pagina dedicada /admin/usuarios (Users.tsx, protegida por login
  + aprovado); link "Usuarios" no navbar (Header desktop + MobileMenu) visivel so para logados;
  AdminDashboard mantem atalho "Usuarios" ao lado de "Novo imovel" - feito 21-09

## Convencoes
- Comentarios em portugues
- ESM ("type": "module")
- .env vars: DB_USER, DB_PASSWORD, PORT, JWT_SECRET, CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- Dev: `npm run dev` (nodemon src/server.js); start: `npm start` (node src/server.js)
- O usuario me chama de "funcy"
- Forms (regra geral, aplicada em todos os forms): submit desabilitado ate todos
  os campos obrigatorios preenchidos e validos; validacao ao vivo com erro em
  vermelho sob o campo; cadastro exige confirmacao de senha validada no front e
  no backend.

## Pendente antes de publicar
(ver BACKLOG.md)