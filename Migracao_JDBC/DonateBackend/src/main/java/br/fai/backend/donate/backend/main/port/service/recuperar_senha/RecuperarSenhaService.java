package br.fai.backend.donate.backend.main.port.service.recuperar_senha;

public interface RecuperarSenhaService {

    /**
     * Gera um código de verificação e envia por e-mail para o usuário.
     *
     * @param email do usuário que solicitou a recuperação de senha
     * @return true se o e-mail foi enviado com sucesso, false caso contrário
     */
    boolean enviarCodigoVerificacao(String email);

    /**
     * Valida o código de verificação recebido pelo usuário.
     *
     * @param email do usuário
     * @param codigo recebido pelo e-mail
     * @return true se o código é válido e não expirou, false caso contrário
     */
    boolean validarCodigo(String email, String codigo);

    /**
     * Reseta a senha do usuário após validar o código de verificação.
     *
     * @param email do usuário
     * @param codigo de verificação
     * @param novaSenha que será definida
     * @return true se a senha foi alterada com sucesso, false caso contrário
     */
    boolean resetarSenha(String email, String codigo, String novaSenha);
}
