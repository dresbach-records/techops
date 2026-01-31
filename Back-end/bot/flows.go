package main

import "strings"

// ProcessMessage is the core of the state machine.
// It takes the current state and a message, and returns the response and the next state.
func ProcessMessage(currentState State, message Message) (string, State) {
	// Universal command to go back to the main menu
	if strings.ToLower(message.Text.Body) == "menu" {
		return getMainMenuText(), StateMainMenu
	}

	switch currentState {
	case StateStart:
		// Any initial message brings the user to the main menu.
		return getMainMenuText(), StateMainMenu

	case StateMainMenu:
		return processMainMenu(message.Text.Body)

	// TODO: Implement other state handlers (Diagnostico, Suporte, etc.)
	// case StateDiagnostico:
	//     return processDiagnostico(message.Text.Body)

	default:
		// If in an unknown state, reset to the main menu.
		return "Desculpe, não entendi. Voltando ao menu principal.\n\n" + getMainMenuText(), StateMainMenu
	}
}

// processMainMenu handles user input when they are in the main menu.
func processMainMenu(userInput string) (string, State) {
	switch strings.TrimSpace(userInput) {
	case "1":
		return "Iniciando o fluxo de Diagnóstico Técnico...", StateDiagnostico
	case "2":
		return "Iniciando o fluxo de Acompanhamento de Projeto...", StateAcompanhamento
	case "3":
		return "Iniciando a transferência para um consultor...", StateHumano
	case "4":
		return "Mostrando informações sobre Planos e Pagamentos...", StatePlanosPagamento
	case "5":
		return "Iniciando o fluxo de Suporte Técnico...", StateSuporte
	case "6":
		return "A Tech Lab é uma consultoria de engenharia de software...\n\nComo posso ajudar?", StateSobre
	default:
		return "Opção inválida. Por favor, escolha um número de 1 a 6.\n\n" + getMainMenuText(), StateMainMenu
	}
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
