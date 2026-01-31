package main

import (
	"context"
	"fmt"
	"log"
	"strconv"
	"strings"
	"techlab/bot/core"
)

// ProcessMessage is the core of the state machine.
// It takes the current state, a message, and session data, and returns the response and the next state.
func ProcessMessage(ctx context.Context, coreClient core.CoreClient, currentState State, message Message, sessionData SessionData) (string, State, SessionData) {
	userInput := strings.ToLower(strings.TrimSpace(message.Text.Body))

	// Universal command to go back to the main menu
	if userInput == "menu" {
		// Before resetting, ask for feedback if they were in a flow
		if sessionData.LastFeedbackFlow != "" {
			return getFeedbackQuestion(sessionData.LastFeedbackFlow), StateFeedbackAsk, sessionData
		}
		return getMainMenuText(), StateMainMenu, SessionData{}
	}

	switch currentState {
	case StateStart:
		return getMainMenuText(), StateMainMenu, SessionData{}

	case StateMainMenu:
		return processMainMenu(userInput)

	// --- Fluxo de Diagnóstico ---
	case StateDiagnostico:
		sessionData.LastFeedbackFlow = "diagnostico"
		return getDiagnosisQuestion(), StateDiagnostico, sessionData // Simple, one-step diagnosis for now

	// --- Fluxo de Acompanhamento de Projeto (Sprint 3 - Real) ---
	case StateAcompanhamentoAskEmail:
		email := userInput

		// REAL API CALL to the core backend to get the user's status.
		status, err := coreClient.GetProjectStatusByEmail(ctx, email)
		if err != nil {
			log.Printf("ERROR: Failed to get project status for email %s: %v", email, err)
			if strings.Contains(err.Error(), "user_not_found") {
				return "Não encontramos um projeto com este e-mail. Por favor, verifique se digitou corretamente ou inicie um novo diagnóstico.", StateAcompanhamentoAskEmail, sessionData
			}
			return "Tivemos um problema para consultar seu projeto e nossa equipe já foi notificada. Por favor, tente novamente em alguns instantes.", StateMainMenu, SessionData{}
		}

		// Build a response based on the status by calling other core endpoints.
		var statusResponse string
		switch status.NextStep {
		case "painel":
			// In a real scenario, we might get the specific panel URL.
			statusResponse = "✅ Ótima notícia! Seu pagamento foi confirmado e seu painel personalizado já está liberado.\n\nAcesse seu dashboard em: https://[URL_DO_SEU_FRONTEND]/dashboard"
		case "pagamento":
			// Call another endpoint to get the specific payment link.
			pagamento, err := coreClient.GetPagamentoStatus(ctx, status.UserID)
			if err != nil || pagamento.CheckoutURL == "" {
				log.Printf("ERROR: Failed to get payment link for user %s: %v", status.UserID, err)
				statusResponse = "Verificamos que seu diagnóstico foi concluído, mas tivemos um problema ao gerar seu link de pagamento. Por favor, entre em contato com o suporte."
			} else {
				statusResponse = fmt.Sprintf("Verificamos que seu diagnóstico foi concluído e estamos apenas aguardando a confirmação do pagamento para liberar seu painel.\n\nVocê pode finalizar o pagamento aqui: %s", pagamento.CheckoutURL)
			}
		case "diagnostico":
			statusResponse = "Encontrei seu cadastro. Parece que você iniciou o diagnóstico mas ainda não o finalizou.\n\nContinue de onde parou em: https://[URL_DO_SEU_FRONTEND]/diagnostico"
		default:
			statusResponse = "Não consegui identificar o próximo passo para o seu projeto. Nossa equipe de suporte já foi notificada."
		}


		// Always finish with a feedback question.
		sessionData.LastFeedbackFlow = "acompanhamento"
		return statusResponse + "\n\n" + getFeedbackQuestion(sessionData.LastFeedbackFlow), StateFeedbackAsk, sessionData


	// --- Outros Fluxos (com término em feedback) ---
	case StateHumano, StatePlanosPagamento, StateSuporte, StateSobre:
		// Mock response for any of these flows, leading directly to feedback.
		flowName := strings.ToLower(string(currentState))
		sessionData.LastFeedbackFlow = flowName
		return getMockFlowResponse(currentState) + "\n\n" + getFeedbackQuestion(flowName), StateFeedbackAsk, sessionData

	// --- Fluxo de Feedback Universal ---
	case StateFeedbackAsk:
		rating, err := strconv.Atoi(userInput)
		if err != nil || rating < 1 || rating > 4 {
			return "Por favor, digite um número de 1 a 4.\n\n" + getFeedbackQuestion(sessionData.LastFeedbackFlow), StateFeedbackAsk, sessionData
		}
		// The handler will save the feedback. We just thank the user and reset.
		return getFeedbackThanksText(), StateMainMenu, SessionData{}

	default:
		// If in an unknown state, reset to the main menu.
		return "Desculpe, não entendi. Voltando ao menu principal.\n\n" + getMainMenuText(), StateMainMenu, SessionData{}
	}
}

// processMainMenu handles user input when they are in the main menu.
func processMainMenu(userInput string) (string, State, SessionData) {
	// Reset any previous flow context when returning to the menu
	var sessionData SessionData
	var responseText string
	var nextState State

	switch userInput {
	case "1":
		responseText = "Iniciando o fluxo de Diagnóstico Técnico..."
		nextState = StateDiagnostico
	case "2":
		responseText = "Para que eu possa encontrar seu projeto, por favor, digite o e-mail que você usou no cadastro."
		nextState = StateAcompanhamentoAskEmail
		sessionData.LastFeedbackFlow = "acompanhamento" // Set the context for feedback early
		return responseText, nextState, sessionData
	case "3":
		responseText = "Iniciando a transferência para um consultor..."
		nextState = StateHumano
	case "4":
		responseText = "Mostrando informações sobre Planos e Pagamentos..."
		nextState = StatePlanosPagamento
	case "5":
		responseText = "Iniciando o fluxo de Suporte Técnico..."
		nextState = StateSuporte
	case "6":
		responseText = "A Tech Lab é uma consultoria de engenharia de software..."
		nextState = StateSobre
	default:
		responseText = "Opção inválida. Por favor, escolha um número de 1 a 6.\n\n" + getMainMenuText()
		nextState = StateMainMenu
		return responseText, nextState, sessionData // Return immediately for invalid option
	}
	// For valid options, we set the LastFeedbackFlow to trigger feedback later
	sessionData.LastFeedbackFlow = strings.ToLower(string(nextState))
	return responseText, nextState, sessionData
}


// getMainMenuText returns the standard main menu message.
func getMainMenuText() string {
	return `Olá! Seja bem-vindo(a) à TECH LAB.

Sou o assistente virtual da Tech Lab.
Como posso te ajudar hoje?

1️⃣ Iniciar diagnóstico técnico
2️⃣ Acompanhar meu projeto
3️⃣ Falar com um consultor
4️⃣ Planos e pagamento
5️⃣ Suporte técnico
6️⃣ Sobre a Tech Lab

Digite "menu" a qualquer momento para voltar aqui.`
}

func getDiagnosisQuestion() string {
	// In a real scenario, this would be a multi-step process.
	// For now, we'll just give a concluding message and ask for feedback.
	return `✅ Diagnóstico iniciado.

Estamos analisando suas respostas para indicar o melhor caminho técnico.`
}

func getMockFlowResponse(state State) string {
	switch state {
	case StateSobre:
		return "A Tech Lab é uma consultoria de engenharia de software que transforma tecnologia em resultado."
	default:
		return "Esta função está sendo implementada e estará disponível em breve."
	}
}

func getFeedbackQuestion(flow string) string {
	question := "Como você avalia essa interação?"
	return question + "\n\n1- Ótima\n2- Boa\n3- Regular\n4- Ruim"
}

func getFeedbackThanksText() string {
	return `Obrigado pela sua avaliação!
Ela nos ajuda a melhorar nosso atendimento.

Se precisar de algo mais, é só me chamar 😊`
}
