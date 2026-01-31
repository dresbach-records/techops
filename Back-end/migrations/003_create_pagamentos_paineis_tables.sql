-- Cria um ENUM para o status do pagamento, alinhado ao Asaas
CREATE TYPE pagamento_status AS ENUM ('PENDING', 'CONFIRMED', 'FAILED', 'RECEIVED', 'REFUNDED');

-- Tabela para armazenar informações de pagamento
CREATE TABLE pagamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diagnostico_id UUID UNIQUE NOT NULL REFERENCES diagnosticos(id),
    user_id UUID NOT NULL REFERENCES users(id),
    asaas_payment_id VARCHAR(255) UNIQUE, -- ID do pagamento no Asaas
    asaas_customer_id VARCHAR(255),      -- ID do cliente no Asaas
    valor NUMERIC(10, 2) NOT NULL,
    metodo VARCHAR(50) NOT NULL, -- ex: boleto, credito
    status pagamento_status NOT NULL DEFAULT 'PENDING',
    boleto_url TEXT,
    invoice_url TEXT,
    payload_confirmacao JSONB, -- Armazena o webhook de confirmação para auditoria
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela que gerencia o painel de cada cliente
CREATE TABLE paineis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plano_codigo VARCHAR(50) NOT NULL, -- ex: BUILD, SCALE
    status user_status NOT NULL DEFAULT 'bloqueado', -- O painel nasce bloqueado e é ativado após pagamento
    welcome_message VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de pivô para gerenciar os módulos ativos por painel
CREATE TABLE painel_modulos (
    painel_id UUID NOT NULL REFERENCES paineis(id) ON DELETE CASCADE,
    modulo_key VARCHAR(50) NOT NULL, -- ex: 'roadmap', 'tech-ops'
    PRIMARY KEY (painel_id, modulo_key)
);


-- Gatilhos
CREATE TRIGGER set_pagamentos_timestamp
BEFORE UPDATE ON pagamentos
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_paineis_timestamp
BEFORE UPDATE ON paineis
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- Índices
CREATE INDEX idx_pagamentos_user_id ON pagamentos(user_id);
CREATE INDEX idx_pagamentos_asaas_payment_id ON pagamentos(asaas_payment_id);
CREATE INDEX idx_paineis_user_id ON paineis(user_id);

-- Comentários
COMMENT ON TABLE pagamentos IS 'Registra todas as transações financeiras, com referência ao gateway de pagamento (Asaas).';
COMMENT ON COLUMN pagamentos.diagnostico_id IS 'Vincula o pagamento ao diagnóstico que o originou.';
COMMENT ON COLUMN pagamentos.status IS 'Status do pagamento, espelhando o status do gateway.';
COMMENT ON TABLE paineis IS 'Define a configuração do painel de um cliente, que é ativada após o pagamento.';
COMMENT ON COLUMN paineis.status IS 'Controla se o cliente tem acesso ao painel completo.';
COMMENT ON TABLE painel_modulos IS 'Define quais módulos (features) estão visíveis no painel de um cliente específico.';
