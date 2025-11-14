describe('Cadastro, Login e Agendamento de Doação - Sistema Donate', () => {
  function gerarCpf() {
    const n = () => Math.floor(Math.random() * 9);
    return `${n()}${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}-${n()}${n()}`;
  }

  it('Deve cadastrar, logar e agendar uma doação como usuária doadora', () => {
    const email = `teste${Date.now()}@mail.com`;
    const senha = '123456';
    const cpf = gerarCpf();
    const painelTexto = '🤱 Doe leite materno e salve vidas';

    // --- CADASTRO ---
    cy.visit('/cadastro');

    cy.get('input[formControlName="nome"]').type('Teste Doadora');
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

    cy.url({ timeout: 10000 }).should('include', '/login');

    // --- LOGIN ---
    cy.get('input[formControlName="email"]').type(email);
    cy.get('input[formControlName="senha"]').type(senha);
    cy.get('button[type="submit"]').click();
    cy.contains(painelTexto, { timeout: 10000 }).should('be.visible');

    // --- AGENDAMENTO ---
    cy.visit('/doacao');

    cy.get('mat-select[formControlName="id_bancos_de_leite"]', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.get('mat-option', { timeout: 10000 }).first().click();

    cy.get('input[formControlName="quantidade_ml"]').type('250');
    cy.get('input[formControlName="rua"]').type('Rua Teste');
    cy.get('input[formControlName="numero"]').type('123');
    cy.get('input[formControlName="bairro"]').type('Bairro Teste');

    cy.get('input[placeholder="DD/MM/AAAA"]').click();
    cy.get('.dias-mes .dia-mes', { timeout: 10000 })
      .contains(/\d+/)
      .first()
      .click();

    const horasValidas = () => {
      const h = Math.floor(Math.random() * 10) + 8;
      const m = ['00', '15', '30', '45'][Math.floor(Math.random() * 4)];
      return `${String(h).padStart(2, '0')}:${m}`;
    };
    cy.get('input[formControlName="hora_doacao"]').type(horasValidas());

    cy.window().then(win => {
      cy.stub(win, 'alert').as('alertaDoAgendamento');
    });

    cy.get('button[type="submit"]').click();
    cy.get('@alertaDoAgendamento')
      .should('have.been.calledWithMatch', 'Doação agendada com sucesso!');
  });
});
