# Tech Lab Platform

> Plataforma SaaS de consultoria técnica personalizada, onde clientes passam por um diagnóstico estruturado, realizam o pagamento e recebem um painel sob medida, gerado conforme suas necessidades de negócio, tecnologia e maturidade.

O sistema foi projetado com uma arquitetura de engenharia de software, com foco em escalabilidade, segurança e operação profissional (Tech Ops).

---

## 🎯 Objetivo do Projeto

Oferecer consultoria técnica estratégica para:

-   Protótipos e MVPs
-   Produtos digitais em produção
-   Negócios web e SaaS em escala

Nosso objetivo é transformar as respostas de um questionário inteligente em:

-   **Diagnóstico técnico** detalhado.
-   **Roadmap estratégico** acionável.
-   **Painel do cliente** personalizado.
-   **Liberação de funcionalidades** condicionada a pagamentos.
-   **Uso de IA** como apoio técnico, nunca como sistema autônomo.

---

## 🧱 Arquitetura Final (FLAGSHIP)

O sistema opera sob uma arquitetura de responsabilidade única, onde o **Backend (Go) é a fonte da verdade absoluta**.

### Frontend (Next.js)

Camada de apresentação pura. Responsável pela UI/UX, coleta de dados e navegação.
-   **NUNCA** contém regras de negócio.
-   **NUNCA** se conecta diretamente ao banco de dados.
-   **NUNCA** chama serviços de IA diretamente.

### Backend (Go)

O coração do sistema e a única fonte da verdade.
-   **Controla**: Autenticação (JWT + RBAC), regras de negócio, planos, pagamentos, permissões, painéis, e a integração com o WhatsApp Bot e o serviço de IA.
-   **Toda decisão nasce aqui.**

### Banco de Dados (Supabase/Postgres)

Atua exclusivamente como um banco de dados relacional.
-   **NÃO** é usado para autenticação no frontend.
-   **NÃO** possui lógica de negócio (Policies, RLS, Functions).
-   **NÃO** é acessado por nenhum SDK no cliente.

### IA Service (Python / Genkit)

Serviço de apoio à decisão, chamado **exclusivamente** pelo backend Go.
-   Retorna **JSON estruturado**, nunca texto livre para decisões.
-   Toda interação é auditável e registrada pelo backend.

---

## 📌 Princípios da Arquitetura

1.  **Backend é a Fonte da Verdade**: Se é uma decisão, pertence ao backend. O frontend apenas renderiza o que a API autoriza.
2.  **Autenticação Centralizada**: O Backend Go emite e valida todos os tokens JWT. O frontend apenas armazena e envia o token.
3.  **Banco de Dados Isolado**: O acesso direto do cliente (frontend) ao banco de dados é estritamente proibido.
4.  **IA como Serviço de Apoio**: A IA sugere, o backend valida, decide e audita.
5.  **Painel como Contrato**: A UI do cliente é um reflexo direto do que o backend permitiu, baseado em seu plano e status.
6.  **Segurança por Design**: Webhooks são validados, endpoints são protegidos (rate limit, RBAC), e todos os segredos residem no backend.
7.  **Observabilidade por Padrão**: O sistema nasce com logs estruturados, healthchecks reais e métricas, garantindo que não opere como uma caixa-preta.

---

## ⚙️ Fluxo Principal do Produto

O cliente não compra um sistema pronto. Ele passa por um diagnóstico, paga pela consultoria e recebe um ambiente ajustado às suas necessidades.

```
Site → Cadastro → Questionário → Pagamento → Análise (Backend + IA) → Painel Configurado → Consultoria Ativa
```

---

## 🛠️ Operação e Saúde do Sistema (Tech Ops)

A saúde do sistema é monitorada através do backend, garantindo uma operação profissional.

-   **Healthcheck**: O endpoint `GET /health` verifica o status da API, a conexão com o banco de dados e a comunicação com serviços externos em tempo real.
-   **Logs Estruturados**: Todas as ações e erros são registrados em formato JSON com um `request_id` único para rastreamento completo de ponta a ponta.
-   **Painel de Tech Ops**: A área de administração (`/admin/tech-lab`) oferece uma visão centralizada sobre a saúde dos serviços, latência, métricas e logs críticos.
-   **Segurança**: Endpoints críticos são protegidos com `rate-limiting` e todos os webhooks (Pagamentos, WhatsApp) validam assinaturas para garantir a integridade.

---

## 🚀 Preparo para Escala Futura

A arquitetura foi projetada para evoluir. As seguintes áreas são pontos estratégicos para futuras otimizações:

-   **Cache**: Endpoints de leitura intensiva (configuração de painéis, etc.) podem ser otimizados com uma camada de cache (ex: Redis).
-   **Filas (Queues)**: Processos assíncronos (envio de e-mails, notificações) podem ser delegados a uma fila (ex: RabbitMQ, SQS) para aumentar a resiliência e a responsividade da API.
-   **IA e Custos**: O serviço de IA, sendo um ponto de custo variável, deve ter seu uso monitorado por cliente. As chamadas podem ser otimizadas e cacheadas.
-   **Backup e Restore**: O procedimento de backup do banco de dados (Postgres) deve ser automatizado e testado periodicamente.

---

## 📄 Licença

Projeto privado. Uso interno para consultoria técnica personalizada. Distribuição ou uso comercial externo apenas mediante autorização.
