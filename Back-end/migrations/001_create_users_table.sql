-- Habilita a extensão pgcrypto para usar gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Cria um ENUM para os papéis de usuário, garantindo consistência
CREATE TYPE user_role AS ENUM ('admin', 'consultor', 'techops', 'cliente');
CREATE TYPE user_status AS ENUM ('ativo', 'bloqueado', 'cancelado');

-- Cria a tabela de usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'cliente',
    status user_status NOT NULL DEFAULT 'ativo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cria um gatilho para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Adiciona um índice no e-mail para buscas rápidas
CREATE INDEX idx_users_email ON users(email);

-- Comentários para documentação
COMMENT ON TABLE users IS 'Armazena informações sobre todos os usuários do sistema, sejam eles clientes ou equipe interna.';
COMMENT ON COLUMN users.id IS 'Identificador único universal do usuário.';
COMMENT ON COLUMN users.name IS 'Nome completo do usuário.';
COMMENT ON COLUMN users.email IS 'Endereço de e-mail único, usado para login.';
COMMENT ON COLUMN users.password_hash IS 'Hash da senha do usuário (bcrypt).';
COMMENT ON COLUMN users.role IS 'Papel do usuário no sistema, controla o nível de acesso (RBAC).';
COMMENT ON COLUMN users.status IS 'Status da conta do usuário (ativo, bloqueado, etc.).';
COMMENT ON COLUMN users.created_at IS 'Data e hora de criação do registro.';
COMMENT ON COLUMN users.updated_at IS 'Data e hora da última atualização do registro.';
