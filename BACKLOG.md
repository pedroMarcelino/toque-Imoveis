# Tarefas antes de publicar

## Segurança
- [x] Adicionar authMiddleware nas rotas de CRUD de imóveis (criar/editar/deletar) — feito em 15-09
- [x] Remover hash de senha das respostas de create/login do usuário — feito em 21-09
- [ ] Adicionar validação de ID (isValidId) antes de queries no service
- [x] Aprovação de usuários: registro não loga (isApproved=false), login 403 até aprovação,
      escrita de imóveis exige aprovado (requireApproved) — feito em 21-09

## Backend - Correções
- [x] Corrigir bug de copy-paste no controller (source sempre "CreateProperty") — feito em 15-09
- [x] Ajustar status HTTP (criar = 201, deletar = 204) — feito em 15-09
- [x] Adicionar middleware global de erros + rota 404 no app.js
- [ ] Mover URI do MongoDB para variável de ambiente (remover hardcode)

## Configuração
- [ ] Atualizar .env.example com variáveis do Cloudinary
- [ ] Limpar console.logs de debug (isValidId, uploadImages)

## Model
- [ ] Definir se `isActive` será usado (soft delete) ou removido
- [ ] Adicionar campo `createdBy` referenciando User nos imóveis

## Melhorias
- [ ] Limpar import morto de auth.routes.js no index de rotas
- [x] Frontend: página de criação e gestão de imóveis (AdminForm + AdminDashboard) — feito em 15-09
- [x] Frontend: deletar imagem de imóvel (DELETE /property/:id/images/:imageId + X nas fotos do AdminForm) — feito em 21-09
- [x] Frontend: seção Usuários (aprovar cadastros) no AdminDashboard — feito em 21-09
- [ ] Frontend: montar telas de catálogo, detalhe (galeria com mais de 3 fotos) e home
      consumindo o backend (hoje "em construção")

## Concluidos
- [x] middleware global de erros + rota 404 no app.js (retorna JSON)
- [x] fileFilter do multer aceita por extensao ou mimetype (uploads com mimetype octet-stream)
- [x] Adicionar paginação/filtros no getProperties (search, tipo, finalidade, cidade,
      quartos, minPreco, maxPreco, status, page, pageSize<=50) — feito em 2026-08-30
- [x] Frontend conectado ao backend (ver FRONTEND.md): template full-stack removido,
      App.tsx dividido em rotas (Home, Catalog, Detail, Admin), admin = qualquer usuário logado