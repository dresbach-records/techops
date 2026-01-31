import { DiagnosticData } from "@/contexts/DiagnosticContext";
import type { Plan } from "@/types";

export const PLANS: { [key: string]: Plan } = {
  START: {
    key: "START",
    name: "Plano START - Validação & Direção",
    description: "Ideal para quem precisa decidir certo antes de gastar errado.",
    setupFee: 1497,
    monthlyFee: 0,
    minMonths: 0,
    features: [
        "Diagnóstico técnico estruturado",
        "Direcionamento de stack",
        "Roadmap inicial",
        "Painel básico personalizado",
        "1 sessão de consultoria estratégica",
    ]
  },
  BUILD: {
    key: "BUILD",
    name: "Plano BUILD - MVP & Estruturação",
    description: "Para transformar protótipo em produto viável.",
    setupFee: 2997,
    monthlyFee: 997,
    minMonths: 3,
    features: [
        "Diagnóstico aprofundado",
        "Arquitetura de software",
        "Definição de MVP",
        "Roadmap técnico detalhado",
        "Painel completo",
        "Consultoria recorrente inicial",
    ]
  },
  SCALE: {
    key: "SCALE",
    name: "Plano SCALE - Produção & Crescimento",
    description: "Para crescer sem quebrar a operação.",
    setupFee: 4997,
    monthlyFee: 1997,
    minMonths: 6,
    features: [
        "Auditoria técnica",
        "Análise de código (GitHub)",
        "Escalabilidade",
        "IA aplicada ao negócio",
        "Tech Ops e Monitoramento",
        "Painel avançado",
    ]
  },
  RECOVERY: {
    key: "RECOVERY",
    name: "Plano RECOVERY - Reestruturação Crítica",
    description: "Para salvar o produto antes que ele quebre de vez.",
    setupFee: 7997,
    monthlyFee: 2997,
    minMonths: 6,
    features: [
        "Diagnóstico crítico",
        "Reestruturação arquitetural",
        "Redução de custos",
        "Plano de correção técnica",
        "Tech Ops intensivo",
        "Consultoria próxima",
    ]
  },
};

export const calculatePlan = (diagnosticData: DiagnosticData): Plan => {
    const { estagio, dores, repositorio } = diagnosticData.projeto;
    
    // Rule for RECOVERY: high-priority pain points or reestruturacao stage
    const criticalPains = ['custos', 'divida_tecnica', 'seguranca'];
    const hasCriticalPains = dores?.some(dor => criticalPains.includes(dor));

    if (estagio === 'reestruturacao' || (estagio === 'producao' && hasCriticalPains)) {
        return PLANS.RECOVERY;
    }

    // Rule for SCALE: production stage
    if (estagio === 'producao') {
        return PLANS.SCALE;
    }

    // Rule for BUILD: prototype stage
    if (estagio === 'prototipo' || (estagio === 'ideia' && repositorio)) {
        return PLANS.BUILD;
    }
    
    // Default to START for idea stage
    return PLANS.START;
};

// Simple interest calculation for demonstration
export const calculateInstallments = (total: number) => {
    const installments = [];
    const baseInterestRate = 0.0199; // 1.99% per month

    for (let i = 1; i <= 12; i++) {
        if (i === 1) {
            installments.push({
                num: 1,
                value: total,
                total: total,
                label: `1x de ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
            });
        } else {
            // J = C * i * t
            const interest = total * baseInterestRate * i;
            const finalValue = total + interest;
            const installmentValue = finalValue / i;
            installments.push({
                num: i,
                value: installmentValue,
                total: finalValue,
                label: `${i}x de ${installmentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
            });
        }
    }
    return installments;
}
