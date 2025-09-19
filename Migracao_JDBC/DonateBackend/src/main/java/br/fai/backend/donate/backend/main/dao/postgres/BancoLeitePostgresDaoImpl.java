package br.fai.backend.donate.backend.main.dao.postgres;

import br.fai.backend.donate.backend.main.domain.BancoLeiteModel;
import br.fai.backend.donate.backend.main.port.dao.bancoLeite.BancoLeiteDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.util.List;

@Repository
public class BancoLeitePostgresDaoImpl implements BancoLeiteDao {

    private final JdbcTemplate jdbcTemplate;

    public BancoLeitePostgresDaoImpl(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    private final RowMapper<BancoLeiteModel> rowMapper = (rs, rowNum) -> {
        BancoLeiteModel banco = new BancoLeiteModel();
        banco.setId(rs.getLong("id"));
        banco.setNome(rs.getString("nome"));
        banco.setEndereco(rs.getString("endereco"));
        banco.setTelefone(rs.getString("telefone"));
        banco.setLatitude(rs.getObject("latitude") != null ? rs.getDouble("latitude") : null);
        banco.setLongitude(rs.getObject("longitude") != null ? rs.getDouble("longitude") : null);
        banco.setIdMunicipio(rs.getInt("id_municipio"));
        return banco;
    };

    @Override
    public int add(BancoLeiteModel entity) {
        String sql = "INSERT INTO bancos_de_leite (nome, endereco, telefone, latitude, longitude, id_municipio) " +
                "VALUES (?, ?, ?, ?, ?, ?) RETURNING id";
        return jdbcTemplate.queryForObject(
                sql,
                Integer.class,
                entity.getNome(),
                entity.getEndereco(),
                entity.getTelefone(),
                entity.getLatitude(),
                entity.getLongitude(),
                entity.getIdMunicipio()
        );
    }

    @Override
    public void remove(int id) {
        String sql = "DELETE FROM bancos_de_leite WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public BancoLeiteModel readByID(int id) {
        String sql = "SELECT * FROM bancos_de_leite WHERE id = ?";
        List<BancoLeiteModel> result = jdbcTemplate.query(sql, rowMapper, id);
        return result.isEmpty() ? null : result.get(0);
    }

    @Override
    public List<BancoLeiteModel> readAll() {
        String sql = "SELECT * FROM bancos_de_leite";
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public void updateInformation(int id, BancoLeiteModel entity) {
        String sql = "UPDATE bancos_de_leite SET nome=?, endereco=?, telefone=?, latitude=?, longitude=?, id_municipio=? WHERE id=?";
        jdbcTemplate.update(sql,
                entity.getNome(),
                entity.getEndereco(),
                entity.getTelefone(),
                entity.getLatitude(),
                entity.getLongitude(),
                entity.getIdMunicipio(),
                id
        );
    }
}
