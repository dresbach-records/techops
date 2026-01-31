package main

import "sync"

// State represents the user's current position in the conversation flow.
type State string

const (
	StateStart           State = "START"
	StateMainMenu        State = "MAIN_MENU"
	StateDiagnostico     State = "DIAGNOSTICO"
	StateAcompanhamento  State = "ACOMPANHAMENTO"
	StateHumano          State = "HUMANO"
	StatePlanosPagamento State = "PLANOS_PAGAMENTO"
	StateSuporte         State = "SUPORTE"
	StateSobre           State = "SOBRE"
	StateFeedback        State = "FEEDBACK"
)


// StateManager defines the interface for managing user conversation state.
type StateManager interface {
	GetState(userID string) State
	SetState(userID string, state State)
}

// InMemoryStateManager is a simple in-memory implementation of StateManager.
// In a production system, this should be replaced with a persistent store like Redis or a database.
type InMemoryStateManager struct {
	states map[string]State
	mu     sync.RWMutex
}

// NewInMemoryStateManager creates a new in-memory state manager.
func NewInMemoryStateManager() *InMemoryStateManager {
	return &InMemoryStateManager{
		states: make(map[string]State),
	}
}

// GetState retrieves the current state for a user.
func (sm *InMemoryStateManager) GetState(userID string) State {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	if state, ok := sm.states[userID]; ok {
		return state
	}
	return StateStart // Default state
}

// SetState sets the state for a user.
func (sm *InMemoryStateManager) SetState(userID string, state State) {
	sm.mu.Lock()
	defer sm.mu.Unlock()
	sm.states[userID] = state
}
