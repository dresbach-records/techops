# Prompt Mestre para Geração do Frontend da Plataforma Tech Lab

## 1. Visão Geral e Stack Tecnológica

Você deve criar o frontend completo para a plataforma "Tech Lab".

**Stack Obrigatória:**
- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Componentes UI:** ShadCN/UI (usar componentes pré-existentes em `src/components/ui`)
- **Ícones:** Lucide React
- **Estado Global:** React Context API (NÃO usar Redux ou outras libs de estado)
- **Formulários:** React Hook Form com Zod para validação

**Princípios Fundamentais:**
- **Componentes Server por Padrão:** A menos que a interatividade do cliente seja estritamente necessária (`"use client"`).
- **Comunicação com API:** Todas as chamadas para o backend devem ser centralizadas no arquivo `src/lib/api.ts`. O frontend NUNCA deve acessar o banco de dados diretamente.
- **Segurança:** O frontend é uma camada de apresentação. A lógica de negócio, autenticação e autorização são de responsabilidade do backend. Use a `AuthContext` para gerenciar o estado de autenticação e tokens.
- **Tipagem Forte:** Use TypeScript em todo o projeto.

## 2. Identidade Visual (Baseado em `globals.css`)

**Cores (HSL):**
- **Primary:** `145 63% 39%` (Verde Técnico)
- **Background:** `0 0% 98%` (Branco Suave)
- **Card:** `0 0% 100%`
- **Destructive:** `0 84.2% 60.2%` (Vermelho)
- **Muted/Secondary:** Cinzas para textos e bordas.

**Tipografia:**
- **Títulos (Headline):** `Space Grotesk`
- **Corpo (Body):** `Inter`

Implemente essas variáveis no arquivo `src/app/globals.css`.

## 3. Estrutura de Arquivos e Layouts

Crie os seguintes layouts principais:

1.  **Layout Raiz (`src/app/layout.tsx`):**
    - Configura `<html>` e `<body>`.
    - Importa as fontes `Inter` e `Space Grotesk` do Google Fonts.
    - Envolve o `children` com o `AuthProvider` e renderiza o `Toaster`.

2.  **Layout de Marketing (`src/app/(marketing)/layout.tsx`):**
    - Contém uma `Navbar` no topo e um `Footer` na base.
    - O conteúdo principal (`children`) fica entre eles.

3.  **Layout de Autenticação (`src/app/(auth)/layout.tsx`):**
    - Simplesmente centraliza o conteúdo (`children`) na tela, com um fundo `bg-background`.

4.  **Layout do Diagnóstico (`src/app/diagnostico/layout.tsx`):**
    - Exibe o logo da Tech Lab no topo.
    - Mostra uma barra de progresso que reflete a etapa atual do diagnóstico.
    - O conteúdo (`children`) é renderizado dentro de um `Card` centralizado.
    - Utiliza o `DiagnosticProvider` para gerenciar o estado do formulário.

5.  **Layout do Dashboard do Cliente (`src/app/dashboard/layout.tsx`):**
    - Layout de duas colunas com um menu lateral (`sidebar`) e uma área de conteúdo principal.
    - **Sidebar Dinâmico:** O menu lateral é gerado dinamicamente com base nos módulos que o backend retorna para o usuário (via `DashboardContext`).
    - **Header:** Exibe o nome do usuário e um menu de usuário (`UserNav`).
    - **Backend-Driven:** Utiliza o `DashboardProvider` para buscar os dados do painel e controlar o que é exibido.

6.  **Layout do Dashboard Admin (Implícito em `app/admin/layout.tsx`):**
    - Similar ao do cliente, mas com um menu lateral fixo com todas as seções administrativas. (NOTA: Foi simplificado para depuração, mas o conceito é este).

## 4. Geração das Páginas

Crie as seguintes páginas, seguindo a estrutura de rotas do App Router:

### 4.1. Páginas de Marketing (`/`)

- **`/` (Home):** Landing page com seções: Hero, Features, Como Funciona, Tech Lab Info e um CTA final. Deve exibir as doações recentes buscadas via API.
- **`/como-funciona`:** Página que detalha a metodologia da Tech Lab em 3 passos, com imagens e texto.
- **`/planos`:** Página que exibe os modelos de consultoria (START, BUILD, SCALE).
- **`/privacidade` e `/termos-de-servico`:** Páginas de texto estático com as políticas da empresa.

### 4.2. Páginas de Autenticação (`/auth`)

- **`/login`:** Formulário de login com e-mail e senha.
- **`/cadastro`:** Formulário de cadastro com nome, e-mail e senha.
- Ambas devem ter um layout de duas colunas em desktop, com uma imagem e texto de marketing em um lado e o formulário no outro.

### 4.3. Fluxo de Diagnóstico (`/diagnostico`)

Crie uma sequência de 10 páginas de formulário (`/diagnostico/01-bem-vindo` a `/diagnostico/10-pagamento`):
- **Estado:** Todas as páginas devem usar o `useDiagnostic` hook para ler e salvar o estado do formulário no `DiagnosticContext`, que por sua vez, persiste no `localStorage`.
- **Navegação:** Use o componente `StepNavigation` para os botões de "Voltar" e "Avançar".
- **Etapa 10 (Pagamento):**
    - Busca o plano recomendado via API (`getDiagnosticResult`).
    - Exibe o plano, justificativa e valor.
    - Oferece opções de pagamento (Cartão, Boleto).
    - Ao clicar, chama a API `createPayment` e redireciona o usuário para a URL de checkout retornada.
    - Se o usuário não estiver logado, deve-se criar a conta (usando os dados do diagnóstico) antes de criar o pagamento.

### 4.4. Roteador de Fluxo (`/flow`)

- Página "inteligente" que verifica o status do usuário autenticado (`user.flow`) e o redireciona para a rota correta: `/diagnostico`, `/diagnostico/10-pagamento` ou `/dashboard`.

### 4.5. Dashboard do Cliente (`/dashboard`)

- **`/dashboard` (Visão Geral):** Página principal que mostra o plano contratado, status da conta e módulos ativos. É controlada pelo `DashboardContext`.
- **`/dashboard/diagnostico`:** Exibe um resumo detalhado da análise técnica.
- **`/dashboard/roadmap`:** Mostra um roadmap em formato de timeline com fases e tarefas.
- **`/dashboard/arquitetura`:** Apresenta diagramas e a stack tecnológica recomendada.
- **`/dashboard/consultoria`:** Permite agendar sessões e ver gravações anteriores.
- **E outras páginas de módulo:** `/tech-ops`, `/ia`, `/seguranca`, `/documentos`, `/suporte`.

### 4.6. Dashboard Admin (`/admin`)

Crie uma seção de administração com as seguintes páginas (layout similar ao dashboard do cliente):
- **`/admin` (Dashboard):** Visão geral com cards de métricas (Novos Diagnósticos, Status da Infra, etc.) e listas de atividades recentes.
- **`/admin/clientes`:** Tabela para listar e gerenciar todos os clientes.
- **`/admin/diagnosticos`:** Tabela para analisar e aprovar diagnósticos.
- **`/admin/consultorias`:** Gerenciamento de sessões de consultoria.
- **E outras páginas de admin:** `/financeiro`, `/paineis-clientes`, `/ia-automacao`, `/usuarios-internos`, `/tech-ops`, `/configuracoes`.

## 5. Componentes e Lógica

- **Contextos:** Crie `AuthContext`, `DiagnosticContext` e `DashboardContext` para gerenciar o estado global da aplicação de forma modular.
- **API Client (`src/lib/api.ts`):** Implemente todas as funções para interagir com o backend Go, gerenciando o token JWT do `localStorage` para chamadas autenticadas.
- **Componentes UI:** Utilize os componentes de `ShadCN/UI` (`Card`, `Button`, `Input`, `Table`, `Badge`, etc.) para construir todas as interfaces, garantindo consistência visual.
- **Componentes de Layout:** Crie componentes reutilizáveis como `Navbar`, `Footer`, `UserNav`.
