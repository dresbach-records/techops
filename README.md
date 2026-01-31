# Tech Lab

Plataforma SaaS voltada à consultoria técnica personalizada, onde clientes passam por um diagnóstico estruturado, realizam o pagamento e recebem uma área do cliente e painel personalizados, gerados conforme suas necessidades de negócio, tecnologia e maturidade técnica.

O sistema foi projetado com arquitetura de engenharia, foco em escalabilidade, segurança e operação profissional (Tech Lab).

🎯 **Objetivo do Projeto**

Oferecer consultoria técnica estratégica para:

*   Protótipos
*   MVPs
*   Produtos digitais
*   Negócios web e SaaS

Transformar respostas de um questionário inteligente em:

*   Diagnóstico técnico
*   Roadmap
*   Painel do cliente sob medida
*   Liberar funcionalidades somente após pagamento
*   Usar IA como apoio técnico, não como sistema autônomo

---

## 🧱 Arquitetura Final (FLAGSHIP - NÃO NEGOCIÁVEL)

O sistema opera sob uma arquitetura de responsabilidade única, onde o **Backend Go é a fonte da verdade absoluta**.

*   **Frontend (Next.js)**: Camada de apresentação pura. Responsável pela UI/UX, coleta de dados e navegação.
    *   **NUNCA** contém regras de negócio.
    *   **NUNCA** se conecta diretamente ao banco de dados (Supabase).
    *   **NUNCA** chama serviços de IA diretamente.

*   **Backend (Go)**: O coração do sistema e a única fonte da verdade.
    *   **Controla**: Autenticação (JWT + RBAC), regras de negócio, planos, pagamentos, permissões, painéis, e a integração com o WhatsApp Bot e o serviço de IA.
    *   **Toda decisão nasce aqui.**

*   **Supabase (Postgres as a Service)**: Atua exclusivamente como um banco de dados relacional.
    *   **NÃO** é usado para autenticação no frontend.
    *   **NÃO** possui lógica de negócio (Policies, Functions).
    *   **NÃO** é acessado por nenhum SDK no cliente.

*   **IA Service (Python / Genkit)**: Serviço de apoio à decisão, chamado exclusivamente pelo backend Go.
    *   Retorna **JSON estruturado**, nunca texto livre para decisões.
    *   Toda interação é auditável e registrada pelo backend.

---

## 📌 Princípios da Arquitetura (Decisões Travadas)

1.  **Backend é a Fonte da Verdade**: Se é uma decisão, pertence ao backend. O frontend apenas renderiza o que a API autoriza.
2.  **Autenticação Centralizada**: O Backend Go emite e valida todos os tokens. O frontend apenas armazena e envia o token.
3.  **Supabase é Apenas um Banco de Dados**: O acesso direto do frontend ao Supabase é proibido.
4.  **IA é um Serviço de Apoio, Não um Cérebro Autônomo**: A IA sugere, o backend valida e decide. Toda interação é controlada e auditada.
5.  **Painel é um Contrato, Não uma Tela**: O que o usuário vê é um reflexo direto do que o backend permitiu, baseado em seu plano e status de pagamento.
6.  **Segurança é Pré-requisito, Não Feature**: Webhooks são validados, endpoints são protegidos por rate limit, e todos os segredos residem no backend.
7.  **Observabilidade por Padrão**: O sistema nasce com logs estruturados, healthchecks reais e métricas, garantindo que não opere como uma caixa-preta.

---

## ⚙️ Fluxo Principal do Produto

O cliente não compra um sistema pronto. Ele passa por um diagnóstico técnico, paga pela consultoria e recebe um ambiente ajustado exatamente às suas necessidades.

**Site → Cadastro → Questionário → Pagamento → Backend analisa com IA → Painel configurado → Consultoria ativa**

---

## 🛠️ Operação e Saúde do Sistema (Tech Ops)

A saúde do sistema é monitorada através do backend, garantindo operação profissional.

*   **Healthcheck**: O endpoint `GET /health` verifica o status da API e a conexão com o banco de dados em tempo real.
*   **Logs Estruturados**: Todas as ações e erros são registrados em formato JSON com um `request_id` único para rastreamento completo.
*   **Painel de Tech Ops**: O painel de administração (`/admin/tech-lab`) oferece uma visão centralizada sobre a saúde dos serviços, latência, métricas e logs críticos.
*   **Segurança**: Endpoints críticos são protegidos com `rate-limiting` e todos os webhooks (Pagamentos, WhatsApp) validam assinaturas para garantir a integridade.

---

## 🚀 Preparo para Escala Futura

A arquitetura atual foi projetada para permitir a evolução. As seguintes áreas foram identificadas como pontos estratégicos para otimizações de escala:

*   **Cache**: Endpoints de leitura intensiva, como o de configuração de painéis, podem ser otimizados com uma camada de cache (ex: Redis).
*   **Filas (Queues)**: Processos assíncronos, como o envio de e-mails ou notificações pós-pagamento, podem ser delegados a uma fila (ex: RabbitMQ, SQS) para aumentar a resiliência e a responsividade da API.
*   **IA e Custos**: O serviço de IA, sendo um ponto de custo variável, deve ter seu uso monitorado por cliente. Chamadas podem ser otimizadas e cacheadas quando o input for idêntico.
*   **Backup e Restore**: O procedimento de backup do banco de dados (Postgres) deve ser automatizado e testado periodicamente.

---

## 📄 Licença

Projeto privado / uso interno / consultoria técnica personalizada. Distribuição ou uso comercial externo apenas mediante autorização.
