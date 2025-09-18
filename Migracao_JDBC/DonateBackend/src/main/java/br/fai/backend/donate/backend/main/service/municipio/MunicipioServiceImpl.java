package br.fai.backend.donate.backend.main.service.municipio;

import br.fai.backend.donate.backend.main.domain.MunicipioModel;
import br.fai.backend.donate.backend.main.domain.UnidadeFederativaModel;
import br.fai.backend.donate.backend.main.port.service.municipio.MunicipioService;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MunicipioServiceImpl implements MunicipioService {

    private final JdbcTemplate jdbcTemplate;

    public MunicipioServiceImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<MunicipioModel> rowMapper = (rs, rowNum) -> {
        UnidadeFederativaModel uf = new UnidadeFederativaModel();
        uf.setId(rs.getInt("uf_id"));
        uf.setNome(rs.getString("uf_nome"));
        uf.setSigla(rs.getString("uf_sigla"));

        MunicipioModel municipio = new MunicipioModel();
        municipio.setId(rs.getInt("m_id"));
        municipio.setNome(rs.getString("m_nome"));
        municipio.setUnidadeFederativa(uf);

        return municipio;
    };

    @Override
    public int create(MunicipioModel entity) {
        String sql = "INSERT INTO municipio (nome, id_unidade_federativa) VALUES (?, ?) RETURNING id;";
        return jdbcTemplate.queryForObject(
                sql,
                Integer.class,
                entity.getNome(),
                entity.getUnidadeFederativa().getId()
        );
    }

    @Override
    public void delete(int id) {
        String sql = "DELETE FROM municipio WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public void update(int id, MunicipioModel entity) {
        String sql = "UPDATE municipio SET nome = ?, id_unidade_federativa = ? WHERE id = ?";
        jdbcTemplate.update(sql, entity.getNome(), entity.getUnidadeFederativa().getId(), id);
    }

    @Override
    public Optional<MunicipioModel> findById(int id) {
        String sql = "SELECT m.id AS m_id, m.nome AS m_nome, " +
                "uf.id AS uf_id, uf.nome AS uf_nome, uf.sigla AS uf_sigla " +
                "FROM municipio m " +
                "JOIN unidade_federativa uf ON m.id_unidade_federativa = uf.id " +
                "WHERE m.id = ?";
        try {
            MunicipioModel municipio = jdbcTemplate.queryForObject(sql, rowMapper, id);
            return Optional.ofNullable(municipio);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<MunicipioModel> findAll() {
        String sql = "SELECT m.id AS m_id, m.nome AS m_nome, " +
                "uf.id AS uf_id, uf.nome AS uf_nome, uf.sigla AS uf_sigla " +
                "FROM municipio m " +
                "JOIN unidade_federativa uf ON m.id_unidade_federativa = uf.id";
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public List<MunicipioModel> findByNome(String nome) {
        String sql = "SELECT m.id AS m_id, m.nome AS m_nome, " +
                "uf.id AS uf_id, uf.nome AS uf_nome, uf.sigla AS uf_sigla " +
                "FROM municipio m " +
                "JOIN unidade_federativa uf ON m.id_unidade_federativa = uf.id " +
                "WHERE LOWER(m.nome) LIKE LOWER(?)";
        return jdbcTemplate.query(sql, rowMapper, "%" + nome + "%");
    }
}
