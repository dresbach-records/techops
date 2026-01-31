✅ TODO — BACKEND COMPLETO (GO) | TECH LAB
0) Fundamentos do projeto

 Go ≥ 1.22

 Framework HTTP (Gin ou Fiber)

 Padrão Clean Architecture / Hexagonal

 Monorepo com backend-go/

 .env carregado com validação obrigatória

 Logs estruturados (JSON)

 Versionamento de API (/v1)

1) Bootstrap da API

Objetivo: subir a API com saúde, config e middlewares.

 cmd/api/main.go

 Loader de config (internal/config)

 Middleware:

 CORS

 Request ID

 Logger

 Rate limit

 Healthcheck

 GET /health

 GET /metrics (opcional)

2) Autenticação e Autorização

Objetivo: segurança total para cliente e admin.

 JWT (access + refresh)

 Hash de senha (bcrypt/argon2)

 RBAC (roles)

 admin

 consultor

 techops

 cliente

 Middlewares:

 AuthRequired

 RoleRequired

Endpoints

 POST /auth/login

 POST /auth/refresh

 POST /auth/logout

3) Usuários (internos e clientes)

 Model users

 PF / PJ

 Status (ativo, bloqueado)

 Vínculo com empresa/projeto

Endpoints

 GET /users/me

 GET /admin/users

 POST /admin/users

 PATCH /admin/users/:id

4) Onboarding por Diagnóstico (core do produto)

Objetivo: substituir cadastro tradicional.

 Persistência por etapas (card a card)

 Salvamento automático

 Validação progressiva

 Retomada do fluxo

Modelos

 diagnosticos

 diagnostico_steps

Endpoints

 POST /diagnostico/start

 PATCH /diagnostico/step/:step

 GET /diagnostico/status

 POST /diagnostico/finish

5) Pagamentos (gate de liberação)

Objetivo: nada libera sem pagamento.

 Integração (Asaas)

 Webhook seguro (próximo passo)

 Estados via Asaas: PENDING, CONFIRMED, FAILED

Modelos (AsaasCustomer, AsaasPayment)

 pagamentos

Endpoints

 POST /pagamentos/boleto

 POST /webhooks/pagamentos

 GET /pagamentos/status

6) Integração com IA (Centralizada no Frontend/Next.js)

Objetivo: IA apoia decisões, não manda. A lógica de IA foi centralizada.

 Status: A responsabilidade da IA foi movida para o stack do Next.js (usando Genkit),
 que atua como um "Backend for Frontend" (BFF).

 O backend Go NÃO se comunica mais com um serviço de IA separado.

Fluxo ATUAL:

Diagnóstico pago (Frontend)
 → Frontend (Server Action) chama Genkit Flow
 → Genkit retorna JSON estruturado
 → Frontend renderiza o painel

 O endpoint /internal/ia/analisar-diagnostico foi descontinuado.

7) Painel do Cliente (dinâmico)

Objetivo: painel gerado conforme diagnóstico.

 Builder de painel

 Módulos dinâmicos

 Permissões por módulo

Modelos

 paineis

 painel_modulos

Endpoints

 GET /cliente/painel

 GET /cliente/painel/modulos

8) Painel Admin (empresa)

Objetivo: operar a Tech Lab.

Clientes

 GET /admin/clientes

 GET /admin/clientes/:id

Diagnósticos

 GET /admin/diagnosticos

 PATCH /admin/diagnosticos/:id/aprovar

Consultorias

 GET /admin/consultorias

 POST /admin/consultorias/notas

Painéis

 Ativar / desativar módulos

 Ajustar roadmap

9) WhatsApp Bot (por projeto)

Objetivo: bot faz parte do projeto do cliente.

Configuração segura

 Salvar App ID, Business ID, Phone ID

 Nunca exibir secrets

 Rotação de tokens

Modelos

 whatsapp_projects

 whatsapp_logs

Endpoints

 POST /admin/projetos/:id/whatsapp/config

 GET /admin/projetos/:id/whatsapp/status

 POST /webhooks/whatsapp

10) Repositórios (GitHub)

Objetivo: análise técnica de código.

 Validar URL

 Conectar GitHub (read-only)

 Registrar análise

Endpoints

 POST /repositorios/analisar

 GET /repositorios/:id

11) Tech Ops (operação real)

Objetivo: manter tudo vivo e barato.

 Logs centralizados

 Métricas (requests, erros)

 Custos de IA por cliente

 Alertas básicos

Endpoints

 GET /admin/techops/health

 GET /admin/techops/metrics

12) Banco de Dados & Migrações

 Postgres

 Migrações versionadas

 Índices corretos

Tabelas mínimas

users

diagnosticos

pagamentos

paineis

painel_modulos

whatsapp_projects

whatsapp_logs

consultorias

13) Segurança (obrigatório)

 Secrets só no .env

 Webhooks com assinatura

 Rate limit por IP/usuário

 Auditoria de ações admin

14) Testes

 Unitários (services)

 Integração (handlers)

 Teste de webhook

 Teste de RBAC

15) Deploy & Produção

 Dockerfile

 docker-compose

 Nginx / Proxy

 Variáveis por ambiente

 Backup automático

🎯 RESULTADO FINAL

Quando esse TODO estiver completo, você terá:

Backend robusto

Produto vendável

IA controlada

WhatsApp Bot seguro

Painéis dinâmicos

Operação profissional
