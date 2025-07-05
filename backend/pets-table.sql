-- Script para criar a tabela de pets simplificada
-- Execute este script no seu banco de dados MySQL

USE petshop_db;

CREATE TABLE IF NOT EXISTS pets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  species VARCHAR(30) NOT NULL,
  breed VARCHAR(50),
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Inserir dados de exemplo (opcional)
INSERT INTO pets (name, species, breed, client_id) VALUES
('Rex', 'Cachorro', 'Labrador', 1),
('Mia', 'Gato', 'Siamês', 1),
('Thor', 'Cachorro', 'Pastor Alemão', 2),
('Luna', 'Gato', 'Persa', 3),
('Buddy', 'Cachorro', 'Golden Retriever', 4),
('Nina', 'Gato', 'Maine Coon', 5),
('Max', 'Cachorro', 'Bulldog', 6),
('Bella', 'Gato', 'Ragdoll', 7),
('Rocky', 'Cachorro', 'Rottweiler', 8),
('Sophie', 'Gato', 'Abissínio', 9);

-- Verificar se a tabela foi criada corretamente
SELECT 
  TABLE_NAME,
  TABLE_ROWS,
  CREATE_TIME,
  UPDATE_TIME
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'petshop_db' AND TABLE_NAME = 'pets';

-- Verificar estrutura da tabela
DESCRIBE pets;

-- Verificar dados inseridos
SELECT 
  p.id,
  p.name,
  p.species,
  p.breed,
  c.name as client_name
FROM pets p
LEFT JOIN clients c ON p.client_id = c.id
ORDER BY p.name; 