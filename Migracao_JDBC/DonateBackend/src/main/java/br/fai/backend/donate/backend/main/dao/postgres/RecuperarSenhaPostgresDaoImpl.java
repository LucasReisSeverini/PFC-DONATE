package br.fai.backend.donate.backend.main.dao.postgres;

import br.fai.backend.donate.backend.main.port.dao.recuperar_senha.RecuperarSenhaDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public class RecuperarSenhaPostgresDaoImpl implements RecuperarSenhaDao {

    private final JdbcTemplate jdbcTemplate;

    public RecuperarSenhaPostgresDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void salvarCodigo(int usuarioId, String codigo, LocalDateTime dataExpiracao) {
        String sql = "INSERT INTO token_recuperacao (usuario_id, codigo, data_expiracao, usado) VALUES (?, ?, ?, false)";
        jdbcTemplate.update(sql, usuarioId, codigo, dataExpiracao);
    }

    @Override
    public boolean validarCodigo(int usuarioId, String codigo) {
        String sql = "SELECT COUNT(*) FROM token_recuperacao WHERE usuario_id = ? AND codigo = ? AND usado = false AND data_expiracao >= now()";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, usuarioId, codigo);
        return count != null && count > 0;
    }

    @Override
    public void marcarComoUsado(int usuarioId, String codigo) {
        String sql = "UPDATE token_recuperacao SET usado = true WHERE usuario_id = ? AND codigo = ?";
        jdbcTemplate.update(sql, usuarioId, codigo);
    }
}
