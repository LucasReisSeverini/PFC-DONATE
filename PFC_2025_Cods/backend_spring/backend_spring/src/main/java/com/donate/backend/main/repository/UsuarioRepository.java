package com.donate.backend.main.repository;

import com.donate.backend.main.domain.UsuarioModel;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class UsuarioRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<UsuarioModel> rowMapper = new BeanPropertyRowMapper<>(UsuarioModel.class);

    public UsuarioRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<UsuarioModel> findAll() {
        return jdbcTemplate.query("SELECT * FROM usuario", rowMapper);
    }

    public Optional<UsuarioModel> findById(Long id) {
        return jdbcTemplate.query("SELECT * FROM usuario WHERE id = ?", rowMapper, id)
                .stream().findFirst();
    }

    public Optional<UsuarioModel> findByEmail(String email) {
        return jdbcTemplate.query("SELECT * FROM usuario WHERE email = ?", rowMapper, email)
                .stream().findFirst();
    }

    public Optional<UsuarioModel> findByEmailOrCpf(String email, String cpf) {
        return jdbcTemplate.query(
                "SELECT * FROM usuario WHERE email = ? OR cpf = ? LIMIT 1",
                rowMapper,
                email,
                cpf
        ).stream().findFirst();
    }

    public UsuarioModel save(UsuarioModel usuario) {
        if (usuario.getId() == null) {
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(
                        "INSERT INTO usuario (nome, telefone, senha, email, cpf, doadora, receptora, profissional, latitude, longitude, id_cidade) " +
                                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        Statement.RETURN_GENERATED_KEYS
                );
                ps.setString(1, usuario.getNome());
                ps.setString(2, usuario.getTelefone());
                ps.setString(3, usuario.getSenha());
                ps.setString(4, usuario.getEmail());
                ps.setString(5, usuario.getCpf());
                ps.setObject(6, usuario.getDoadora());
                ps.setObject(7, usuario.getReceptora());
                ps.setObject(8, usuario.getProfissional());
                ps.setObject(9, usuario.getLatitude());
                ps.setObject(10, usuario.getLongitude());
                ps.setObject(11, usuario.getIdCidade());
                return ps;
            }, keyHolder);
            if (keyHolder.getKey() != null) {
                usuario.setId(keyHolder.getKey().longValue());
            }
        } else {
            jdbcTemplate.update(
                    "UPDATE usuario SET nome = ?, telefone = ?, senha = ?, email = ?, cpf = ?, doadora = ?, receptora = ?, profissional = ?, latitude = ?, longitude = ?, id_cidade = ? WHERE id = ?",
                    usuario.getNome(),
                    usuario.getTelefone(),
                    usuario.getSenha(),
                    usuario.getEmail(),
                    usuario.getCpf(),
                    usuario.getDoadora(),
                    usuario.getReceptora(),
                    usuario.getProfissional(),
                    usuario.getLatitude(),
                    usuario.getLongitude(),
                    usuario.getIdCidade(),
                    usuario.getId()
            );
        }
        return usuario;
    }

    public void deleteById(Long id) {
        jdbcTemplate.update("DELETE FROM usuario WHERE id = ?", id);
    }
}
