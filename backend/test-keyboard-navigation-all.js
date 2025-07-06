const puppeteer = require('puppeteer');

async function testKeyboardNavigation() {
  console.log('🧪 Iniciando teste de navegação por teclado em todos os formulários...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 100,
    defaultViewport: { width: 1200, height: 800 }
  });
  
  const page = await browser.newPage();
  
  try {
    // Navegar para a aplicação
    await page.goto('http://localhost:5173');
    console.log('✅ Aplicação carregada');
    
    // Aguardar carregamento inicial
    await page.waitForTimeout(2000);
    
    const results = {
      total: 0,
      passed: 0,
      failed: 0,
      details: []
    };

    // Teste 1: Navegação por teclado no PetForm (página de Pets)
    console.log('\n📋 Teste 1: Navegação por teclado no PetForm...');
    results.total++;
    
    try {
      // Ir para a página de Pets
      await page.click('a[href="/pets"]');
      await page.waitForTimeout(1000);
      
      // Abrir formulário de novo pet
      await page.click('button:has-text("Novo Pet")');
      await page.waitForTimeout(1000);
      
      // Testar campo de espécie
      await page.click('input[name="species"]');
      await page.waitForTimeout(500);
      
      // Navegar com setas
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(300);
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(300);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      
      // Verificar se foi selecionado
      const speciesValue = await page.$eval('input[name="species"]', el => el.value);
      if (speciesValue) {
        console.log('✅ Navegação por teclado no campo espécie funcionando');
        results.passed++;
      } else {
        console.log('❌ Falha na navegação por teclado no campo espécie');
        results.failed++;
      }
      
      // Testar campo de raça
      await page.click('input[name="breed"]');
      await page.waitForTimeout(500);
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(300);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      
      const breedValue = await page.$eval('input[name="breed"]', el => el.value);
      if (breedValue) {
        console.log('✅ Navegação por teclado no campo raça funcionando');
        results.passed++;
      } else {
        console.log('❌ Falha na navegação por teclado no campo raça');
        results.failed++;
      }
      
      // Fechar formulário
      await page.click('button:has-text("Cancelar")');
      await page.waitForTimeout(500);
      
    } catch (error) {
      console.log('❌ Erro no teste do PetForm:', error.message);
      results.failed++;
    }

    // Teste 2: Navegação por teclado nos filtros da página de Pets
    console.log('\n📋 Teste 2: Navegação por teclado nos filtros de Pets...');
    results.total++;
    
    try {
      // Testar filtro de espécie
      await page.click('input[placeholder="Filtrar por espécie..."]');
      await page.waitForTimeout(500);
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(300);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      
      const filterSpeciesValue = await page.$eval('input[placeholder="Filtrar por espécie..."]', el => el.value);
      if (filterSpeciesValue) {
        console.log('✅ Navegação por teclado no filtro de espécie funcionando');
        results.passed++;
      } else {
        console.log('❌ Falha na navegação por teclado no filtro de espécie');
        results.failed++;
      }
      
      // Testar filtro de raça
      await page.click('input[placeholder="Filtrar por raça..."]');
      await page.waitForTimeout(500);
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(300);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      
      const filterBreedValue = await page.$eval('input[placeholder="Filtrar por raça..."]', el => el.value);
      if (filterBreedValue) {
        console.log('✅ Navegação por teclado no filtro de raça funcionando');
        results.passed++;
      } else {
        console.log('❌ Falha na navegação por teclado no filtro de raça');
        results.failed++;
      }
      
      // Testar filtro de cliente
      await page.click('input[placeholder="Filtrar por dono..."]');
      await page.waitForTimeout(500);
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(300);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      
      const filterClientValue = await page.$eval('input[placeholder="Filtrar por dono..."]', el => el.value);
      if (filterClientValue) {
        console.log('✅ Navegação por teclado no filtro de cliente funcionando');
        results.passed++;
      } else {
        console.log('❌ Falha na navegação por teclado no filtro de cliente');
        results.failed++;
      }
      
    } catch (error) {
      console.log('❌ Erro no teste dos filtros:', error.message);
      results.failed++;
    }

    // Teste 3: Navegação por teclado no ClientForm
    console.log('\n📋 Teste 3: Navegação por teclado no ClientForm...');
    results.total++;
    
    try {
      // Ir para a página de Clientes
      await page.click('a[href="/clients"]');
      await page.waitForTimeout(1000);
      
      // Abrir formulário de novo cliente
      await page.click('button:has-text("Novo Cliente")');
      await page.waitForTimeout(1000);
      
      // Preencher dados básicos do cliente
      await page.type('input[name="name"]', 'Teste Cliente Teclado');
      await page.type('input[name="phone"]', '11999999999');
      await page.type('input[name="cpf"]', '12345678901');
      await page.type('input[name="street"]', 'Rua Teste');
      await page.type('input[name="number"]', '123');
      await page.type('input[name="neighborhood"]', 'Bairro Teste');
      await page.type('input[name="city"]', 'São Paulo');
      await page.type('input[name="state"]', 'SP');
      await page.type('input[name="cep"]', '01234567');
      
      // Adicionar pet e testar navegação por teclado
      await page.click('button:has-text("Adicionar Pet")');
      await page.waitForTimeout(1000);
      
      // Preencher nome do pet
      await page.type('input[name="name"]', 'Pet Teste');
      
      // Testar campo de espécie no pet do cliente
      await page.click('input[name="species"]');
      await page.waitForTimeout(500);
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(300);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      
      const clientPetSpeciesValue = await page.$eval('input[name="species"]', el => el.value);
      if (clientPetSpeciesValue) {
        console.log('✅ Navegação por teclado no campo espécie do pet do cliente funcionando');
        results.passed++;
      } else {
        console.log('❌ Falha na navegação por teclado no campo espécie do pet do cliente');
        results.failed++;
      }
      
      // Testar campo de raça no pet do cliente
      await page.click('input[name="breed"]');
      await page.waitForTimeout(500);
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(300);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      
      const clientPetBreedValue = await page.$eval('input[name="breed"]', el => el.value);
      if (clientPetBreedValue) {
        console.log('✅ Navegação por teclado no campo raça do pet do cliente funcionando');
        results.passed++;
      } else {
        console.log('❌ Falha na navegação por teclado no campo raça do pet do cliente');
        results.failed++;
      }
      
      // Fechar formulário
      await page.click('button:has-text("Cancelar")');
      await page.waitForTimeout(500);
      
    } catch (error) {
      console.log('❌ Erro no teste do ClientForm:', error.message);
      results.failed++;
    }

    // Teste 4: Teste de Escape para fechar sugestões
    console.log('\n📋 Teste 4: Teste de Escape para fechar sugestões...');
    results.total++;
    
    try {
      // Ir para Pets novamente
      await page.click('a[href="/pets"]');
      await page.waitForTimeout(1000);
      
      // Abrir formulário
      await page.click('button:has-text("Novo Pet")');
      await page.waitForTimeout(1000);
      
      // Abrir sugestões de espécie
      await page.click('input[name="species"]');
      await page.waitForTimeout(500);
      
      // Verificar se as sugestões apareceram
      const suggestionsVisible = await page.$('.absolute.z-10');
      if (suggestionsVisible) {
        console.log('✅ Sugestões apareceram corretamente');
        
        // Pressionar Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        
        // Verificar se as sugestões fecharam
        const suggestionsHidden = await page.$('.absolute.z-10');
        if (!suggestionsHidden) {
          console.log('✅ Escape fechou as sugestões corretamente');
          results.passed++;
        } else {
          console.log('❌ Escape não fechou as sugestões');
          results.failed++;
        }
      } else {
        console.log('❌ Sugestões não apareceram');
        results.failed++;
      }
      
      // Fechar formulário
      await page.click('button:has-text("Cancelar")');
      await page.waitForTimeout(500);
      
    } catch (error) {
      console.log('❌ Erro no teste de Escape:', error.message);
      results.failed++;
    }

    // Relatório final
    console.log('\n📊 RELATÓRIO FINAL DA NAVEGAÇÃO POR TECLADO');
    console.log('=' .repeat(50));
    console.log(`Total de testes: ${results.total}`);
    console.log(`✅ Passou: ${results.passed}`);
    console.log(`❌ Falhou: ${results.failed}`);
    console.log(`📈 Taxa de sucesso: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    
    if (results.failed === 0) {
      console.log('\n🎉 TODOS OS TESTES DE NAVEGAÇÃO POR TECLADO PASSARAM!');
      console.log('✅ A navegação por teclado está funcionando perfeitamente em todos os formulários.');
    } else {
      console.log('\n⚠️  Alguns testes falharam. Verifique os detalhes acima.');
    }
    
    console.log('\n📝 DICAS DE USO:');
    console.log('• Use ↑↓ para navegar nas sugestões');
    console.log('• Pressione Enter para selecionar');
    console.log('• Pressione Escape para fechar as sugestões');
    console.log('• As dicas aparecem nos labels dos campos');

  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
  } finally {
    await browser.close();
  }
}

// Executar o teste
testKeyboardNavigation().catch(console.error); 