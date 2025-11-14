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

    // Deve redirecionar automaticamente para login
    cy.url().should('include', '/login');

    // Deve mostrar elemento da tela de login
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

});
