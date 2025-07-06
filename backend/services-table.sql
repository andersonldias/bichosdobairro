-- Tabela de tipos de serviços
CREATE TABLE IF NOT EXISTS service_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    default_price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserir tipos de serviços padrão
INSERT IGNORE INTO service_types (name, description, default_price) VALUES
('Banho', 'Banho completo com shampoo e condicionador', 30.00),
('Tosa', 'Tosa higiênica ou tosa completa', 50.00),
('Consulta', 'Consulta veterinária', 80.00),
('Vacina', 'Aplicação de vacina', 45.00),
('Outro', 'Outros tipos de serviços', 0.00);

-- Tabela de agendamentos de serviços
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    pet_id INT NOT NULL,
    service_type_id INT NOT NULL,
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
    FOREIGN KEY (service_type_id) REFERENCES service_types(id) ON DELETE RESTRICT,
    
    INDEX idx_client_date (client_id, appointment_date),
    INDEX idx_pet_date (pet_id, appointment_date),
    INDEX idx_date_status (appointment_date, status)
); 