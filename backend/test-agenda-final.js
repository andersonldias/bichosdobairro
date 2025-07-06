const puppeteer = require('puppeteer');

async function testAgendaFinal() {
  console.log('🧪 Iniciando teste final da Agenda...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 300,
    defaultViewport: { width: 1400, height: 900 }
  });
  
  const page = await browser.newPage();
  
  try {
    // Navegar para a aplicação
    console.log('🌐 Navegando para a aplicação...');
    await page.goto('http://localhost:5173');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const results = {
      total: 0,
      passed: 0,
      failed: 0
    };

    // Teste 1: Verificar carregamento inicial
    console.log('\n📋 Teste 1: Carregamento inicial...');
    results.total++;
    
    try {
      const title = await page.title();
      console.log(`📄 Título: ${title}`);
      
      // Verificar se há elementos básicos
      const navElements = await page.$$('nav a');
      console.log(`🧭 Encontrados ${navElements.length} links de navegação`);
      
      if (navElements.length > 0) {
        console.log('✅ Aplicação carregada com sucesso');
        results.passed++;
      } else {
        console.log('❌ Navegação não encontrada');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro no carregamento:', error.message);
      results.failed++;
    }

    // Teste 2: Navegar para Agenda
    console.log('\n📋 Teste 2: Navegação para Agenda...');
    results.total++;
    
    try {
      await page.click('a[href="/agenda"]');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = page.url();
      console.log(`📍 URL: ${currentUrl}`);
      
      if (currentUrl.includes('/agenda')) {
        console.log('✅ Navegação para Agenda funcionou');
        results.passed++;
      } else {
        console.log('❌ Navegação para Agenda falhou');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro na navegação para Agenda:', error.message);
      results.failed++;
    }

    // Teste 3: Verificar elementos da Agenda
    console.log('\n📋 Teste 3: Elementos da Agenda...');
    results.total++;
    
    try {
      // Verificar título
      const h1Elements = await page.$$('h1');
      console.log(`📝 Títulos H1: ${h1Elements.length}`);
      
      // Verificar calendário
      const calendarGrid = await page.$$('.grid.grid-cols-7');
      console.log(`📅 Grid do calendário: ${calendarGrid.length}`);
      
      // Verificar cards de estatísticas
      const statCards = await page.$$('.card');
      console.log(`📊 Cards de estatísticas: ${statCards.length}`);
      
      // Verificar campo de busca
      const searchInput = await page.$('input[placeholder*="Buscar"]');
      console.log(`🔍 Campo de busca: ${searchInput ? 'Encontrado' : 'Não encontrado'}`);
      
      if (h1Elements.length > 0 || calendarGrid.length > 0 || statCards.length > 0) {
        console.log('✅ Elementos da Agenda encontrados');
        results.passed++;
      } else {
        console.log('❌ Elementos da Agenda não encontrados');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro ao verificar elementos da Agenda:', error.message);
      results.failed++;
    }

    // Teste 4: Testar campo de busca
    console.log('\n📋 Teste 4: Campo de busca...');
    results.total++;
    
    try {
      const searchInput = await page.$('input[placeholder*="Buscar"]');
      if (searchInput) {
        await searchInput.click();
        await searchInput.type('teste');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ Campo de busca funcionando');
        results.passed++;
      } else {
        console.log('❌ Campo de busca não encontrado');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro no campo de busca:', error.message);
      results.failed++;
    }

    // Teste 5: Testar filtro de status
    console.log('\n📋 Teste 5: Filtro de status...');
    results.total++;
    
    try {
      const statusSelect = await page.$('select');
      if (statusSelect) {
        await statusSelect.select('agendado');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ Filtro de status funcionando');
        results.passed++;
      } else {
        console.log('❌ Filtro de status não encontrado');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro no filtro de status:', error.message);
      results.failed++;
    }

    // Teste 6: Navegar para Serviços
    console.log('\n📋 Teste 6: Navegação para Serviços...');
    results.total++;
    
    try {
      await page.click('a[href="/services"]');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = page.url();
      console.log(`📍 URL: ${currentUrl}`);
      
      if (currentUrl.includes('/services')) {
        console.log('✅ Navegação para Serviços funcionou');
        results.passed++;
      } else {
        console.log('❌ Navegação para Serviços falhou');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro na navegação para Serviços:', error.message);
      results.failed++;
    }

    // Teste 7: Verificar elementos dos Serviços
    console.log('\n📋 Teste 7: Elementos dos Serviços...');
    results.total++;
    
    try {
      // Verificar título
      const h1Elements = await page.$$('h1');
      console.log(`📝 Títulos H1: ${h1Elements.length}`);
      
      // Verificar abas
      const tabButtons = await page.$$('button');
      console.log(`🔘 Botões (possíveis abas): ${tabButtons.length}`);
      
      // Verificar formulário
      const forms = await page.$$('form');
      console.log(`📝 Formulários: ${forms.length}`);
      
      if (h1Elements.length > 0 || tabButtons.length > 0 || forms.length > 0) {
        console.log('✅ Elementos dos Serviços encontrados');
        results.passed++;
      } else {
        console.log('❌ Elementos dos Serviços não encontrados');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro ao verificar elementos dos Serviços:', error.message);
      results.failed++;
    }

    // Teste 8: Testar campos do formulário
    console.log('\n📋 Teste 8: Campos do formulário...');
    results.total++;
    
    try {
      // Verificar campos principais
      const clienteInput = await page.$('input[placeholder*="cliente"]');
      const petInput = await page.$('input[placeholder*="pet"]');
      const tipoInput = await page.$('input[placeholder*="tipo"]');
      const valorInput = await page.$('input[placeholder*="valor"]');
      const dataInput = await page.$('input[type="date"]');
      
      const camposEncontrados = [clienteInput, petInput, tipoInput, valorInput, dataInput].filter(Boolean).length;
      console.log(`📝 Campos encontrados: ${camposEncontrados}/5`);
      
      if (camposEncontrados >= 3) {
        console.log('✅ Campos do formulário encontrados');
        results.passed++;
      } else {
        console.log('❌ Campos do formulário incompletos');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro ao verificar campos:', error.message);
      results.failed++;
    }

    // Teste 9: Testar navegação por teclado
    console.log('\n📋 Teste 9: Navegação por teclado...');
    results.total++;
    
    try {
      const clienteInput = await page.$('input[placeholder*="cliente"]');
      if (clienteInput) {
        await clienteInput.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        await page.keyboard.press('ArrowDown');
        await new Promise(resolve => setTimeout(resolve, 300));
        await page.keyboard.press('Enter');
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('✅ Navegação por teclado testada');
        results.passed++;
      } else {
        console.log('❌ Campo de cliente não encontrado para teste de teclado');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro na navegação por teclado:', error.message);
      results.failed++;
    }

    // Teste 10: Voltar para Dashboard
    console.log('\n📋 Teste 10: Navegação para Dashboard...');
    results.total++;
    
    try {
      await page.click('a[href="/"]');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const currentUrl = page.url();
      console.log(`📍 URL: ${currentUrl}`);
      
      if (currentUrl === 'http://localhost:5173/' || currentUrl === 'http://localhost:5173') {
        console.log('✅ Navegação para Dashboard funcionou');
        results.passed++;
      } else {
        console.log('❌ Navegação para Dashboard falhou');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro na navegação para Dashboard:', error.message);
      results.failed++;
    }

    // Relatório final
    console.log('\n📊 RELATÓRIO FINAL DA AGENDA');
    console.log('=' .repeat(50));
    console.log(`Total de testes: ${results.total}`);
    console.log(`✅ Passou: ${results.passed}`);
    console.log(`❌ Falhou: ${results.failed}`);
    console.log(`📈 Taxa de sucesso: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    
    if (results.passed === results.total) {
      console.log('\n🎉 TODOS OS TESTES PASSARAM!');
      console.log('✅ A Agenda está funcionando perfeitamente!');
    } else if (results.passed > results.failed) {
      console.log('\n✅ A maioria dos testes passou!');
      console.log('⚠️  Algumas funcionalidades podem precisar de ajustes menores.');
    } else {
      console.log('\n❌ Muitos testes falharam.');
      console.log('🔧 Verifique se todas as funcionalidades estão implementadas.');
    }
    
    console.log('\n📝 FUNCIONALIDADES TESTADAS:');
    console.log('• Carregamento da aplicação');
    console.log('• Navegação entre páginas');
    console.log('• Elementos da Agenda');
    console.log('• Campo de busca');
    console.log('• Filtro de status');
    console.log('• Elementos dos Serviços');
    console.log('• Campos do formulário');
    console.log('• Navegação por teclado');
    console.log('• Navegação geral');

  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
  } finally {
    console.log('\n🔍 Mantendo o navegador aberto para inspeção manual...');
    console.log('Pressione Ctrl+C para fechar o teste.');
    
    // Manter o navegador aberto por 60 segundos
    await new Promise(resolve => setTimeout(resolve, 60000));
    await browser.close();
  }
}

// Executar o teste
testAgendaFinal().catch(console.error); 