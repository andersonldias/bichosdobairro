const db = require('./src/config/database');

// Função para log colorido
const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  test: (msg) => console.log(`🧪 ${msg}`),
  debug: (msg) => console.log(`🔍 ${msg}`)
};

// Teste direto no banco de dados
async function testDatabaseDirect() {
  console.log('🔧 Teste Direto no Banco de Dados\n');
  
  try {
    // 1. Verificar se há clientes na tabela
    log.test('1. Verificando clientes na tabela...');
    const [clients] = await db.query('SELECT * FROM clients LIMIT 5');
    console.log('Clientes encontrados:', clients.length);
    
    if (clients.length > 0) {
      const clientId = clients[0].id;
      log.success(`Usando cliente ID: ${clientId}`);
      
      // 2. Testar consulta findById
      log.test('2. Testando consulta findById...');
      try {
        const [clientRows] = await db.query(`
          SELECT * FROM clients WHERE id = ?
        `, [clientId]);
        
        console.log('Resultado da consulta:', clientRows);
        
        if (clientRows.length > 0) {
          log.success('Cliente encontrado no banco!');
          
          // 3. Testar consulta de pets
          log.test('3. Testando consulta de pets...');
          const [petRows] = await db.query(`
            SELECT id, name, species, breed, color, gender
            FROM pets 
            WHERE client_id = ?
            ORDER BY name
          `, [clientId]);
          
          console.log('Pets encontrados:', petRows);
          log.success(`Pets encontrados: ${petRows.length}`);
          
        } else {
          log.error('Cliente não encontrado no banco');
        }
      } catch (error) {
        log.error('Erro na consulta findById:', error.message);
      }
      
      // 4. Testar UPDATE
      log.test('4. Testando UPDATE...');
      try {
        const [updateResult] = await db.query(`
          UPDATE clients 
          SET name = CONCAT(name, ' - TESTE')
          WHERE id = ?
        `, [clientId]);
        
        console.log('Resultado do UPDATE:', updateResult);
        
        if (updateResult.affectedRows > 0) {
          log.success('UPDATE executado com sucesso!');
          
          // Verificar se foi atualizado
          const [verifyRows] = await db.query(`
            SELECT name FROM clients WHERE id = ?
          `, [clientId]);
          
          console.log('Nome após UPDATE:', verifyRows[0]?.name);
          
          // Reverter a mudança
          await db.query(`
            UPDATE clients 
            SET name = REPLACE(name, ' - TESTE', '')
            WHERE id = ?
          `, [clientId]);
          
          log.success('Mudança revertida');
        } else {
          log.error('UPDATE não afetou nenhuma linha');
        }
      } catch (error) {
        log.error('Erro no UPDATE:', error.message);
      }
      
    } else {
      log.warning('Nenhum cliente encontrado na tabela');
      
      // Criar um cliente de teste
      log.test('Criando cliente de teste...');
      try {
        const [insertResult] = await db.query(`
          INSERT INTO clients (name, cpf, phone, cep, street, neighborhood, city, state, number)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, ['Cliente Teste DB', '12345678901', '41123456789', '80000000', 'Rua Teste', 'Bairro Teste', 'Curitiba', 'PR', '123']);
        
        log.success(`Cliente criado com ID: ${insertResult.insertId}`);
        
        // Testar findById com o novo cliente
        const [newClientRows] = await db.query(`
          SELECT * FROM clients WHERE id = ?
        `, [insertResult.insertId]);
        
        console.log('Novo cliente:', newClientRows[0]);
        
        // Limpar
        await db.query('DELETE FROM clients WHERE id = ?', [insertResult.insertId]);
        log.success('Cliente de teste removido');
        
      } catch (error) {
        log.error('Erro ao criar cliente de teste:', error.message);
      }
    }
    
  } catch (error) {
    log.error('Erro geral no teste do banco:', error.message);
  } finally {
    // Fechar conexão
    await db.end();
  }
}

// Executar teste
testDatabaseDirect(); 