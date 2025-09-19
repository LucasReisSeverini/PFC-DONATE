package br.fai.backend.donate.backend.main.dao.postgres;

import br.fai.backend.donate.backend.main.domain.DoacaoModel;
import br.fai.backend.donate.backend.main.port.dao.doacao.DoacaoDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class DoacaoDaoImpl implements DoacaoDao {

    private final Connection connection;

    @Autowired
    public DoacaoDaoImpl(DataSource dataSource) throws SQLException {
        this.connection = dataSource.getConnection();
    }

    @Override
    public int salvar(DoacaoModel doacao) {
        String sql = """
            INSERT INTO doacao 
            (data_doacao, status, quantidade_ml, rua, numero, bairro, id_usuario, id_bancos_de_leite) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """;

        try (PreparedStatement ps = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)) {
            ps.setTimestamp(1, Timestamp.valueOf(doacao.getDataDoacao()));
            ps.setString(2, doacao.getStatus());
            ps.setInt(3, doacao.getQuantidadeMl());
            ps.setString(4, doacao.getRua());
            ps.setString(5, doacao.getNumero());
            ps.setString(6, doacao.getBairro());
            ps.setLong(7, doacao.getUsuarioId());
            ps.setLong(8, doacao.getBancoDeLeiteId());

            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    doacao.setId(rs.getLong(1));
                }
            }

            return doacao.getId().intValue();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<DoacaoModel> listarTodas() {
        String sql = "SELECT * FROM doacao";
        List<DoacaoModel> doacoes = new ArrayList<>();

        try (PreparedStatement ps = connection.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
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

                doacoes.add(doacao);
            }

            return doacoes;

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Optional<DoacaoModel> buscarPorId(Long id) {
        String sql = "SELECT * FROM doacao WHERE id = ?";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
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

                    return Optional.of(doacao);
                }
            }

            return Optional.empty();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public int atualizar(DoacaoModel doacao) {
        String sql = "UPDATE doacao SET data_doacao=?, status=?, quantidade_ml=?, rua=?, numero=?, bairro=?, id_usuario=?, id_bancos_de_leite=? WHERE id=?";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setTimestamp(1, Timestamp.valueOf(doacao.getDataDoacao()));
            ps.setString(2, doacao.getStatus());
            ps.setInt(3, doacao.getQuantidadeMl());
            ps.setString(4, doacao.getRua());
            ps.setString(5, doacao.getNumero());
            ps.setString(6, doacao.getBairro());
            ps.setLong(7, doacao.getUsuarioId());
            ps.setLong(8, doacao.getBancoDeLeiteId());
            ps.setLong(9, doacao.getId());

            return ps.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public int deletar(Long id) {
        String sql = "DELETE FROM doacao WHERE id = ?";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setLong(1, id);
            return ps.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<DoacaoModel> buscarPorUsuarioId(Long idUsuario) {
        String sql = "SELECT * FROM doacao WHERE id_usuario = ?";
        List<DoacaoModel> doacoes = new ArrayList<>();

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setLong(1, idUsuario);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
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

                    doacoes.add(doacao);
                }
            }

            return doacoes;

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean existeAgendamento(Long idBanco, LocalDateTime dataHora) {
        String sql = "SELECT COUNT(*) FROM doacao WHERE id_bancos_de_leite = ? AND data_doacao = ?";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setLong(1, idBanco);
            ps.setTimestamp(2, Timestamp.valueOf(dataHora));

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() && rs.getInt(1) > 0;
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
