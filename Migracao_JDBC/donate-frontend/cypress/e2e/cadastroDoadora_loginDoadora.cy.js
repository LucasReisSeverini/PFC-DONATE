describe('Cadastro e Login - Sistema Donate', () => {
  let usuario;

  // Função simples para gerar CPF fake
  function gerarCpf() {
    const n = () => Math.floor(Math.random() * 9);
    return `${n()}${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}-${n()}${n()}`;
  }

  it('Deve cadastrar um novo usuário doador', () => {
    cy.visit('/cadastro');

    const email = `teste${Date.now()}@email.com`;
    const senha = '123456';
    const cpf = gerarCpf();

    usuario = { email, senha, perfil: 'doadora', painelTexto: '🤱 Doe leite materno e salve vidas' };

    cy.get('input[formControlName="nome"]').type('Teste Doador');
    cy.get('input[formControlName="email"]').type(email);
    cy.get('input[formControlName="telefone"]').type('(31) 99999-9999');
    cy.get('input[formControlName="cpf"]').type(cpf);
    cy.get('input[formControlName="senha"]').type(senha);
    cy.get('input[formControlName="confirmarSenha"]').type(senha);

    cy.get('mat-radio-button[value="doadora"]').click();

    cy.get('input[placeholder="Município"]', { timeout: 10000 })
      .should('be.visible')
      .type('Belo Horizonte');

    cy.get('mat-option', { timeout: 10000 })
      .contains('Belo Horizonte - MG')
      .click({ force: true });

    cy.get('mat-checkbox')
      .contains('Li e aceito')
      .click({ force: true });

    cy.get('button[type="submit"]').click();

    // Verifica redirecionamento para login
    cy.url({ timeout: 10000 }).should('include', '/login');
    cy.contains('Entrar').should('be.visible');
  });

  it('Deve logar com o usuário cadastrado e verificar perfil de doadora', () => {
    cy.visit('/login');

    cy.get('input[formControlName="email"]').type(usuario.email);
    cy.get('input[formControlName="senha"]').type(usuario.senha);
    cy.get('button[type="submit"]').click();

    // Verifica se painel do doador está visível com o painelTexto
    cy.contains(usuario.painelTexto, { timeout: 10000 }).should('be.visible');
  });
});
