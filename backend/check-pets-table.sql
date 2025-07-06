-- Script para verificar e corrigir a estrutura da tabela pets
USE petshop_db;

-- Verificar estrutura atual da tabela
DESCRIBE pets;

-- Adicionar campos que podem estar faltando
ALTER TABLE pets ADD COLUMN IF NOT EXISTS color VARCHAR(30);
ALTER TABLE pets ADD COLUMN IF NOT EXISTS gender ENUM('M', 'F');
ALTER TABLE pets ADD COLUMN IF NOT EXISTS birthdate DATE;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS notes TEXT;

-- Verificar estrutura final
DESCRIBE pets;

-- Verificar dados existentes
SELECT COUNT(*) as total_pets FROM pets; 