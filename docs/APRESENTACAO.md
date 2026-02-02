# TECH LAB — Documento de Apresentação e Visão

## 1. Propósito e Visão

### O Problema Central
A internet não falha por falta de código, mas por falta de **disciplina de engenharia** em escala. A maioria dos produtos digitais sofre com decisões técnicas fragmentadas, perda de contexto ao longo do tempo e uma cultura reativa de correção de bugs. O resultado é fragilidade, custos operacionais crescentes e dependência excessiva de indivíduos-chave.

### Nossa Solução: Uma Nova Camada Operacional
A Tech Lab não é apenas mais um SaaS ou uma consultoria. É uma **camada operacional de engenharia para a internet**, onde a própria engenharia é sistematizada.

Nossa visão é criar um padrão onde:
- **Projetos são workspaces técnicos persistentes**, não apenas repositórios de código.
- **Cada decisão técnica é registrada** e rastreável.
- **Cada correção é versionada** e auditável.
- **Cada erro é um problema de sistema**, não um acidente.

> **Frase Fundadora:** "A Tech Lab não resolve bugs. Ela resolve a forma como a internet resolve problemas."

---

## 2. O que a Tech Lab Faz

Nós transformamos tecnologia em resultado através de um processo estruturado:

1.  **Diagnóstico Técnico:** Por meio de um questionário inteligente, avaliamos o negócio, a tecnologia e a operação do cliente.
2.  **Análise e Geração de Roadmap:** Nossa plataforma, assistida por IA, processa os dados, identifica riscos e gera um roadmap técnico-estratégico.
3.  **Painel Personalizado:** O cliente acessa um painel dinâmico e `backend-driven`, onde visualiza seu diagnóstico, roadmap e todos os artefatos do projeto.
4.  **Consultoria Contínua:** Nossos especialistas guiam a execução do roadmap, garantindo que as decisões corretas sejam tomadas e implementadas.

---

## 3. O que nos Diferencia

1.  **IA como Sistema de Engenharia, Não Atalho:**
    - Usamos IA para **orquestrar, analisar e manter o contexto**, não para gerar código de forma indiscriminada. A IA impõe o método, enquanto os humanos mantêm a responsabilidade pelas decisões críticas.

2.  **Arquitetura `Backend-Driven` por Princípio:**
    - **O backend Go é o cérebro do sistema.** Ele controla a lógica de negócio, o estado, o acesso e a segurança. O frontend (Next.js) é uma camada de apresentação inteligente, mas delegada. Isso garante segurança, consistência e total auditabilidade. O frontend **NUNCA** acessa a IA ou a base de dados diretamente.

3.  **Foco no Método, Não Apenas na Ferramenta:**
    - Não vendemos "features", vendemos um método de engenharia reprodutível. A plataforma é a ferramenta que aplica esse método em escala.

---

## 4. Identidade da Marca

### Cores Principais
As cores refletem nossa abordagem: técnica, clara e confiável.

- **Primária (Primary):** `hsl(145 63% 39%)`
  - **Significado:** Um verde técnico e sóbrio, associado a crescimento, estabilidade e "sinal verde" para decisões corretas. Usado em ações principais e elementos de destaque.

- **Fundo (Background):** `hsl(0 0% 98%)`
  - **Significado:** Um fundo quase branco, limpo e profissional, que garante legibilidade e foco no conteúdo.

- **Destrutiva (Destructive):** `hsl(0 84.2% 60.2%)`
  - **Significado:** Vermelho para alertas críticos, ações perigosas e indicação de riscos, usado com moderação para ter impacto.

- **Mudo (Muted/Secondary):** `hsl(0 0% 96.1%)` / `hsl(215.4 16.3% 46.9%)`
  - **Significado:** Tons de cinza para texto secundário, bordas e elementos de suporte, criando uma hierarquia visual clara sem competir com a cor primária.

### Tipografia

- **Títulos (Headline):** `Space Grotesk`
  - **Estilo:** Uma fonte monoespaçada com personalidade, que remete à tecnologia e ao código, mas com excelente legibilidade para títulos.
- **Corpo (Body):** `Inter`
  - **Estilo:** Uma fonte sans-serif altamente legível, projetada para interfaces digitais, garantindo clareza no conteúdo principal.

---

## 5. Ecossistema da Plataforma

A plataforma é um monorepo com serviços desacoplados, projetada para escalabilidade e manutenção:

- **Frontend (Next.js):** Interface do cliente e do admin.
- **Backend (Go):** Orquestrador central, API, lógica de negócio e segurança.
- **Bot Service (Go):** Microserviço isolado para interações via WhatsApp.
- **AI Service (Python/Genkit - Abstraído):** Serviço externo chamado exclusivamente pelo backend Go para análise e sugestões.
- **Nginx:** Proxy reverso que gerencia o tráfego para os serviços corretos.

Esta arquitetura garante que cada componente possa ser desenvolvido, implantado e escalado de forma independente.
