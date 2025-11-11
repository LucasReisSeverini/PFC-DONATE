package br.fai.backend.donate.backend.main.dao.postgres;

import br.fai.backend.donate.backend.main.domain.BancoLeiteModel;
import br.fai.backend.donate.backend.main.port.dao.bancoLeite.BancoLeiteDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class BancoLeitePostgresDaoImpl implements BancoLeiteDao {

    private final Connection connection;

    @Autowired
    public BancoLeitePostgresDaoImpl(DataSource dataSource) throws SQLException {
        this.connection = dataSource.getConnection();
    }

    @Override
    public int add(BancoLeiteModel entity) {
        String sql = "INSERT INTO banco_de_leite (nome, endereco, telefone, latitude, longitude, id_municipio) " +
                "VALUES (?, ?, ?, ?, ?, ?)";
        try {
            connection.setAutoCommit(false);
            try (PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, entity.getNome());
                ps.setString(2, entity.getEndereco());
                ps.setString(3, entity.getTelefone());

                if (entity.getLatitude() != null) ps.setDouble(4, entity.getLatitude());
                else ps.setNull(4, Types.DOUBLE);

                if (entity.getLongitude() != null) ps.setDouble(5, entity.getLongitude());
                else ps.setNull(5, Types.DOUBLE);

                ps.setLong(6, entity.getIdMunicipio());

                ps.executeUpdate();

                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        entity.setId(rs.getLong(1)); // ✅ usar getLong
                    }
                }
            }
            connection.commit();
            return entity.getId().intValue(); // se o retorno precisar ser int, mantém aqui; senão pode retornar long
        } catch (SQLException e) {
            try { connection.rollback(); } catch (SQLException ex) { throw new RuntimeException(ex); }
            throw new RuntimeException(e);
        }
    }


    @Override
    public void remove(int id) {
        String sql = "DELETE FROM banco_de_leite WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public BancoLeiteModel readByID(int id) {
        String sql = "SELECT * FROM banco_de_leite WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    BancoLeiteModel banco = new BancoLeiteModel();
                    banco.setId(rs.getLong("id"));
                    banco.setNome(rs.getString("nome"));
                    banco.setEndereco(rs.getString("endereco"));
                    banco.setTelefone(rs.getString("telefone"));
                    banco.setLatitude(rs.getObject("latitude") != null ? rs.getDouble("latitude") : null);
                    banco.setLongitude(rs.getObject("longitude") != null ? rs.getDouble("longitude") : null);
                    banco.setIdMunicipio(rs.getLong("id_municipio"));
                    return banco;
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @Override
    public List<BancoLeiteModel> readAll() {
        String sql = "SELECT * FROM banco_de_leite";
        List<BancoLeiteModel> bancos = new ArrayList<>();
        try (PreparedStatement ps = connection.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                BancoLeiteModel banco = new BancoLeiteModel();
                banco.setId(rs.getLong("id"));
                banco.setNome(rs.getString("nome"));
                banco.setEndereco(rs.getString("endereco"));
                banco.setTelefone(rs.getString("telefone"));
                banco.setLatitude(rs.getObject("latitude") != null ? rs.getDouble("latitude") : null);
                banco.setLongitude(rs.getObject("longitude") != null ? rs.getDouble("longitude") : null);
                banco.setIdMunicipio(rs.getLong("id_municipio"));
                bancos.add(banco);
            }

            return bancos;

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void updateInformation(int id, BancoLeiteModel entity) {
        String sql = "UPDATE banco_de_leite SET nome=?, endereco=?, telefone=?, latitude=?, longitude=?, id_municipio=? WHERE id=?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, entity.getNome());
            ps.setString(2, entity.getEndereco());
            ps.setString(3, entity.getTelefone());

            if (entity.getLatitude() != null) ps.setDouble(4, entity.getLatitude());
            else ps.setNull(4, Types.DOUBLE);

            if (entity.getLongitude() != null) ps.setDouble(5, entity.getLongitude());
            else ps.setNull(5, Types.DOUBLE);

            ps.setLong(6, entity.getIdMunicipio());
            ps.setInt(7, id);

            ps.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
