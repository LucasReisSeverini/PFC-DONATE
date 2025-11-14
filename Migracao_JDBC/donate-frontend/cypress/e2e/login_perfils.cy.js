import loginPage from '../pages/loginPage'

describe('Testes de Login - Sistema Donate', () => {

  let usuarios; // <-- AQUI ARMAZENA A FIXTURE

  before(() => {
    cy.fixture('usuarios').then((data) => {
      usuarios = data; // <-- AQUI CARREGA DA FIXTURE
    });
  });

  it('Login da Doadora', () => {
    cy.logar(usuarios.doadora.email, usuarios.doadora.senha)
    cy.url().should('include', '/painel')
    cy.contains(usuarios.doadora.painelTexto).should('be.visible')
  })

  it('Login do Profissional', () => {
    cy.logar(usuarios.profissional.email, usuarios.profissional.senha)
    cy.url().should('include', '/painel')
    cy.contains(usuarios.profissional.painelTexto).should('be.visible')
  })

  it('Login do Admin', () => {
    cy.logar(usuarios.admin.email, usuarios.admin.senha)
    cy.url().should('include', '/painel')
    cy.contains(usuarios.admin.painelTexto).should('be.visible')
  })

})
