-- Tabela para agendamentos e registros de consultoria
CREATE TABLE consultorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    consultor_id UUID NOT NULL REFERENCES users(id), -- ID do usuário interno (consultor)
    titulo VARCHAR(255) NOT NULL,
    data_agendamento TIMESTAMPTZ NOT NULL,
    link_chamada TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'agendada', -- agendada, realizada, cancelada
    notas_consultor TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_consultor CHECK (consultor_id <> user_id)
);

-- Tabela para logs de auditoria da IA
CREATE TABLE ia_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diagnostico_id UUID REFERENCES diagnosticos(id),
    user_id UUID REFERENCES users(id),
    contexto VARCHAR(255) NOT NULL, -- ex: 'analise_diagnostico', 'sugestao_roadmap'
    prompt_usado TEXT,
    input_payload JSONB NOT NULL,
    output_payload JSONB,
    custo_estimado NUMERIC(10, 6),
    status VARCHAR(50) NOT NULL, -- 'sucesso', 'falha'
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela para logs de auditoria de ações de administradores
CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL REFERENCES users(id),
    target_user_id UUID REFERENCES users(id),
    target_resource_id UUID,
    action VARCHAR(255) NOT NULL, -- ex: 'update_plan', 'block_panel'
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Gatilhos
CREATE TRIGGER set_consultorias_timestamp
BEFORE UPDATE ON consultorias
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();


-- Índices
CREATE INDEX idx_consultorias_user_id ON consultorias(user_id);
CREATE INDEX idx_consultorias_consultor_id ON consultorias(consultor_id);
CREATE INDEX idx_ia_logs_diagnostico_id ON ia_logs(diagnostico_id);
CREATE INDEX idx_admin_logs_admin_user_id ON admin_logs(admin_user_id);

-- Comentários
COMMENT ON TABLE consultorias IS 'Registra as sessões de consultoria entre clientes e a equipe Tech Lab.';
COMMENT ON TABLE ia_logs IS 'Audita todas as chamadas feitas ao serviço de IA, registrando inputs, outputs e custos.';
COMMENT ON TABLE admin_logs IS 'Grava um histórico de todas as ações críticas realizadas por administradores na plataforma.';
