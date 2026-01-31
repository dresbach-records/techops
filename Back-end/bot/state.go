package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"sync"
)

// State represents the user's current position in the conversation flow.
type State string

// SessionData holds temporary data collected during a conversation flow.
type SessionData struct {
	LastFeedbackFlow string `json:"last_feedback_flow,omitempty"`
}

const (
	StateStart                  State = "START"
	StateMainMenu               State = "MAIN_MENU"
	StateDiagnostico            State = "DIAGNOSTICO"
	StateAcompanhamentoAskEmail State = "ACOMPANHAMENTO_ASK_EMAIL"
	StateHumano                 State = "HUMANO"
	StatePlanosPagamento        State = "PLANOS_PAGAMENTO"
	StateSuporte                State = "SUPORTE"
	StateSobre                  State = "SOBRE"

	// Universal Feedback Flow
	StateFeedbackAsk State = "FEEDBACK_ASK"
)

// StateManager defines the interface for managing user conversation state.
type StateManager interface {
	GetState(userID string) (State, SessionData)
	SetState(userID string, state State, data SessionData)
	SaveFeedback(userID, flowContext string, rating int) error
	IsMessageProcessed(messageID string) (bool, error)
	MarkMessageAsProcessed(messageID string) error
}

// --- InMemoryStateManager (for development fallback) ---
type InMemoryStateManager struct {
	states            map[string]State
	data              map[string]SessionData
	processedMessages map[string]bool
	mu                sync.RWMutex
}

func NewInMemoryStateManager() *InMemoryStateManager {
	return &InMemoryStateManager{
		states:            make(map[string]State),
		data:              make(map[string]SessionData),
		processedMessages: make(map[string]bool),
	}
}

func (sm *InMemoryStateManager) GetState(userID string) (State, SessionData) {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	if state, ok := sm.states[userID]; ok {
		return state, sm.data[userID]
	}
	return StateStart, SessionData{}
}

func (sm *InMemoryStateManager) SetState(userID string, state State, data SessionData) {
	sm.mu.Lock()
	defer sm.mu.Unlock()
	sm.states[userID] = state
	sm.data[userID] = data
}

func (sm *InMemoryStateManager) SaveFeedback(userID, flowContext string, rating int) error {
	log.Printf("SIMULATING FEEDBACK SAVE: User %s, Flow %s, Rating %d", userID, flowContext, rating)
	return nil
}

func (sm *InMemoryStateManager) IsMessageProcessed(messageID string) (bool, error) {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	_, exists := sm.processedMessages[messageID]
	return exists, nil
}

func (sm *InMemoryStateManager) MarkMessageAsProcessed(messageID string) error {
	sm.mu.Lock()
	defer sm.mu.Unlock()
	sm.processedMessages[messageID] = true
	return nil
}

// --- SQLStateManager (for production) ---
type SQLStateManager struct {
	db *sql.DB
}

func NewSQLStateManager(db *sql.DB) *SQLStateManager {
	return &SQLStateManager{db: db}
}

func (sm *SQLStateManager) GetState(userID string) (State, SessionData) {
	var stateStr string
	var dataBytes []byte
	var data SessionData

	query := "SELECT current_state, session_data FROM bot_sessions WHERE phone_number = $1"
	err := sm.db.QueryRow(query, userID).Scan(&stateStr, &dataBytes)

	if err != nil {
		if err == sql.ErrNoRows {
			return StateStart, SessionData{} // Default for new users
		}
		log.Printf("ERROR getting state for user %s: %v", userID, err)
		return StateStart, SessionData{} // Fallback to start
	}

	if len(dataBytes) > 0 && string(dataBytes) != "null" {
		if err := json.Unmarshal(dataBytes, &data); err != nil {
			log.Printf("ERROR unmarshalling session data for user %s: %v", userID, err)
			return State(stateStr), SessionData{} // Keep state, but clear data
		}
	}

	return State(stateStr), data
}

func (sm *SQLStateManager) SetState(userID string, state State, data SessionData) {
	dataBytes, err := json.Marshal(data)
	if err != nil {
		log.Printf("ERROR marshalling session data for user %s: %v", userID, err)
		return // Avoid saving corrupted state
	}

	query := `
		INSERT INTO bot_sessions (phone_number, current_state, session_data, updated_at)
		VALUES ($1, $2, $3, NOW())
		ON CONFLICT (phone_number) DO UPDATE
		SET current_state = $2, session_data = $3, updated_at = NOW()`

	_, err = sm.db.Exec(query, userID, state, dataBytes)
	if err != nil {
		log.Printf("ERROR setting state for user %s: %v", userID, err)
	}
}

func (sm *SQLStateManager) SaveFeedback(userID, flowContext string, rating int) error {
	query := "INSERT INTO bot_feedback (user_phone_number, flow_context, rating, created_at) VALUES ($1, $2, $3, NOW())"
	_, err := sm.db.Exec(query, userID, flowContext, rating)
	if err != nil {
		log.Printf("ERROR saving feedback for user %s: %v", userID, err)
		return err
	}
	log.Printf("INFO: Saved feedback for user %s, flow %s, rating %d", userID, flowContext, rating)
	return nil
}

func (sm *SQLStateManager) IsMessageProcessed(messageID string) (bool, error) {
	var exists bool
	query := "SELECT EXISTS(SELECT 1 FROM bot_processed_messages WHERE message_id = $1)"
	err := sm.db.QueryRow(query, messageID).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("failed to query for message id %s: %w", messageID, err)
	}
	return exists, nil
}

func (sm *SQLStateManager) MarkMessageAsProcessed(messageID string) error {
	query := "INSERT INTO bot_processed_messages (message_id) VALUES ($1) ON CONFLICT (message_id) DO NOTHING"
	_, err := sm.db.Exec(query, messageID)
	if err != nil {
		return fmt.Errorf("failed to insert message id %s: %w", messageID, err)
	}
	return nil
}
