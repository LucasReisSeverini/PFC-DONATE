describe('Testes de Login - Sistema Donate', () => {

  const baseUrl = 'http://localhost:4200/login';

  const perfis = [
    {
      nome: 'Doadora',
      email: 'sidao1@email',
      senha: '123',
      painelTexto: '🤱 Doe leite materno e salve vidas'
    },
    {
      nome: 'Profissional',
      email: 'mateusboche@gmail.com',
      senha: '123',
      painelTexto: '👨‍💼 Perfil Profissional'
    },
    {
      nome: 'Admin',
      email: 'mateussenaisrs@gmail.com',
      senha: '123',
      painelTexto: '👨‍💼 Painel do Administrador'
    }
  ];

  perfis.forEach((perfil) => {
    it(`Deve logar corretamente como ${perfil.nome}`, () => {
      cy.visit(baseUrl);

      // Preenche o formulário
      cy.get('input[formcontrolname="email"]').clear().type(perfil.email);
      cy.get('input[formcontrolname="senha"]').clear().type(perfil.senha);

      // Submete o formulário
      cy.get('button[type="submit"]').click();

      // Aguarda o redirecionamento
      cy.url().should('include', '/painel');

      // Confere se o texto esperado aparece na tela
      cy.contains(perfil.painelTexto, { timeout: 10000 }).should('be.visible');

      // Verifica se o token foi salvo no localStorage
      cy.window().then((win) => {
        const token = win.localStorage.getItem('token');
        expect(token).to.exist;
      });

      // Faz logout se existir botão de sair
      cy.get('button, a')
        .contains(/sair|logout/i)
        .click({ force: true })
        .then(() => {
          cy.url().should('include', '/login');
        });
    });
  });
});
