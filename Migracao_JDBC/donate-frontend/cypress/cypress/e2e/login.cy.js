describe('Tela de Login - Sistema Donate', () => {
  const urlLogin = 'http://localhost:4200/login'

  beforeEach(() => {
    cy.visit(urlLogin)
  })

  it('Deve exibir os campos de email e senha corretamente', () => {
    cy.get('input[formControlName="email"]').should('be.visible')
    cy.get('input[formControlName="senha"]').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Entrar')
  })

  it('Deve exibir alerta ao tentar logar com campos vazios', () => {
    cy.get('button[type="submit"]').click()
    cy.on('window:alert', (msg) => {
      expect(msg).to.contain('Por favor, preencha todos os campos obrigatórios')
    })
  })

  it('Deve realizar login com sucesso e redirecionar para /painel', () => {
    cy.get('input[formControlName="email"]').type('sidao1@email')
    cy.get('input[formControlName="senha"]').type('123')
    cy.get('button[type="submit"]').click()

    cy.on('window:alert', (msg) => {
      expect(msg).to.contain('Login realizado com sucesso')
    })

    cy.url().should('include', '/painel')
  })

  it('Deve exibir alerta de erro ao tentar logar com credenciais inválidas', () => {
    cy.get('input[formControlName="email"]').type('admin')
    cy.get('input[formControlName="senha"]').type('admin')
    cy.get('button[type="submit"]').click()

    cy.on('window:alert', (msg) => {
      expect(msg).to.contain('Email ou senha inválidos')
    })
  })
})
