package diagnostico

var PLANS = map[string]Plan{
	"START": {
		Key:         "START",
		Name:        "Plano START - Validação & Direção",
		Description: "Ideal para quem precisa decidir certo antes de gastar errado.",
		SetupFee:    1497,
		MonthlyFee:  0,
		MinMonths:   0,
		Features: []string{
			"Diagnóstico técnico estruturado",
			"Direcionamento de stack",
			"Roadmap inicial",
			"Painel básico personalizado",
			"1 sessão de consultoria estratégica",
		},
	},
	"BUILD": {
		Key:         "BUILD",
		Name:        "Plano BUILD - MVP & Estruturação",
		Description: "Para transformar protótipo em produto viável.",
		SetupFee:    2997,
		MonthlyFee:  997,
		MinMonths:   3,
		Features: []string{
			"Diagnóstico aprofundado",
			"Arquitetura de software",
			"Definição de MVP",
			"Roadmap técnico detalhado",
			"Painel completo",
			"Consultoria recorrente inicial",
		},
	},
	"SCALE": {
		Key:         "SCALE",
		Name:        "Plano SCALE - Produção & Crescimento",
		Description: "Para crescer sem quebrar a operação.",
		SetupFee:    4997,
		MonthlyFee:  1997,
		MinMonths:   6,
		Features: []string{
			"Auditoria técnica",
			"Análise de código (GitHub)",
			"Escalabilidade",
			"IA aplicada ao negócio",
			"Tech Ops e Monitoramento",
			"Painel avançado",
		},
	},
	"RECOVERY": {
		Key:         "RECOVERY",
		Name:        "Plano RECOVERY - Reestruturação Crítica",
		Description: "Para salvar o produto antes que ele quebre de vez.",
		SetupFee:    7997,
		MonthlyFee:  2997,
		MinMonths:   6,
		Features: []string{
			"Diagnóstico crítico",
			"Reestruturação arquitetural",
			"Redução de custos",
			"Plano de correção técnica",
			"Tech Ops intensivo",
			"Consultoria próxima",
		},
	},
}

// CalculatePlan determines the best plan based on diagnostic data.
func CalculatePlan(data RecommendPlanRequest) Plan {
	criticalPains := []string{"custos", "divida_tecnica", "seguranca"}
	hasCriticalPains := false
	for _, dor := range data.Dores {
		for _, cp := range criticalPains {
			if dor == cp {
				hasCriticalPains = true
				break
			}
		}
		if hasCriticalPains {
			break
		}
	}

	if data.Estagio == "reestruturacao" || (data.Estagio == "producao" && hasCriticalPains) {
		return PLANS["RECOVERY"]
	}

	if data.Estagio == "producao" {
		return PLANS["SCALE"]
	}

	if data.Estagio == "prototipo" || (data.Estagio == "ideia" && data.Repositorio != "") {
		return PLANS["BUILD"]
	}

	return PLANS["START"]
}