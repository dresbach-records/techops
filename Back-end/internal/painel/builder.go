package painel

import "errors"

// checkUserAccess simulates checking if a user has paid and is authorized.
// In a real system, this would query a database.
func checkUserAccess(userID string) error {
	// This is a placeholder. In a real application, you would query the
	// 'pagamentos' or 'paineis' table to check for 'status: "ativo"'.
	// if !PagamentoConfirmado(userID) {
	// 	 return errors.New("acesso ao painel bloqueado: pagamento pendente")
	// }
	return nil
}

// getModulesForPlan determines which sidebar modules are visible for a given plan.
// This list is now the single source of truth for module visibility.
func getModulesForPlan(plan string) []string {
	var modules []string
	switch plan {
	case "START":
		modules = []string{"visao-geral", "diagnostico", "roadmap"}
	case "BUILD":
		modules = []string{"visao-geral", "diagnostico", "roadmap", "arquitetura"}
	case "SCALE":
		modules = []string{"visao-geral", "diagnostico", "roadmap", "arquitetura", "tech-ops", "ia"}
	case "RECOVERY":
		modules = []string{"visao-geral", "diagnostico", "roadmap", "arquitetura", "tech-ops", "ia", "seguranca"}
	default:
		// A user without a plan sees a minimal dashboard.
		modules = []string{"visao-geral"}
	}

	// Append common modules for all paying customers.
	// This ensures core functionality is always accessible post-payment.
	if plan != "" {
		// Use a map to avoid duplicates if a common module is also in the plan-specific list.
		moduleSet := make(map[string]bool)
		for _, m := range modules {
			moduleSet[m] = true
		}
		commonModules := []string{"consultoria", "documentos", "suporte"}
		for _, m := range commonModules {
			if !moduleSet[m] {
				modules = append(modules, m)
			}
		}
	}
	return modules
}


// BuildForUser constructs the dashboard data for a specific user.
// This function is the core of the backend-driven dashboard.
func BuildForUser(userID string, userName string) (*DashboardData, error) {
	// Gate: Check if the user is authorized to see the full dashboard.
	if err := checkUserAccess(userID); err != nil {
		return nil, err
	}

	// In the future, this will fetch the user's actual plan from the database.
	// For now, we hardcode to "BUILD" to demonstrate dynamic module loading.
	userPlan := "BUILD" 

	// Get the list of modules based on the user's plan.
	userModules := getModulesForPlan(userPlan)
	
	data := &DashboardData{
		WelcomeMessage: "Bem-vindo, " + userName,
		WelcomeSubtext: "Seu painel técnico foi montado sob medida com base no seu diagnóstico. Vamos começar.",
		OverviewCards: []OverviewCard{
			{Title: "Diagnóstico Técnico", Value: "100% Concluído", Icon: "Briefcase"},
			{Title: "Plano Ativo", Value: userPlan, Description: "Módulos liberados", Icon: "GitFork"},
			{Title: "Próxima Etapa", Value: "Revisar Arquitetura", Description: "Roadmap · Fase 1", Icon: "AlertTriangle"},
			{Title: "Consultoria", Value: "Agendar Sessão", Icon: "Briefcase"},
		},
		NextSteps: []NextStep{
			{Title: "Revisar Arquitetura Inicial", Description: "Validar componentes e fluxos de dados.", Status: "pending"},
			{Title: "Planejar Escalabilidade", Description: "Definir estratégias para o crescimento do sistema.", Status: "todo"},
		},
		ProjectDocuments: []ProjectDocument{
			{Title: "Contrato de Consultoria.pdf", Icon: "FileText", Link: "/dashboard/documentos"},
			{Title: "Diagnóstico Completo.pdf", Icon: "FileText", Link: "/dashboard/documentos"},
		},
		Modules: userModules, // This array now drives the frontend sidebar.
	}

	return data, nil
}
