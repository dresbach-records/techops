# Tech Lab - WhatsApp Bot Service (Go)

This service contains the backend logic for the Tech Lab WhatsApp Bot, built with Go. It operates as a standalone microservice responsible for handling all user interactions via the WhatsApp Business API.

## Architecture

- **Entrypoint**: A Gin HTTP server listens for incoming webhook events from Meta.
- **State Management**: A state machine pattern manages the user's position within the conversation flows. (e.g., `menu`, `diagnostico_step_1`, `aguardando_feedback`).
- **Flow-based Logic**: Each conversational path (Diagnóstico, Suporte, etc.) is handled by a dedicated flow processor.
- **WhatsApp API Client**: A simple client for sending messages (text, buttons, lists) back to the user via the Meta Graph API.
- **Configuration**: All secrets (API tokens, app secrets) are loaded from environment variables (`.env`).

## Core Principles

- **Backend-Driven**: The bot's logic, state, and responses are fully controlled by this service. The Meta API is just an interface.
- **Stateless Handlers, Stateful Service**: HTTP handlers are stateless, while a dedicated service (backed by Redis or a DB) manages user session state.
- **Auditability**: All incoming and outgoing messages, as well as feedback, are logged for quality control and metrics.
- **Universal Feedback**: Every complete interaction flow must end with a user feedback request.
