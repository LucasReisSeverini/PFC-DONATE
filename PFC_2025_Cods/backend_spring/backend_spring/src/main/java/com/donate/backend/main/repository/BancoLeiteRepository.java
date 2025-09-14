package com.donate.backend.main.repository;

import com.donate.backend.main.domain.BancoLeiteModel;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class BancoLeiteRepository {

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<BancoLeiteModel> rowMapper = new BeanPropertyRowMapper<>(BancoLeiteModel.class);

    public BancoLeiteRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<BancoLeiteModel> findAll() {
        return jdbcTemplate.query("SELECT * FROM bancos_de_leite", rowMapper);
    }

    public Map<String, Object> buscarMaisProximo(double latitude, double longitude) {
        String sql = """
            SELECT *, (
                6371 * acos(
                    cos(radians(?)) *
                    cos(radians(b.latitude)) *
                    cos(radians(b.longitude) - radians(?)) +
                    sin(radians(?)) *
                    sin(radians(b.latitude))
                )
            ) AS distancia
            FROM bancos_de_leite b
            ORDER BY distancia ASC
            LIMIT 1
        """;
        return jdbcTemplate.queryForMap(sql, latitude, longitude, latitude);
    }
}
