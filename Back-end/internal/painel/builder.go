package painel

// BuildForUser constructs the dashboard data for a specific user.
// For now, it returns a hardcoded dashboard structure.
// The userID is passed for future use (e.g., fetching user-specific data).
func BuildForUser(userID string, userName string) (*DashboardData, error) {
	// In the future, fetch user data and determine their plan to customize the dashboard.
	// For now, we return a static response modeled after the original frontend.

	data := &DashboardData{
		WelcomeMessage: "Bem-vindo, " + userName,
		WelcomeSubtext: "Seu painel técnico foi montado sob medida com base nas informações que voce nos passou. Vamos atingir suas metas de forma estratégica e segura.",
		OverviewCards: []OverviewCard{
			{Title: "Diagnóstico Técnico", Value: "100% Concluído", Icon: "Briefcase"},
			{Title: "Dores Técnicas", Value: "3 Prioridades", Icon: "AlertTriangle"},
			{Title: "Roadmap Técnico", Value: "Arquitetura Inicial", Description: "Passo Atual", Icon: "GitFork"},
			{Title: "Consultoria", Value: "Próxima: Seg, 09h", Icon: "Briefcase"},
		},
		NextSteps: []NextStep{
			{Title: "Revisar Arquitetura Inicial", Description: "Segunda-feira, 09:00. Detalhar setup inicial e validar segurança do sistema.", Status: "completed"},
			{Title: "Planejar Escalabilidade", Description: "Definir estratégias para o crescimento seguro do sistema.", Status: "pending"},
		},
		ProjectDocuments: []ProjectDocument{
			{Title: "Contrato de Consultoria.pdf", Icon: "FileText", Link: "/dashboard/documentos"},
			{Title: "Checklist Inicial.docx", Icon: "FileText", Link: "/dashboard/documentos"},
		},
	}

	return data, nil
}
