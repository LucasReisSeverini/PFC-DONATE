package br.fai.backend.donate.backend.main.port.dao.recuperar_senha;

import java.time.LocalDateTime;

public interface RecuperarSenhaDao {

    /**
     * Salva um código de verificação para o usuário com data de expiração.
     */
    void salvarCodigo(int usuarioId, String codigo, LocalDateTime dataExpiracao);

    /**
     * Valida se o código é válido (não expirado e não usado).
     */
    boolean validarCodigo(int usuarioId, String codigo);

    /**
     * Marca o código como usado.
     */
    void marcarComoUsado(int usuarioId, String codigo);
}
