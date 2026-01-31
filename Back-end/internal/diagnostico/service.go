package diagnostico

// Service defines the business logic for the diagnostico.
type Service interface {
	GetResultado(userID string) (*DiagnosticoResultadoResponse, error)
}

type service struct{}

// NewService creates a new diagnostico service.
func NewService() Service {
	return &service{}
}

// GetResultado returns the calculated diagnostic result for a user.
// MOCK IMPLEMENTATION: This should fetch the result from the 'diagnosticos' table,
// which was previously processed by the AI service.
func (s *service) GetResultado(userID string) (*DiagnosticoResultadoResponse, error) {
	// Mocking a response for the BUILD plan
	mockPlano := Plano{
		Codigo:      "BUILD",
		Nome:        "Plano BUILD - MVP & Estruturação",
		SetupValor:  2997.00,
		MensalValor: 997.00,
	}

	mockResultado := &DiagnosticoResultadoResponse{
		Plano:         mockPlano,
		Justificativa: "Com base no seu estágio de protótipo, o plano BUILD é ideal para transformar sua ideia em um produto viável, com foco em arquitetura e roadmap técnico.",
		NextAction:    "pagamento",
	}

	return mockResultado, nil
}
