package painel

// OverviewCard represents a single card in the dashboard's overview section.
type OverviewCard struct {
	Title       string `json:"title"`
	Value       string `json:"value"`
	Description string `json:"description,omitempty"`
	Icon        string `json:"icon"` // Icon name from lucide-react
}

// NextStep represents a task in the "Próximos Passos" list.
type NextStep struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"` // e.g., "completed", "pending"
}

// ProjectDocument represents a document link.
type ProjectDocument struct {
	Title string `json:"title"`
	Icon  string `json:"icon"`
	Link  string `json:"link"`
}

// DashboardData is the full data structure for the client's dashboard.
type DashboardData struct {
	WelcomeMessage   string            `json:"welcomeMessage"`
	WelcomeSubtext   string            `json:"welcomeSubtext"`
	OverviewCards    []OverviewCard    `json:"overviewCards"`
	NextSteps        []NextStep        `json:"nextSteps"`
	ProjectDocuments []ProjectDocument `json:"projectDocuments"`
	Modules          []string          `json:"modules"`
}
