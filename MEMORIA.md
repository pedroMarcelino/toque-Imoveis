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

## Convencoes
- Comentarios em portugues
- ESM ("type": "module")
- .env vars: DB_USER, DB_PASSWORD, PORT, JWT_SECRET, CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- Dev com nodemon (npm start)
- O usuario me chama de "funcy"

## Pendente antes de publicar
(ver BACKLOG.md)