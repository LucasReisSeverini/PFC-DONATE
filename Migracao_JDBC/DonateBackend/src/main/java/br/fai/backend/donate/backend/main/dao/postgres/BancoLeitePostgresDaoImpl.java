package br.fai.backend.donate.backend.main.dao.postgres;

import br.fai.backend.donate.backend.main.domain.BancoLeiteModel;
import br.fai.backend.donate.backend.main.port.dao.bancoLeite.BancoLeiteDao;


import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BancoLeitePostgresDaoImpl implements BancoLeiteDao {

    private final Connection connection;

    public BancoLeitePostgresDaoImpl(Connection connection) {
        this.connection = connection;
    }

    @Override
    public int add(BancoLeiteModel entity) {
        String sql = "INSERT INTO banco_leite_model (nome, endereco, telefone, latitude, longitude) " +
                "VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement ps = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, entity.getNome());
            ps.setString(2, entity.getEndereco());
            ps.setString(3, entity.getTelefone());
            if (entity.getLatitude() != null) {
                ps.setDouble(4, entity.getLatitude());
            } else {
                ps.setNull(4, Types.DOUBLE);
            }
            if (entity.getLongitude() != null) {
                ps.setDouble(5, entity.getLongitude());
            } else {
                ps.setNull(5, Types.DOUBLE);
            }
            ps.executeUpdate();
            ResultSet rs = ps.getGeneratedKeys();
            if (rs.next()) {
                int id = rs.getInt(1);
                return id;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return 0;
    }

    @Override
    public void remove(int id) {
        String sql = "DELETE FROM banco_leite_model WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public BancoLeiteModel readByID(int id) {
        String sql = "SELECT * FROM banco_leite_model WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new BancoLeiteModel(
                        rs.getInt("id"),
                        rs.getString("nome"),
                        rs.getString("endereco"),
                        rs.getString("telefone"),
                        rs.getDouble("latitude"),
                        rs.getDouble("longitude")
                );
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @Override
    public List<BancoLeiteModel> readAll() {
        List<BancoLeiteModel> bancos = new ArrayList<>();
        String sql = "SELECT * FROM banco_leite_model";
        try (PreparedStatement ps = connection.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                bancos.add(new BancoLeiteModel(
                        rs.getInt("id"),
                        rs.getString("nome"),
                        rs.getString("endereco"),
                        rs.getString("telefone"),
                        rs.getDouble("latitude"),
                        rs.getDouble("longitude")
                ));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return bancos;
    }

    @Override
    public void updateInformation(int id, BancoLeiteModel entity) {
        String sql = "UPDATE banco_leite_model SET nome=?, endereco=?, telefone=?, latitude=?, longitude=? WHERE id=?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, entity.getNome());
            ps.setString(2, entity.getEndereco());
            ps.setString(3, entity.getTelefone());
            if (entity.getLatitude() != null) ps.setDouble(4, entity.getLatitude()); else ps.setNull(4, Types.DOUBLE);
            if (entity.getLongitude() != null) ps.setDouble(5, entity.getLongitude()); else ps.setNull(5, Types.DOUBLE);
            ps.setInt(6, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
