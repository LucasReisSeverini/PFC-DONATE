package br.fai.backend.donate.backend.main.port.dao.user;

import java.sql.SQLException;

public interface UpdatePasswordDao {

    // Atualiza a senha do usuário, respeitando histórico
    boolean updatePassword(final int id, final String newPassword) throws SQLException;

    // Recupera a senha atual do usuário
    String getSenhaAtual(Long usuarioId) throws SQLException;

    // Verifica se a senha já foi utilizada nas últimas trocas
    boolean senhaJaUtilizada(Long usuarioId, String novaSenhaHash) throws SQLException;

    // Salva a senha no histórico
    void salvarSenhaNoHistorico(Long usuarioId, String senhaHash) throws SQLException;

    // Atualiza a senha do usuário
    void atualizarSenha(Long usuarioId, String novaSenhaHash) throws SQLException;

    // Limita o histórico de senhas antigas (ex: manter apenas 3 últimas)
    void limparHistorico(Long usuarioId, int limiteHistorico) throws SQLException;
}
