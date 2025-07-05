-- Script para atualizar a tabela pets com os novos campos
-- Execute este script no seu banco de dados para adicionar os campos necessários

-- Adicionar coluna color se não existir
ALTER TABLE pets ADD COLUMN IF NOT EXISTS color VARCHAR(30);

-- Adicionar coluna gender se não existir
ALTER TABLE pets ADD COLUMN IF NOT EXISTS gender ENUM('M', 'F');

-- Adicionar coluna birthdate se não existir
ALTER TABLE pets ADD COLUMN IF NOT EXISTS birthdate DATE;

-- Verificar se as colunas foram adicionadas
DESCRIBE pets; 