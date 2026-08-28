# SPEC — toque-Imoveis (backend)

> Última atualização: 2026-08-28
> Lido no início de cada sessão. Mantenha atualizado conforme o projeto evolui.

## 1. Stack
- Node.js (ESM — `"type": "module"`), Express 5
- MongoDB via Mongoose 9
- Autenticação: JWT (`jsonwebtoken`) + `bcrypt`
- Upload de imagens: Cloudinary + `multer` + `streamifier`
- Dev server: `nodemon` (`npm start` -> `src/server.js`)
- `dotenv` para variáveis de ambiente

## 2. Estrutura (backend/src)
- `server.js` — sobe o servidor (`dotenv/config`, `PORT` 3000, `app.listen`)
- `app.js` — config do Express: `cors()`, `express.json()`, `connection()`, monta rotas
- `config/database.js` — `connection()` Mongoose
- `routes/index.js` — agrega rotas (`/property`, `/user`)
  - `auth.routes.js` está **comentado** em `index.js` (ainda não ativo)
- `controller/` — `propertyController.js`, `userController.js`
- `service/` — `propertyService.js`, `userService.js`
- `model/` — `Property.js`, `User.js`
- `util/` — `isValidId.js`, `appError.js`

## 3. Decisões e convenções
- Padrão em camadas: `routes -> controller -> service -> model`
- `server.js` e `app.js` separados (app = config da aplicação, server = boot/escuta)
- Model `Property`:
  - `type` enum: `casa`, `apartamento`, `terreno`, `comercial`, `chacara`, `sobrado`
  - `purpose` enum: `venda`, `aluguel`
  - `status` enum: `disponivel`, `vendido`, `alugado`, `indisponivel` (default `disponivel`)
  - `images[]`: objetos `{ url, publicId }` do Cloudinary
  - `address` aninhado (street, number, neighborhood, city, state uppercase, zipCode)
  - `timestamps: true`
- `.env.example`: `DB_USER`, `DB_PASSWORD`, `PORT` (URI completa do Mongo ainda não definida)
- Frontend: ainda não existe neste repo (apenas `backend/`)
- Idioma dos comentários no código: português
