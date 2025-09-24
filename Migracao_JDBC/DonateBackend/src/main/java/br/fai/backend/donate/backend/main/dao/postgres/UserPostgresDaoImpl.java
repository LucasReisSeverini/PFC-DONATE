package br.fai.backend.donate.backend.main.dao.postgres;

import br.fai.backend.donate.backend.main.domain.UsuarioModel;
import br.fai.backend.donate.backend.main.port.dao.user.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class UserPostgresDaoImpl implements UserDao {

    private final Connection connection;

    @Autowired
    public UserPostgresDaoImpl(DataSource dataSource) throws SQLException {
        this.connection = dataSource.getConnection();
    }

    @Override
    public int add(UsuarioModel entity) {
        // Verifica duplicidade de email
        if (readByEmail(entity.getEmail()) != null) {
            throw new RuntimeException("Email já cadastrado");
        }

        // Verifica duplicidade de CPF
        if (readByCpf(entity.getCpf()) != null) {
            throw new RuntimeException("CPF já cadastrado");
        }

        if ((entity.getDoadora() == null || !entity.getDoadora())
                && (entity.getReceptora() == null || !entity.getReceptora())
                && (entity.getProfissional() == null || !entity.getProfissional())) {
            entity.setDoadora(true);
        }

        String sql = "INSERT INTO usuario (nome, telefone, senha, email, cpf, doadora, receptora, profissional, latitude, longitude, id_municipio) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            connection.setAutoCommit(false);
            try (PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

                ps.setString(1, entity.getNome());
                ps.setString(2, entity.getTelefone());
                ps.setString(3, entity.getSenha());
                ps.setString(4, entity.getEmail());
                ps.setString(5, entity.getCpf());
                ps.setBoolean(6, entity.getDoadora());
                ps.setBoolean(7, entity.getReceptora());
                ps.setBoolean(8, entity.getProfissional());

                if (entity.getLatitude() != null) ps.setDouble(9, entity.getLatitude());
                else ps.setNull(9, Types.DOUBLE);

                if (entity.getLongitude() != null) ps.setDouble(10, entity.getLongitude());
                else ps.setNull(10, Types.DOUBLE);

                ps.setInt(11, entity.getIdMunicipio());

                ps.executeUpdate();

                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        entity.setId(rs.getInt(1));
                    }
                }
            }

            connection.commit();
            return entity.getId();

        } catch (SQLException e) {
            try { connection.rollback(); } catch (SQLException ex) { throw new RuntimeException(ex); }
            throw new RuntimeException(e);
        }
    }

    @Override
    public UsuarioModel findByCpf(String cpf) {
        return null;
    }


    @Override
    public UsuarioModel readByCpf(String cpf) {
        String sql = "SELECT * FROM usuario WHERE cpf = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, cpf);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    UsuarioModel usuario = new UsuarioModel();
                    usuario.setId(rs.getInt("id"));
                    usuario.setNome(rs.getString("nome"));
                    usuario.setTelefone(rs.getString("telefone"));
                    usuario.setSenha(rs.getString("senha"));
                    usuario.setEmail(rs.getString("email"));
                    usuario.setCpf(rs.getString("cpf"));
                    usuario.setDoadora(rs.getBoolean("doadora"));
                    usuario.setReceptora(rs.getBoolean("receptora"));
                    usuario.setProfissional(rs.getBoolean("profissional"));
                    usuario.setLatitude(rs.getObject("latitude") != null ? rs.getDouble("latitude") : null);
                    usuario.setLongitude(rs.getObject("longitude") != null ? rs.getDouble("longitude") : null);
                    usuario.setIdMunicipio(rs.getInt("id_municipio"));
                    return usuario;
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @Override
    public void remove(int id) {
        String sql = "DELETE FROM usuario WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public UsuarioModel readByID(int id) {
        String sql = "SELECT * FROM usuario WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    UsuarioModel usuario = new UsuarioModel();
                    usuario.setId(rs.getInt("id"));
                    usuario.setNome(rs.getString("nome"));
                    usuario.setTelefone(rs.getString("telefone"));
                    usuario.setSenha(rs.getString("senha"));
                    usuario.setEmail(rs.getString("email"));
                    usuario.setCpf(rs.getString("cpf"));
                    usuario.setDoadora(rs.getBoolean("doadora"));
                    usuario.setReceptora(rs.getBoolean("receptora"));
                    usuario.setProfissional(rs.getBoolean("profissional"));
                    usuario.setLatitude(rs.getObject("latitude") != null ? rs.getDouble("latitude") : null);
                    usuario.setLongitude(rs.getObject("longitude") != null ? rs.getDouble("longitude") : null);
                    usuario.setIdMunicipio(rs.getInt("id_municipio"));
                    return usuario;
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @Override
    public List<UsuarioModel> readAll() {
        String sql = "SELECT * FROM usuario";
        List<UsuarioModel> usuarios = new ArrayList<>();
        try (PreparedStatement ps = connection.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                UsuarioModel usuario = new UsuarioModel();
                usuario.setId(rs.getInt("id"));
                usuario.setNome(rs.getString("nome"));
                usuario.setTelefone(rs.getString("telefone"));
                usuario.setSenha(rs.getString("senha"));
                usuario.setEmail(rs.getString("email"));
                usuario.setCpf(rs.getString("cpf"));
                usuario.setDoadora(rs.getBoolean("doadora"));
                usuario.setReceptora(rs.getBoolean("receptora"));
                usuario.setProfissional(rs.getBoolean("profissional"));
                usuario.setLatitude(rs.getObject("latitude") != null ? rs.getDouble("latitude") : null);
                usuario.setLongitude(rs.getObject("longitude") != null ? rs.getDouble("longitude") : null);
                usuario.setIdMunicipio(rs.getInt("id_municipio"));

                usuarios.add(usuario);
            }
            return usuarios;

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void updateInformation(int id, UsuarioModel entity) {
        String sql = "UPDATE usuario SET nome = ?, telefone = ?, email = ?, cpf = ?, doadora = ?, receptora = ?, profissional = ?, latitude = ?, longitude = ? WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, entity.getNome());
            ps.setString(2, entity.getTelefone());
            ps.setString(3, entity.getEmail());
            ps.setString(4, entity.getCpf());
            ps.setBoolean(5, entity.getDoadora());
            ps.setBoolean(6, entity.getReceptora());
            ps.setBoolean(7, entity.getProfissional());

            if (entity.getLatitude() != null) ps.setDouble(8, entity.getLatitude());
            else ps.setNull(8, Types.DOUBLE);

            if (entity.getLongitude() != null) ps.setDouble(9, entity.getLongitude());
            else ps.setNull(9, Types.DOUBLE);

            ps.setInt(10, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public UsuarioModel readByEmail(String email) {
        String sql = "SELECT * FROM usuario WHERE email = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    UsuarioModel usuario = new UsuarioModel();
                    usuario.setId(rs.getInt("id"));
                    usuario.setNome(rs.getString("nome"));
                    usuario.setTelefone(rs.getString("telefone"));
                    usuario.setSenha(rs.getString("senha"));
                    usuario.setEmail(rs.getString("email"));
                    usuario.setCpf(rs.getString("cpf"));
                    usuario.setDoadora(rs.getBoolean("doadora"));
                    usuario.setReceptora(rs.getBoolean("receptora"));
                    usuario.setProfissional(rs.getBoolean("profissional"));
                    usuario.setLatitude(rs.getObject("latitude") != null ? rs.getDouble("latitude") : null);
                    usuario.setLongitude(rs.getObject("longitude") != null ? rs.getDouble("longitude") : null);
                    usuario.setIdMunicipio(rs.getInt("id_municipio"));
                    return usuario;
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @Override
    public boolean updatePassword(int id, String newPassword) {
        String sql = "UPDATE usuario SET senha = ? WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, newPassword);
            ps.setInt(2, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
