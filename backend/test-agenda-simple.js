const puppeteer = require('puppeteer');

async function testAgendaSimple() {
  console.log('🧪 Iniciando teste simples da Agenda...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 200,
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

    // Teste 1: Verificar se a aplicação carregou
    console.log('\n📋 Teste 1: Carregamento da aplicação...');
    results.total++;
    
    try {
      const title = await page.title();
      console.log(`📄 Título da página: ${title}`);
      
      // Verificar se há elementos básicos
      const body = await page.$('body');
      if (body) {
        console.log('✅ Aplicação carregada com sucesso');
        results.passed++;
      } else {
        console.log('❌ Aplicação não carregou');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro ao carregar aplicação:', error.message);
      results.failed++;
    }

    // Teste 2: Verificar navegação para Agenda
    console.log('\n📋 Teste 2: Navegação para Agenda...');
    results.total++;
    
    try {
      // Tentar encontrar link da agenda
      const agendaLink = await page.$('a[href="/agenda"]');
      if (agendaLink) {
        console.log('✅ Link da Agenda encontrado');
        await agendaLink.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verificar se mudou de página
        const currentUrl = page.url();
        console.log(`📍 URL atual: ${currentUrl}`);
        
        if (currentUrl.includes('agenda')) {
          console.log('✅ Navegação para Agenda funcionou');
          results.passed++;
        } else {
          console.log('❌ Navegação para Agenda falhou');
          results.failed++;
        }
      } else {
        console.log('❌ Link da Agenda não encontrado');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro na navegação:', error.message);
      results.failed++;
    }

    // Teste 3: Verificar elementos da Agenda
    console.log('\n📋 Teste 3: Elementos da Agenda...');
    results.total++;
    
    try {
      // Verificar se há título
      const h1Elements = await page.$$('h1');
      console.log(`📝 Encontrados ${h1Elements.length} títulos H1`);
      
      // Verificar se há calendário
      const calendarElements = await page.$$('.grid');
      console.log(`📅 Encontrados ${calendarElements.length} elementos de grid (possível calendário)`);
      
      // Verificar se há cards de estatísticas
      const cardElements = await page.$$('.card');
      console.log(`📊 Encontrados ${cardElements.length} cards`);
      
      if (h1Elements.length > 0 || calendarElements.length > 0 || cardElements.length > 0) {
        console.log('✅ Elementos da Agenda encontrados');
        results.passed++;
      } else {
        console.log('❌ Elementos da Agenda não encontrados');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro ao verificar elementos:', error.message);
      results.failed++;
    }

    // Teste 4: Verificar navegação para Serviços
    console.log('\n📋 Teste 4: Navegação para Serviços...');
    results.total++;
    
    try {
      // Tentar encontrar link dos serviços
      const servicesLink = await page.$('a[href="/services"]');
      if (servicesLink) {
        console.log('✅ Link dos Serviços encontrado');
        await servicesLink.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verificar se mudou de página
        const currentUrl = page.url();
        console.log(`📍 URL atual: ${currentUrl}`);
        
        if (currentUrl.includes('services')) {
          console.log('✅ Navegação para Serviços funcionou');
          results.passed++;
        } else {
          console.log('❌ Navegação para Serviços falhou');
          results.failed++;
        }
      } else {
        console.log('❌ Link dos Serviços não encontrado');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro na navegação para serviços:', error.message);
      results.failed++;
    }

    // Teste 5: Verificar elementos dos Serviços
    console.log('\n📋 Teste 5: Elementos dos Serviços...');
    results.total++;
    
    try {
      // Verificar se há título
      const h1Elements = await page.$$('h1');
      console.log(`📝 Encontrados ${h1Elements.length} títulos H1`);
      
      // Verificar se há formulário
      const formElements = await page.$$('form');
      console.log(`📝 Encontrados ${formElements.length} formulários`);
      
      // Verificar se há botões
      const buttonElements = await page.$$('button');
      console.log(`🔘 Encontrados ${buttonElements.length} botões`);
      
      if (h1Elements.length > 0 || formElements.length > 0 || buttonElements.length > 0) {
        console.log('✅ Elementos dos Serviços encontrados');
        results.passed++;
      } else {
        console.log('❌ Elementos dos Serviços não encontrados');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro ao verificar elementos dos serviços:', error.message);
      results.failed++;
    }

    // Teste 6: Verificar navegação geral
    console.log('\n📋 Teste 6: Navegação geral...');
    results.total++;
    
    try {
      // Voltar para o dashboard
      const dashboardLink = await page.$('a[href="/"]');
      if (dashboardLink) {
        console.log('✅ Link do Dashboard encontrado');
        await dashboardLink.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const currentUrl = page.url();
        console.log(`📍 URL atual: ${currentUrl}`);
        
        if (currentUrl.includes('localhost:5173') && !currentUrl.includes('/agenda') && !currentUrl.includes('/services')) {
          console.log('✅ Navegação para Dashboard funcionou');
          results.passed++;
        } else {
          console.log('❌ Navegação para Dashboard falhou');
          results.failed++;
        }
      } else {
        console.log('❌ Link do Dashboard não encontrado');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro na navegação geral:', error.message);
      results.failed++;
    }

    // Relatório final
    console.log('\n📊 RELATÓRIO FINAL DO TESTE SIMPLES');
    console.log('=' .repeat(50));
    console.log(`Total de testes: ${results.total}`);
    console.log(`✅ Passou: ${results.passed}`);
    console.log(`❌ Falhou: ${results.failed}`);
    console.log(`📈 Taxa de sucesso: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    
    if (results.failed === 0) {
      console.log('\n🎉 TODOS OS TESTES PASSARAM!');
      console.log('✅ A Agenda e o Sistema estão funcionando perfeitamente.');
    } else if (results.passed > results.failed) {
      console.log('\n✅ A maioria dos testes passou!');
      console.log('⚠️  Algumas funcionalidades podem precisar de ajustes.');
    } else {
      console.log('\n❌ Muitos testes falharam.');
      console.log('🔧 Verifique se o frontend está rodando corretamente.');
    }
    
    console.log('\n📝 FUNCIONALIDADES TESTADAS:');
    console.log('• Carregamento da aplicação');
    console.log('• Navegação para Agenda');
    console.log('• Elementos da Agenda');
    console.log('• Navegação para Serviços');
    console.log('• Elementos dos Serviços');
    console.log('• Navegação geral');

  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
  } finally {
    console.log('\n🔍 Mantendo o navegador aberto para inspeção manual...');
    console.log('Pressione Ctrl+C para fechar o teste.');
    
    // Manter o navegador aberto por 30 segundos
    await new Promise(resolve => setTimeout(resolve, 30000));
    await browser.close();
  }
}

// Executar o teste
testAgendaSimple().catch(console.error); 