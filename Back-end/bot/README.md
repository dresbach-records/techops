# Tech Lab - WhatsApp Bot Service (Go)

This service contains the backend logic for the Tech Lab WhatsApp Bot, built with Go. It operates as a standalone microservice responsible for handling all user interactions via the WhatsApp Business API.

## Architecture

- **Entrypoint**: A Gin HTTP server listens for incoming webhook events from Meta.
- **State Management**: A Finite State Machine (FSM) pattern manages the user's position within the conversation flows (e.g., `MAIN_MENU`, `DIAGNOSTICO_ESTAGIO`, `FEEDBACK_ASK`). The user state is persisted in a database to handle long-running conversations.
- **Flow-based Logic**: Each conversational path (Diagnóstico, Suporte, etc.) is handled by a dedicated flow processor in `flows.go`.
- **WhatsApp API Client**: A simple client for sending messages (text, buttons, lists) back to the user via the Meta Graph API. It includes a simulation mode for development.
- **Configuration**: All secrets (API tokens, app secrets, DB connection) are loaded from environment variables (`../.env`).

## Core Principles

- **Backend-Driven**: The bot's logic, state, and responses are fully controlled by this service. The Meta API is just an interface.
- **Stateful Service**: A dedicated SQL-backed state manager (`SQLStateManager`) persists user session state in the `bot_sessions` table, making the service robust. An `InMemoryStateManager` is available for development.
- **Auditability**: All incoming and outgoing messages are logged for quality control and metrics. Feedback is explicitly requested and stored in the `bot_feedback` table.
- **Universal Feedback**: Every complete interaction flow must end with a user feedback request to measure the quality of the service.
