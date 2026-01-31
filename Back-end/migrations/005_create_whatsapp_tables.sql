-- Tabela para configurar projetos do WhatsApp Bot
CREATE TABLE whatsapp_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Dono do projeto
    project_name VARCHAR(255) NOT NULL,
    whatsapp_app_id VARCHAR(255),
    whatsapp_business_id VARCHAR(255),
    whatsapp_phone_id VARCHAR(255) NOT NULL UNIQUE, -- Usado para rotear webhooks
    access_token_hash TEXT, -- Hash do token de acesso, nunca o token plano
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela para registrar todas as mensagens do WhatsApp (entrada e saída)
CREATE TABLE whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES whatsapp_projects(id) ON DELETE CASCADE,
    direction VARCHAR(10) NOT NULL, -- 'in' ou 'out'
    whatsapp_message_id VARCHAR(255) UNIQUE,
    sender_phone VARCHAR(50),
    recipient_phone VARCHAR(50),
    message_content TEXT,
    status VARCHAR(50), -- ex: 'sent', 'delivered', 'read', 'failed'
    payload JSONB, -- Payload completo do webhook ou da resposta da API
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Gatilhos
CREATE TRIGGER set_whatsapp_projects_timestamp
BEFORE UPDATE ON whatsapp_projects
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Índices
CREATE INDEX idx_whatsapp_projects_user_id ON whatsapp_projects(user_id);
CREATE INDEX idx_whatsapp_projects_phone_id ON whatsapp_projects(whatsapp_phone_id);
CREATE INDEX idx_whatsapp_logs_project_id ON whatsapp_logs(project_id);
CREATE INDEX idx_whatsapp_logs_message_id ON whatsapp_logs(whatsapp_message_id);

-- Comentários
COMMENT ON TABLE whatsapp_projects IS 'Configurações de projetos individuais para o WhatsApp Bot, vinculados a um cliente.';
COMMENT ON COLUMN whatsapp_projects.whatsapp_phone_id IS 'ID do número de telefone do WhatsApp, usado como chave para rotear webhooks para o projeto correto.';
COMMENT ON TABLE whatsapp_logs IS 'Audita todas as mensagens trocadas via WhatsApp, para fins de suporte e rastreabilidade.';
