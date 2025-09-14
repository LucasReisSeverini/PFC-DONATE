package com.donate.backend.main.repository;

import com.donate.backend.main.domain.CidadeModel;
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
public class CidadeRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<CidadeModel> rowMapper = new BeanPropertyRowMapper<>(CidadeModel.class);

    public CidadeRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<CidadeModel> findAll() {
        return jdbcTemplate.query("SELECT * FROM cidade", rowMapper);
    }

    public Optional<CidadeModel> findById(Long id) {
        return jdbcTemplate.query("SELECT * FROM cidade WHERE id = ?", rowMapper, id)
                .stream().findFirst();
    }

    public CidadeModel save(CidadeModel cidade) {
        if (cidade.getId() == null) {
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(
                        "INSERT INTO cidade (nome, estado) VALUES (?, ?)",
                        Statement.RETURN_GENERATED_KEYS
                );
                ps.setString(1, cidade.getNome());
                ps.setString(2, cidade.getEstado());
                return ps;
            }, keyHolder);
            if (keyHolder.getKey() != null) {
                cidade.setId(keyHolder.getKey().longValue());
            }
        } else {
            jdbcTemplate.update(
                    "UPDATE cidade SET nome = ?, estado = ? WHERE id = ?",
                    cidade.getNome(),
                    cidade.getEstado(),
                    cidade.getId()
            );
        }
        return cidade;
    }

    public void deleteById(Long id) {
        jdbcTemplate.update("DELETE FROM cidade WHERE id = ?", id);
    }
}
