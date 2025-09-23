package br.fai.backend.donate.backend.main.dao.postgres;

import br.fai.backend.donate.backend.main.domain.EventoModel;
import br.fai.backend.donate.backend.main.port.dao.evento.EventoDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class EventoPostgresDaoImpl implements EventoDao {

    private final Connection connection;

    @Autowired
    public EventoPostgresDaoImpl(DataSource dataSource) throws SQLException {
        this.connection = dataSource.getConnection();
    }

    @Override
    public int add(EventoModel entity) {
        String sql = "INSERT INTO eventos (titulo, descricao, data, tipo, id_municipio) VALUES (?, ?, ?, ?, ?)";

        try {
            connection.setAutoCommit(false);
            try (PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

                ps.setString(1, entity.getTitulo());
                ps.setString(2, entity.getDescricao());
                ps.setString(3, entity.getData());
                ps.setString(4, entity.getTipo());

                if (entity.getIdMunicipio() != null) ps.setLong(5, entity.getIdMunicipio());
                else ps.setNull(5, Types.BIGINT);

                ps.executeUpdate();

                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        entity.setId(rs.getLong(1));
                    }
                }
            }

            connection.commit();
            return entity.getId().intValue();

        } catch (SQLException e) {
            try { connection.rollback(); } catch (SQLException ex) { throw new RuntimeException(ex); }
            throw new RuntimeException(e);
        }
    }

    @Override
    public void remove(int id) {
        String sql = "DELETE FROM eventos WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public EventoModel readByID(int id) {
        String sql = "SELECT * FROM eventos WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return extractEvento(rs);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @Override
    public List<EventoModel> readAll() {
        String sql = "SELECT * FROM eventos";
        List<EventoModel> eventos = new ArrayList<>();
        try (PreparedStatement ps = connection.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                eventos.add(extractEvento(rs));
            }
            return eventos;

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void updateInformation(int id, EventoModel entity) {
        String sql = "UPDATE eventos SET titulo = ?, descricao = ?, data = ?, tipo = ?, id_municipio = ? WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, entity.getTitulo());
            ps.setString(2, entity.getDescricao());
            ps.setString(3, entity.getData());
            ps.setString(4, entity.getTipo());

            if (entity.getIdMunicipio() != null) ps.setLong(5, entity.getIdMunicipio());
            else ps.setNull(5, Types.BIGINT);

            ps.setInt(6, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // Método auxiliar para mapear ResultSet -> EventoModel
    private EventoModel extractEvento(ResultSet rs) throws SQLException {
        EventoModel evento = new EventoModel();
        evento.setId(rs.getLong("id"));
        evento.setTitulo(rs.getString("titulo"));
        evento.setDescricao(rs.getString("descricao"));
        evento.setData(rs.getString("data"));
        evento.setTipo(rs.getString("tipo"));
        evento.setIdMunicipio(rs.getObject("id_municipio") != null ? rs.getInt("id_municipio") : null);
        return evento;
    }
}
