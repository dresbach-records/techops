-- Cria um ENUM para o status do diagnóstico
CREATE TYPE diagnostico_status AS ENUM ('em_andamento', 'aguardando_pagamento', 'em_analise', 'concluido', 'reprovado');

-- Tabela principal para armazenar cada instância de diagnóstico
CREATE TABLE diagnosticos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status diagnostico_status NOT NULL DEFAULT 'em_andamento',
    estagio VARCHAR(50),
    repositorio VARCHAR(255),
    plano_recomendado VARCHAR(50), -- ex: START, BUILD, SCALE
    risco_tecnico VARCHAR(50),     -- ex: baixo, medio, alto
    justificativa_ia TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela para armazenar as respostas de cada etapa do diagnóstico
CREATE TABLE diagnostico_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diagnostico_id UUID NOT NULL REFERENCES diagnosticos(id) ON DELETE CASCADE,
    step_key VARCHAR(100) NOT NULL, -- ex: '01-identificacao', '06-dores'
    resposta JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Gatilhos para atualizar 'updated_at'
CREATE TRIGGER set_diagnosticos_timestamp
BEFORE UPDATE ON diagnosticos
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Índices para performance
CREATE INDEX idx_diagnosticos_user_id ON diagnosticos(user_id);
CREATE INDEX idx_diagnostico_steps_diagnostico_id ON diagnostico_steps(diagnostico_id);

-- Comentários
COMMENT ON TABLE diagnosticos IS 'Armazena o estado geral de um processo de diagnóstico iniciado por um usuário.';
COMMENT ON COLUMN diagnosticos.user_id IS 'ID do usuário que iniciou o diagnóstico.';
COMMENT ON COLUMN diagnosticos.status IS 'Status atual do processo de diagnóstico.';
COMMENT ON COLUMN diagnosticos.plano_recomendado IS 'Plano sugerido pela IA ou lógica de negócio após a análise.';
COMMENT ON TABLE diagnostico_steps IS 'Grava as respostas de cada etapa (card) do questionário de diagnóstico.';
COMMENT ON COLUMN diagnostico_steps.resposta IS 'JSONB contendo as respostas do usuário para uma etapa específica.';
