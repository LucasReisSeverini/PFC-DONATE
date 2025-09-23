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
        String sql = "INSERT INTO recuperar_senha (usuario_id, codigo, data_expiracao, usado) VALUES (?, ?, ?, false)";
        jdbcTemplate.update(sql, usuarioId, codigo, dataExpiracao);
    }

    @Override
    public boolean validarCodigo(int usuarioId, String codigo) {
        String sql = "SELECT COUNT(*) FROM recuperar_senha WHERE usuario_id = ? AND codigo = ? AND usado = false AND data_expiracao >= now()";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, usuarioId, codigo);
        return count != null && count > 0;
    }

    @Override
    public void marcarComoUsado(int usuarioId, String codigo) {
        String sql = "UPDATE recuperar_senha SET usado = true WHERE usuario_id = ? AND codigo = ?";
        jdbcTemplate.update(sql, usuarioId, codigo);
    }
}
