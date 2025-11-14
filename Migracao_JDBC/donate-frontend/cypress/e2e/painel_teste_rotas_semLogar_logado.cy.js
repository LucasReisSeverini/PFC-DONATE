import LoginPage from '../pages/LoginPage'

describe('Rotas Públicas - Sistema Donate', () => {

  it('Deve acessar a página de login', () => {
    cy.visit('/login');
    cy.contains('Entrar').should('be.visible');
  });

  it('Deve acessar a página de cadastro', () => {
    cy.visit('/cadastro');
    cy.contains('Cadastre-se agora!').should('be.visible');
    cy.contains('Cadastrar').should('be.visible');
  });

  it('Deve acessar a página de eventos', () => {
    cy.visit('/eventos');
    cy.contains('Eventos').should('be.visible');
  });

  it('Deve acessar banco mais próximo (com erro de GPS, mas rota acessível)', () => {
    cy.visit('/banco-proximo', {
      onBeforeLoad(win) {
        cy.stub(win.navigator.geolocation, 'getCurrentPosition')
          .callsFake((success, error) => {
            error({ code: 1, message: 'User denied Geolocation' });
          });
      }
    });

    cy.url().should('include', '/banco-proximo');
    cy.contains(/erro ao obter/i).should('be.visible');

    cy.get('body').then(($body) => {
      if ($body.text().includes('Ponto de Coleta')) {
        cy.contains('Ponto de Coleta / Banco de Leite Humano mais próximo')
          .should('be.visible');
      }
    });
  });

  it('Não deve acessar /doacao sem estar logado (deve redirecionar para login)', () => {
    cy.visit('/doacao');
    cy.url().should('include', '/login');
    cy.contains('Entrar').should('be.visible');
  });

  it('Não deve acessar /meus-agendamentos sem estar logado', () => {
    cy.visit('/meus-agendamentos');
    cy.url().should('include', '/login');
    cy.contains('Entrar').should('be.visible');
  });

  it('Não deve acessar /perfil sem estar logado', () => {
    cy.visit('/perfil');
    cy.url().should('include', '/login');
    cy.contains('Entrar').should('be.visible');
  });

});

// 🔐 ROTAS PRIVADAS
describe('Rotas Privadas - Sistema Donate', () => {

  beforeEach(function () {
    // Carrega fixture com usuários
    cy.fixture('usuarios').then((users) => {
      this.doador = users.doadora;

      // Faz login usando LoginPage
      cy.visit('/login');
      LoginPage.logar(this.doador.email, this.doador.senha);

      // Aguarda painel aparecer
      cy.contains(this.doador.painelTexto, { timeout: 8000 }).should('be.visible');
    });
  });

  it('Deve acessar a página de doação', function () {
    cy.visit('/doacao');
    cy.url().should('include', '/doacao');

    cy.contains('Agendar Doação').should('be.visible');
    cy.contains('Usar banco de leite mais próximo').should('be.visible');
    cy.contains('Quantidade (ml)').should('be.visible');
    cy.contains('Agendar').should('be.visible');
  });

  it('Deve acessar a página de meus agendamentos', function () {
    cy.visit('/meus-agendamentos');
    cy.url().should('include', '/meus-agendamentos');

    cy.contains('Meus Agendamentos').should('be.visible');
    cy.contains('Todos os Status').should('be.visible');   // select
    cy.contains('Mais recentes').should('be.visible');    // outro select
  });

  it('Deve acessar a página de perfil', function () {
    cy.visit('/perfil');
    cy.url().should('include', '/perfil');

    cy.contains('Meu Perfil').should('be.visible');
    cy.get('#nome').should('be.visible');
    cy.get('#email').should('be.visible');
    cy.get('#telefone').should('be.visible');
    cy.get('#senhaAntiga').should('be.visible');
    cy.contains('Salvar Alterações').should('be.visible');
    cy.contains('Sair').should('be.visible');
  });

});
