-- Script para corrigir a tabela pets
USE petshop_db;

-- Verificar estrutura atual
DESCRIBE pets;

-- Remover campos problemáticos se existirem
ALTER TABLE pets DROP COLUMN IF EXISTS color;
ALTER TABLE pets DROP COLUMN IF EXISTS gender;
ALTER TABLE pets DROP COLUMN IF EXISTS birthdate;
ALTER TABLE pets DROP COLUMN IF EXISTS notes;

-- Adicionar campos novamente
ALTER TABLE pets ADD COLUMN color VARCHAR(30) NULL;
ALTER TABLE pets ADD COLUMN gender ENUM('M', 'F') NULL;
ALTER TABLE pets ADD CO
LUMN birthdate DATE NULL;
ALTER TABLE pets ADD COLUMN notes TEXT NULL;

-- Verificar estrutura final
DESCRIBE pets; 