package br.fai.backend.donate.backend.main.dao.postgres;

import br.fai.backend.donate.backend.main.domain.DoacaoModel;
import br.fai.backend.donate.backend.main.port.dao.doacao.DoacaoDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class DoacaoDaoImpl implements DoacaoDao {

    private final JdbcTemplate jdbcTemplate;

    public DoacaoDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<DoacaoModel> rowMapper = new RowMapper<>() {
        @Override
        public DoacaoModel mapRow(ResultSet rs, int rowNum) throws SQLException {
            DoacaoModel doacao = new DoacaoModel();
            doacao.setId(rs.getLong("id"));
            doacao.setDataDoacao(rs.getTimestamp("data_doacao").toLocalDateTime());
            doacao.setStatus(rs.getString("status"));
            doacao.setQuantidadeMl(rs.getInt("quantidade_ml"));
            doacao.setRua(rs.getString("rua"));
            doacao.setNumero(rs.getString("numero"));
            doacao.setBairro(rs.getString("bairro"));
            doacao.setUsuarioId(rs.getLong("id_usuario"));
            doacao.setBancoDeLeiteId(rs.getLong("id_bancos_de_leite"));
            return doacao;
        }
    };

    @Override
    public int salvar(DoacaoModel doacao) {
        String sql = """
            INSERT INTO doacao 
            (data_doacao, status, quantidade_ml, rua, numero, bairro, id_usuario, id_bancos_de_leite) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """;
        return jdbcTemplate.update(sql,
                doacao.getDataDoacao(),
                doacao.getStatus(),
                doacao.getQuantidadeMl(),
                doacao.getRua(),
                doacao.getNumero(),
                doacao.getBairro(),
                doacao.getUsuarioId(),
                doacao.getBancoDeLeiteId());
    }

    @Override
    public List<DoacaoModel> listarTodas() {
        String sql = "SELECT * FROM doacao";
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public Optional<DoacaoModel> buscarPorId(Long id) {
        String sql = "SELECT * FROM doacao WHERE id = ?";
        List<DoacaoModel> result = jdbcTemplate.query(sql, rowMapper, id);
        return result.stream().findFirst();
    }

    @Override
    public int atualizar(DoacaoModel doacao) {
        String sql = """
            UPDATE doacao SET data_doacao=?, status=?, quantidade_ml=?, 
            rua=?, numero=?, bairro=?, id_usuario=?, id_bancos_de_leite=? 
            WHERE id=?
        """;
        return jdbcTemplate.update(sql,
                doacao.getDataDoacao(),
                doacao.getStatus(),
                doacao.getQuantidadeMl(),
                doacao.getRua(),
                doacao.getNumero(),
                doacao.getBairro(),
                doacao.getUsuarioId(),
                doacao.getBancoDeLeiteId(),
                doacao.getId());
    }

    @Override
    public int deletar(Long id) {
        String sql = "DELETE FROM doacao WHERE id=?";
        return jdbcTemplate.update(sql, id);
    }

    // 🔹 Busca todas as doações de um usuário
    @Override
    public List<DoacaoModel> buscarPorUsuarioId(Long idUsuario) {
        String sql = "SELECT * FROM doacao WHERE id_usuario = ?";
        return jdbcTemplate.query(sql, rowMapper, idUsuario);
    }

    // 🔹 Verifica se existe agendamento para um banco e horário específico
    @Override
    public boolean existeAgendamento(Long idBanco, LocalDateTime dataHora) {
        String sql = "SELECT COUNT(*) FROM doacao WHERE id_bancos_de_leite = ? AND data_doacao = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, idBanco, dataHora);
        return count != null && count > 0;
    }
}
