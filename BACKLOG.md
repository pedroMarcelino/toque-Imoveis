# Tarefas antes de publicar

## Segurança
- [ ] Adicionar authMiddleware nas rotas de CRUD de imóveis (criar/editar/deletar)
- [ ] Remover hash de senha das respostas de create/login do usuário
- [ ] Adicionar validação de ID (isValidId) antes de queries no service

## Backend - Correções
- [ ] Corrigir bug de copy-paste no controller (source sempre "CreateProperty")
- [ ] Ajustar status HTTP (criar = 201, deletar = 204)
- [x] Adicionar middleware global de erros + rota 404 no app.js
- [ ] Mover URI do MongoDB para variável de ambiente (remover hardcode)

## Configuração
- [ ] Atualizar .env.example com variáveis do Cloudinary
- [ ] Limpar console.logs de debug (isValidId, uploadImages)

## Model
- [ ] Definir se `isActive` será usado (soft delete) ou removido
- [ ] Adicionar campo `createdBy` referenciando User nos imóveis

## Melhorias
- [ ] Adicionar paginação/filtros no getProperties
- [ ] Limpar import morto de auth.routes.js no index de rotas

## Concluidos
- [x] middleware global de erros + rota 404 no app.js (retorna JSON)
- [x] fileFilter do multer aceita por extensao ou mimetype (uploads com mimetype octet-stream)