📁 ESTRUTURA RAIZ DO SISTEMA (MONOREPO)
techlab-platform/
│
├── frontend-next/          # Frontend (Next.js)
├── backend-go/             # Backend principal (Go)
├── ai-service/             # Serviço de IA (Python)
├── infra/                  # Infraestrutura e Tech Ops
├── docs/                   # Documentação técnica
├── scripts/                # Scripts auxiliares
├── .env.example
├── docker-compose.yml
└── README.md

🖥️ FRONTEND — frontend-next/
frontend-next/
├── app/
│   ├── page.tsx                 # Home
│   ├── diagnostico/
│   │   ├── 01-bem-vindo/
│   │   ├── 02-identificacao/
│   │   ├── 03-empresa/
│   │   ├── 04-contato/
│   │   ├── 05-seguranca/
│   │   ├── 06-estagio/
│   │   ├── 07-dores/
│   │   ├── 08-repositorio/
│   │   ├── 09-expectativa/
│   │   └── 10-pagamento/
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── diagnostico/
│   │   ├── roadmap/
│   │   ├── consultoria/
│   │   ├── arquitetura/
│   │   ├── ia/
│   │   ├── tech-ops/
│   │   └── documentos/
│   ├── privacidade/
│   └── termos-de-servico/
│
├── components/
│   ├── Card.tsx
│   ├── ProgressBar.tsx
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Layout.tsx
│
├── services/
│   ├── api.ts                  # Cliente REST
│   └── auth.ts
│
├── types/
│   └── diagnostico.ts
│
└── styles/

⚙️ BACKEND COMPLETO — backend-go/

Este é o coração do sistema.

backend-go/
├── cmd/
│   └── api/
│       └── main.go             # Bootstrap do servidor
│
├── internal/
│   ├── config/
│   │   └── config.go
│
│   ├── server/
│   │   └── http.go             # Gin/Fiber setup
│
│   ├── auth/
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── middleware.go
│
│   ├── users/
│   │   ├── model.go
│   │   ├── repository.go
│   │   └── service.go
│
│   ├── diagnostico/
│   │   ├── model.go
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── validator.go
│
│   ├── onboarding/
│   │   ├── handler.go
│   │   └── service.go
│
│   ├── pagamento/
│   │   ├── handler.go
│   │   └── service.go
│
│   ├── painel/
│   │   ├── model.go
│   │   ├── service.go
│   │   └── builder.go          # Monta painel via IA
│
│   ├── ia/
│   │   ├── client.go           # Comunicação com Python
│   │   └── adapter.go
│
│   ├── repositorio/
│   │   └── github.go
│
│   ├── logs/
│   │   └── logger.go
│
│   ├── techops/
│   │   ├── metrics.go
│   │   ├── health.go
│   │   └── limits.go
│
│   └── shared/
│       ├── errors.go
│       ├── responses.go
│       └── utils.go
│
├── pkg/
│   ├── db/
│   │   └── postgres.go
│   ├── cache/
│   │   └── redis.go
│   └── security/
│       └── hash.go
│
├── migrations/
│   ├── 001_users.sql
│   ├── 002_diagnosticos.sql
│   ├── 003_paineis.sql
│   └── 004_pagamentos.sql
│
└── go.mod

Função do backend

Orquestra tudo

Valida dados

Controla acesso

Garante pagamento

Chama IA

Monta painel

Registra logs

Controla custo e operação

🤖 IA SERVICE — ai-service/ (Python)
ai-service/
├── app.py                     # API FastAPI
├── prompts/
│   └── techlab_prompt.txt
├── engines/
│   ├── classifier.py
│   ├── painel_builder.py
│   └── roadmap.py
├── guardrails/
│   └── rules.py
├── schemas/
│   └── output_schema.json
├── requirements.txt
└── tests/


👉 IA nunca fala direto com o frontend.

🛠️ INFRA / TECH OPS — infra/
infra/
├── nginx/
│   └── nginx.conf
├── docker/
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── ai.Dockerfile
├── monitoring/
│   ├── prometheus.yml
│   └── alerts.yml
└── backups/

📚 DOCUMENTAÇÃO — docs/
docs/
├── arquitetura.md
├── fluxo-diagnostico.md
├── api.md
├── ia.md
├── techops.md
└── onboarding.md

🔁 FLUXO REAL DO SISTEMA
Usuário → Frontend (diagnóstico)
        → Backend (validação)
        → Pagamento
        → IA (análise)
        → Backend (painel)
        → Dashboard personalizado