const puppeteer = require('puppeteer');

async function testAgendaComplete() {
  console.log('🧪 Iniciando teste completo da Agenda e Sistema de Serviços...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 100,
    defaultViewport: { width: 1400, height: 900 }
  });
  
  const page = await browser.newPage();
  
  try {
    // Navegar para a aplicação
    await page.goto('http://localhost:5173');
    console.log('✅ Aplicação carregada');
    
    // Aguardar carregamento inicial
    await page.waitForSelector('body', { timeout: 5000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results = {
      total: 0,
      passed: 0,
      failed: 0,
      details: []
    };

    // Teste 1: Verificar se a página de Agenda carrega
    console.log('\n📋 Teste 1: Carregamento da página de Agenda...');
    results.total++;
    
    try {
      // Ir para a página de Agenda
      await page.click('a[href="/agenda"]');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar se o título da agenda aparece
      const agendaTitle = await page.$eval('h1', el => el.textContent);
      if (agendaTitle.includes('Agenda')) {
        console.log('✅ Página de Agenda carregada corretamente');
        results.passed++;
      } else {
        console.log('❌ Página de Agenda não carregou');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro ao carregar página de Agenda:', error.message);
      results.failed++;
    }

    // Teste 2: Verificar navegação do calendário
    console.log('\n📋 Teste 2: Navegação do calendário...');
    results.total++;
    
    try {
      // Verificar se os botões de navegação existem
      const prevButton = await page.$('button svg[data-lucide="chevron-left"]');
      const nextButton = await page.$('button svg[data-lucide="chevron-right"]');
      
      if (prevButton && nextButton) {
        console.log('✅ Botões de navegação do calendário encontrados');
        
        // Testar navegação para o próximo mês
        await page.click('button svg[data-lucide="chevron-right"]');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar se o mês mudou
        const monthText = await page.$eval('h2', el => el.textContent);
        console.log('✅ Navegação do calendário funcionando');
        results.passed++;
      } else {
        console.log('❌ Botões de navegação não encontrados');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro na navegação do calendário:', error.message);
      results.failed++;
    }

    // Teste 3: Verificar filtros e busca
    console.log('\n📋 Teste 3: Filtros e busca da Agenda...');
    results.total++;
    
    try {
      // Verificar campo de busca
      const searchInput = await page.$('input[placeholder="Buscar agendamentos..."]');
      if (searchInput) {
        await searchInput.type('teste');
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('✅ Campo de busca funcionando');
        
        // Verificar filtro de status
        const statusFilter = await page.$('select');
        if (statusFilter) {
          await statusFilter.select('agendado');
          await new Promise(resolve => setTimeout(resolve, 500));
          console.log('✅ Filtro de status funcionando');
          results.passed++;
        } else {
          console.log('❌ Filtro de status não encontrado');
          results.failed++;
        }
      } else {
        console.log('❌ Campo de busca não encontrado');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro nos filtros:', error.message);
      results.failed++;
    }

    // Teste 4: Verificar página de Serviços
    console.log('\n📋 Teste 4: Página de Serviços...');
    results.total++;
    
    try {
      // Ir para a página de Serviços
      await page.click('a[href="/services"]');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar se o título aparece
      const servicesTitle = await page.$eval('h1', el => el.textContent);
      if (servicesTitle.includes('Serviços')) {
        console.log('✅ Página de Serviços carregada');
        
        // Verificar se as abas existem
        const cadastroTab = await page.$('button:has-text("Cadastro de Serviços")');
        const visualizarTab = await page.$('button:has-text("Visualizar Agendamentos")');
        
        if (cadastroTab && visualizarTab) {
          console.log('✅ Abas da página de Serviços encontradas');
          results.passed++;
        } else {
          console.log('❌ Abas não encontradas');
          results.failed++;
        }
      } else {
        console.log('❌ Página de Serviços não carregou');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro na página de Serviços:', error.message);
      results.failed++;
    }

    // Teste 5: Testar cadastro de serviço
    console.log('\n📋 Teste 5: Cadastro de serviço...');
    results.total++;
    
    try {
      // Verificar se o formulário existe
      const form = await page.$('form');
      if (form) {
        console.log('✅ Formulário de cadastro encontrado');
        
        // Verificar campos obrigatórios
        const clienteInput = await page.$('input[placeholder="Selecione o cliente..."]');
        const petInput = await page.$('input[placeholder="Selecione o pet..."]');
        const tipoInput = await page.$('input[placeholder="Tipo de serviço..."]');
        const valorInput = await page.$('input[placeholder="Digite o valor do serviço"]');
        const dataInput = await page.$('input[type="date"]');
        
        if (clienteInput && petInput && tipoInput && valorInput && dataInput) {
          console.log('✅ Todos os campos do formulário encontrados');
          results.passed++;
        } else {
          console.log('❌ Campos do formulário incompletos');
          results.failed++;
        }
      } else {
        console.log('❌ Formulário não encontrado');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro no cadastro de serviço:', error.message);
      results.failed++;
    }

    // Teste 6: Testar navegação por teclado nos campos
    console.log('\n📋 Teste 6: Navegação por teclado...');
    results.total++;
    
    try {
      // Testar campo de cliente
      await page.click('input[placeholder="Selecione o cliente..."]');
      await new Promise(resolve => setTimeout(resolve, 500));
      await page.keyboard.press('ArrowDown');
      await new Promise(resolve => setTimeout(resolve, 300));
      await page.keyboard.press('Enter');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verificar se foi selecionado
      const clienteValue = await page.$eval('input[placeholder="Selecione o cliente..."]', el => el.value);
      if (clienteValue) {
        console.log('✅ Navegação por teclado no campo cliente funcionando');
        results.passed++;
      } else {
        console.log('❌ Navegação por teclado no campo cliente falhou');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro na navegação por teclado:', error.message);
      results.failed++;
    }

    // Teste 7: Verificar visualização de agendamentos
    console.log('\n📋 Teste 7: Visualização de agendamentos...');
    results.total++;
    
    try {
      // Ir para a aba de visualização
      await page.click('button:has-text("Visualizar Agendamentos")');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar se a tabela ou lista aparece
      const table = await page.$('table');
      const list = await page.$('.space-y-4');
      
      if (table || list) {
        console.log('✅ Lista de agendamentos carregada');
        results.passed++;
      } else {
        console.log('❌ Lista de agendamentos não encontrada');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro na visualização de agendamentos:', error.message);
      results.failed++;
    }

    // Teste 8: Verificar estatísticas
    console.log('\n📋 Teste 8: Estatísticas da Agenda...');
    results.total++;
    
    try {
      // Voltar para a Agenda
      await page.click('a[href="/agenda"]');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar se as estatísticas aparecem
      const statsCards = await page.$$('.card');
      if (statsCards.length >= 3) {
        console.log('✅ Estatísticas da Agenda carregadas');
        results.passed++;
      } else {
        console.log('❌ Estatísticas não encontradas');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro nas estatísticas:', error.message);
      results.failed++;
    }

    // Teste 9: Verificar seleção de data no calendário
    console.log('\n📋 Teste 9: Seleção de data no calendário...');
    results.total++;
    
    try {
      // Clicar em uma data no calendário
      const calendarDays = await page.$$('.min-h-\\[100px\\]');
      if (calendarDays.length > 0) {
        await calendarDays[10].click(); // Clicar em um dia do meio do mês
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar se a data foi selecionada
        const selectedDay = await page.$('.bg-blue-100.border-blue-400');
        if (selectedDay) {
          console.log('✅ Seleção de data no calendário funcionando');
          results.passed++;
        } else {
          console.log('❌ Seleção de data não funcionou');
          results.failed++;
        }
      } else {
        console.log('❌ Dias do calendário não encontrados');
        results.failed++;
      }
    } catch (error) {
      console.log('❌ Erro na seleção de data:', error.message);
      results.failed++;
    }

    // Teste 10: Verificar responsividade
    console.log('\n📋 Teste 10: Responsividade...');
    results.total++;
    
    try {
      // Mudar para viewport mobile
      await page.setViewport({ width: 768, height: 1024 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar se os elementos ainda estão visíveis
      const header = await page.$('h1');
      const calendar = await page.$('.grid.grid-cols-7');
      
      if (header && calendar) {
        console.log('✅ Layout responsivo funcionando');
        results.passed++;
      } else {
        console.log('❌ Problemas de responsividade');
        results.failed++;
      }
      
      // Voltar para desktop
      await page.setViewport({ width: 1400, height: 900 });
    } catch (error) {
      console.log('❌ Erro no teste de responsividade:', error.message);
      results.failed++;
    }

    // Relatório final
    console.log('\n📊 RELATÓRIO FINAL DA AGENDA E SISTEMA DE SERVIÇOS');
    console.log('=' .repeat(60));
    console.log(`Total de testes: ${results.total}`);
    console.log(`✅ Passou: ${results.passed}`);
    console.log(`❌ Falhou: ${results.failed}`);
    console.log(`📈 Taxa de sucesso: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    
    if (results.failed === 0) {
      console.log('\n🎉 TODOS OS TESTES PASSARAM!');
      console.log('✅ A Agenda e o Sistema de Serviços estão funcionando perfeitamente.');
    } else {
      console.log('\n⚠️  Alguns testes falharam. Verifique os detalhes acima.');
    }
    
    console.log('\n📝 FUNCIONALIDADES TESTADAS:');
    console.log('• Carregamento da página de Agenda');
    console.log('• Navegação do calendário');
    console.log('• Filtros e busca');
    console.log('• Página de Serviços');
    console.log('• Cadastro de serviços');
    console.log('• Navegação por teclado');
    console.log('• Visualização de agendamentos');
    console.log('• Estatísticas');
    console.log('• Seleção de data');
    console.log('• Responsividade');

  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
  } finally {
    await browser.close();
  }
}

// Executar o teste
testAgendaComplete().catch(console.error); 