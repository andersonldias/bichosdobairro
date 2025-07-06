-- Script para atualizar a tabela pets com todos os campos necessários
-- Execute este script no seu banco de dados para adicionar os campos necessários

USE petshop_db;

-- Adicionar coluna color se não existir
ALTER TABLE pets ADD COLUMN IF NOT EXISTS color VARCHAR(30);

-- Adicionar coluna gender se não existir
ALTER TABLE pets ADD COLUMN IF NOT EXISTS gender ENUM('M', 'F');

-- Adicionar coluna birthdate se não existir
ALTER TABLE pets ADD COLUMN IF NOT EXISTS birthdate DATE;

-- Adicionar coluna notes se não existir
ALTER TABLE pets ADD COLUMN IF NOT EXISTS notes TEXT;

-- Verificar se as colunas foram adicionadas
DESCRIBE pets;

-- Verificar dados existentes
SELECT 
  p.id,
  p.name,
  p.species,
  p.breed,
  p.color,
  p.gender,
  p.birthdate,
  p.notes,
  c.name as client_name
FROM pets p
LEFT JOIN clients c ON p.client_id = c.id
ORDER BY p.name; 