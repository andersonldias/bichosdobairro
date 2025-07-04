-- Criação do banco de dados
-- CREATE DATABASE IF NOT EXISTS petshop_db;
-- USE petshop_db;

-- Tabela de usuários (para autenticação futura)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'veterinario', 'atendente') DEFAULT 'atendente',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    cep VARCHAR(9),
    street VARCHAR(100),
    neighborhood VARCHAR(50),
    city VARCHAR(50),
    state VARCHAR(2),
    number VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de pets
CREATE TABLE IF NOT EXISTS pets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    species VARCHAR(30) NOT NULL,
    breed VARCHAR(50),
    age INT,
    weight DECIMAL(5,2),
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Tabela de tipos de serviços
CREATE TABLE IF NOT EXISTS service_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    pet_id INT NOT NULL,
    service_type_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('agendado', 'em_andamento', 'concluido', 'cancelado') DEFAULT 'agendado',
    transport BOOLEAN DEFAULT FALSE,
    transport_price DECIMAL(10,2) DEFAULT 0.00,
    total_price DECIMAL(10,2) NOT NULL,
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
    FOREIGN KEY (service_type_id) REFERENCES service_types(id)
);

-- Tabela de histórico de serviços
CREATE TABLE IF NOT EXISTS service_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT NOT NULL,
    service_type_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    FOREIGN KEY (service_type_id) REFERENCES service_types(id)
);

-- Tabela de caixa (transações financeiras)
CREATE TABLE IF NOT EXISTS cash_register (
    id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT,
    type ENUM('entrada', 'saida') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description VARCHAR(255) NOT NULL,
    payment_method ENUM('dinheiro', 'cartao_credito', 'cartao_debito', 'pix') DEFAULT 'dinheiro',
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
);

-- Inserir dados iniciais de tipos de serviços
INSERT INTO service_types (name, description, base_price) VALUES
('Banho', 'Banho completo com shampoo especializado', 35.00),
('Tosa', 'Tosa higiênica ou tosa completa', 45.00),
('Banho e Tosa', 'Banho + tosa completa', 70.00),
('Vacinação', 'Aplicação de vacinas', 80.00),
('Consulta Veterinária', 'Consulta com veterinário', 120.00),
('Exame de Sangue', 'Exames laboratoriais', 150.00),
('Cirurgia', 'Procedimentos cirúrgicos', 500.00),
('Transporte', 'Serviço de busca e entrega', 25.00);

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Administrador', 'admin@petshop.com', '$2b$10$rQZ8K9mN2pL1vX3yW4uJ5e', 'admin');

-- Criar índices para melhor performance
CREATE INDEX idx_clients_cpf ON clients(cpf);
CREATE INDEX idx_pets_client_id ON pets(client_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_cash_register_date ON cash_register(transaction_date); 