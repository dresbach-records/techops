-- Tech Lab DB Schema (PostgreSQL for Supabase)
-- Version: 1.0
-- Backend-driven, no business logic in DB.

--==============================================================
-- 0) EXTENSIONS & SETTINGS
--==============================================================
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--==============================================================
-- 1) CORE / USUÁRIOS
--==============================================================

-- Enum for user roles
CREATE TYPE user_role_enum AS ENUM ('admin', 'consultor', 'cliente');

-- Enum for user status
CREATE TYPE user_status_enum AS ENUM ('ativo', 'bloqueado', 'cancelado', 'pagamento_pendente');

-- Table for all users in the system
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'cliente',
    status user_status_enum NOT NULL DEFAULT 'ativo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE users IS 'Stores all user accounts, regardless of role.';
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

--==============================================================
-- 2) DIAGNÓSTICO TÉCNICO
--==============================================================

-- Enum for diagnostic status
CREATE TYPE diagnostico_status_enum AS ENUM ('em_andamento', 'finalizado', 'cancelado');

-- Stores each diagnostic process initiated by a user
CREATE TABLE diagnosticos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status diagnostico_status_enum NOT NULL DEFAULT 'em_andamento',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMPTZ
);
COMMENT ON TABLE diagnosticos IS 'Tracks a single diagnostic journey for a user.';
CREATE INDEX idx_diagnosticos_user_id ON diagnosticos(user_id);

-- Stores answers for each step of a diagnostic
CREATE TABLE diagnostico_respostas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diagnostico_id UUID NOT NULL REFERENCES diagnosticos(id) ON DELETE CASCADE,
    step_key VARCHAR(100) NOT NULL,
    resposta JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE diagnostico_respostas IS 'Stores the JSON response for each step (card) of a diagnostic.';
CREATE INDEX idx_diagnostico_respostas_diagnostico_id ON diagnostico_respostas(diagnostico_id);

--==============================================================
-- 3) PLANOS, MÓDULOS E PAINEL
--==============================================================

-- Enum for plan codes. The details (price, etc.) are in the backend.
CREATE TYPE plan_code_enum AS ENUM ('START', 'BUILD', 'SCALE', 'RECOVERY');

-- The user's dashboard configuration, controlled by the backend.
CREATE TABLE paineis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_code plan_code_enum NOT NULL,
    status user_status_enum NOT NULL DEFAULT 'pagamento_pendente',
    -- Admin can override the default modules for a plan
    overridden_modules JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE paineis IS 'Defines the active dashboard configuration (plan and modules) for a user.';
CREATE INDEX idx_paineis_user_id ON paineis(user_id);

--==============================================================
-- 4) PAGAMENTOS
--==============================================================

-- Enum for payment status
CREATE TYPE payment_status_enum AS ENUM ('aguardando', 'confirmado', 'falhou', 'cancelado', 'reembolsado');

-- Enum for payment method
CREATE TYPE payment_method_enum AS ENUM ('pix', 'boleto', 'credito');

-- Stores all payment transactions
CREATE TABLE pagamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    diagnostico_id UUID REFERENCES diagnosticos(id) ON DELETE SET NULL,
    provider_payment_id VARCHAR(255) UNIQUE, -- ID from Asaas, Stripe, etc.
    status payment_status_enum NOT NULL DEFAULT 'aguardando',
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    method payment_method_enum,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE pagamentos IS 'Records every payment attempt and its status.';
CREATE INDEX idx_pagamentos_user_id ON pagamentos(user_id);
CREATE INDEX idx_pagamentos_status ON pagamentos(status);

-- Stores incoming webhook events for idempotency
CREATE TABLE payment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider VARCHAR(50) NOT NULL,
    provider_event_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(provider, provider_event_id)
);
COMMENT ON TABLE payment_events IS 'Logs webhook events from payment providers to ensure idempotency.';
CREATE INDEX idx_payment_events_provider_event_id ON payment_events(provider_event_id);


--==============================================================
-- 5) ADMIN & AUDITORIA
--==============================================================

-- Logs all significant actions performed by an admin
CREATE TABLE admin_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    target_resource_id VARCHAR(255),
    action_type VARCHAR(100) NOT NULL, -- e.g., 'change_plan', 'block_user'
    payload JSONB, -- Can store 'before' and 'after' states
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE admin_actions IS 'Audit trail for all actions taken by admins.';
CREATE INDEX idx_admin_actions_admin_user_id ON admin_actions(admin_user_id);
CREATE INDEX idx_admin_actions_action_type ON admin_actions(action_type);


--==============================================================
-- 6) IA (AUDITÁVEL)
--==============================================================

-- Logs all interactions with the AI service for auditing and cost control
CREATE TABLE ia_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID, -- From middleware to trace the whole request
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    context VARCHAR(100) NOT NULL, -- e.g., 'diagnostico_analysis', 'roadmap_generation'
    model_used VARCHAR(100),
    input_payload JSONB,
    output_payload JSONB,
    cost NUMERIC(10, 6),
    duration_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE ia_logs IS 'Records every call to the AI service for auditing and analysis.';
CREATE INDEX idx_ia_logs_user_id ON ia_logs(user_id);
CREATE INDEX idx_ia_logs_context ON ia_logs(context);


--==============================================================
-- 7) TECH OPS / OBSERVABILIDADE
--==============================================================

-- Enum for health status
CREATE TYPE health_status_enum AS ENUM ('ok', 'warning', 'down');

-- Stores periodic health checks of system components
CREATE TABLE system_health_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name VARCHAR(100) NOT NULL,
    status health_status_enum NOT NULL,
    details TEXT,
    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE system_health_logs IS 'Time-series data for the health of critical system components.';
CREATE INDEX idx_system_health_logs_service_name_checked_at ON system_health_logs(service_name, checked_at DESC);

-- Stores critical errors from the backend application
CREATE TABLE error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID,
    service VARCHAR(100) NOT NULL DEFAULT 'backend-go',
    endpoint VARCHAR(255),
    status_code INTEGER,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE error_logs IS 'Centralized log for application-level errors.';
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at DESC);


--==============================================================
-- 8) WHATSAPP BOT (META)
--==============================================================

-- Manages different WhatsApp Bot configurations for different clients
CREATE TABLE whatsapp_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    phone_number_id VARCHAR(255) UNIQUE NOT NULL, -- The ID of the phone number from Meta
    access_token_hash TEXT NOT NULL, -- Store a hash, not the raw token
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE whatsapp_projects IS 'Configuration for each client using the WhatsApp Bot feature.';
CREATE INDEX idx_whatsapp_projects_user_id ON whatsapp_projects(user_id);
CREATE INDEX idx_whatsapp_projects_phone_number_id ON whatsapp_projects(phone_number_id);

-- Enum for message direction
CREATE TYPE message_direction_enum AS ENUM ('inbound', 'outbound');

-- Stores all incoming and outgoing messages for auditing
CREATE TABLE whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES whatsapp_projects(id) ON DELETE CASCADE,
    message_id VARCHAR(255) UNIQUE NOT NULL, -- `wamid` from Meta
    direction message_direction_enum NOT NULL,
    sender_wa_id VARCHAR(255) NOT NULL,
    receiver_wa_id VARCHAR(255) NOT NULL,
    content JSONB NOT NULL,
    status VARCHAR(50), -- e.g., 'sent', 'delivered', 'read', 'failed'
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);
COMMENT ON TABLE whatsapp_messages IS 'Logs all messages sent and received through the WhatsApp Bot.';
CREATE INDEX idx_whatsapp_messages_project_id ON whatsapp_messages(project_id);
CREATE INDEX idx_whatsapp_messages_message_id ON whatsapp_messages(message_id);

-- Stores all incoming webhook payloads from Meta for debugging
CREATE TABLE whatsapp_webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payload JSONB NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE whatsapp_webhook_logs IS 'Raw log of every webhook received from Meta for debugging.';
