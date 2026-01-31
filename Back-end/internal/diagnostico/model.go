package diagnostico

// Plan defines the structure for a subscription plan.
type Plan struct {
	Key         string   `json:"key"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	SetupFee    float64  `json:"setupFee"`
	MonthlyFee  float64  `json:"monthlyFee"`
	MinMonths   int      `json:"minMonths"`
	Features    []string `json:"features"`
}

// RecommendPlanRequest defines the input for the plan recommendation endpoint.
type RecommendPlanRequest struct {
	Estagio     string   `json:"estagio"`
	Dores       []string `json:"dores"`
	Repositorio string   `json:"repositorio"`
}