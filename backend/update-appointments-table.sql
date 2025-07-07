-- Script para atualizar a tabela appointments para a versão correta
-- Execute este script no seu banco de dados MySQL

-- Primeiro, vamos fazer backup dos dados existentes (se houver)
CREATE TABLE IF NOT EXISTS appointments_backup AS SELECT * FROM appointments;

-- Remover a tabela appointments atual
DROP TABLE IF EXISTS appointments;

-- Criar a nova tabela appointments com a estrutura correta
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    pet_id INT NOT NULL,
    service_type_id INT,
    service_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME,
    transport_required BOOLEAN DEFAULT FALSE,
    transport_price DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('agendado', 'em_andamento', 'concluido', 'cancelado') DEFAULT 'agendado',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
    FOREIGN KEY (service_type_id) REFERENCES service_types(id) ON DELETE SET NULL,
    
    INDEX idx_client_date (client_id, appointment_date),
    INDEX idx_pet_date (pet_id, appointment_date),
    INDEX idx_date_status (appointment_date, status)
);

-- Se você quiser restaurar dados do backup, descomente e ajuste as linhas abaixo:
-- INSERT INTO appointments (client_id, pet_id, service_type_id, service_name, price, appointment_date, appointment_time, transport_required, transport_price, status, notes)
-- SELECT client_id, pet_id, service_type_id, 'Serviço Padrão', total_price, appointment_date, appointment_time, transport, transport_price, status, observations
-- FROM appointments_backup;

-- Remover a tabela de backup (opcional)
-- DROP TABLE appointments_backup;

-- Verificar se a tabela foi criada corretamente
DESCRIBE appointments; 