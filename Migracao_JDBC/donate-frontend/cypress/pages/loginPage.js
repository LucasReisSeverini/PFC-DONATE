class LoginPage {

  emailField() {
    return cy.get('input[formcontrolname="email"]')
  }

  senhaField() {
    return cy.get('input[formcontrolname="senha"]')
  }

  botaoEntrar() {
    return cy.get('button[type="submit"]')
  }

  logar(email, senha) {
    this.emailField().clear().type(email)
    this.senhaField().clear().type(senha)
    this.botaoEntrar().click()
  }
}

export default new LoginPage()
