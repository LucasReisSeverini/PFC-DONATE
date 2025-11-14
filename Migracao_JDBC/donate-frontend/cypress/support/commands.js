import loginPage from '../pages/loginPage'

Cypress.Commands.add('logar', (email, senha) => {
  cy.visit('/login')
  loginPage.logar(email, senha)
})
